"""Negative-path browser checks for the local auth simulation."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

out=Path(__file__).parent
checks=[]
def check(name, value=True):
    assert value,name
    checks.append(name)
def at(page,name):
    expect(page.locator('.auth-shell')).to_have_attribute('data-auth-screen',name)
def request(page,contact='edge@example.test'):
    page.locator('#auth-input').fill(contact)
    page.locator('#auth-input').press('Enter')
    at(page,'code')
def verify(page):
    page.locator('#auth-input').fill('123456')
    page.locator('#auth-input').press('Enter')
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    for theme,layout in [('green','cards'),('orange','columns')]:
        base=f'http://127.0.0.1:5173/?layout={layout}&theme={theme}&lang=ru&screen=login'
        c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');page=c.new_page()
        page.clock.install()
        page.goto(base)
        request(page)
        page.clock.fast_forward(31000)
        expect(page.locator('.auth-resend')).to_be_enabled()
        page.locator('.auth-resend').click();expect(page.locator('[role=status]')).to_be_visible()
        expect(page.locator('.auth-resend')).to_be_disabled();check(theme+' resend restarts countdown')
        page.clock.fast_forward(301000)
        verify(page);expect(page.locator('[role=alert]')).to_be_visible();at(page,'code')
        check(theme+' expired OTP never opens profile')
        page.locator('.auth-resend').click();expect(page.locator('[role=status]')).to_be_visible()
        verify(page);at(page,'register');check(theme+' fresh OTP after expiry opens profile')
        page.locator('.auth-confirmed-contact .auth-link').click();at(page,'login')
        request(page);page.reload();at(page,'login');check(theme+' code reload cannot bypass challenge')
        page.get_by_role('button',name='Нет доступа к телефону или почте?',exact=True).click();at(page,'recovery')
        page.locator('#auth-input').fill('lost@example.test');page.locator('#auth-reply').fill('reply@example.test')
        page.locator('#auth-reply').press('Enter');at(page,'recovery-result');page.reload();at(page,'recovery-result')
        page.goto(base.replace('screen=login','screen=home'));at(page,'login');check(theme+' recovery receipt gives no wallet session')
        # Corrupt account lookup must produce retry, never the new-user branch.
        page.evaluate("localStorage.setItem('oraclepay.auth-preview.accounts','broken')")
        request(page);verify(page);expect(page.locator('[role=alert]')).to_be_visible();at(page,'code')
        check(theme+' corrupt lookup is error not signup')
        page.evaluate("localStorage.removeItem('oraclepay.auth-preview.accounts')")
        verify(page);at(page,'register');check(theme+' lookup retry preserves challenge')
        page.locator('#register-name').fill('Тестовый Пользователь')
        page.evaluate("""() => { const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='oraclepay.auth-preview.session')throw new Error('blocked session');return original.call(this,k,v)} }""")
        page.locator('.auth-primary').click();at(page,'login');expect(page.locator('[role=alert]')).to_be_visible()
        check(theme+' session write failure never opens wallet')
        c.close()
        # A blocked localStorage property must not crash the UI or act as empty registry.
        c=b.new_context();c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
        page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base);request(page);verify(page);expect(page.locator('[role=alert]')).to_be_visible();at(page,'code')
        check(theme+' inaccessible registry fails closed without crash',not errors);c.close()
    b.close()
(out/'edge-results.json').write_text(json.dumps({'passed':len(checks),'checks':checks},ensure_ascii=False,indent=2))
print(json.dumps({'passed':len(checks),'checks':checks},ensure_ascii=False,indent=2))
