"""Account-switch regression: the previous owner must not survive a new access attempt."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
out=Path(__file__).parent
checks=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    for theme,layout in [('green','cards'),('orange','columns')]:
        c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        page=c.new_page()
        base=f'http://127.0.0.1:5173/?theme={theme}&layout={layout}&lang=ru'
        def otp(contact):
            page.locator('#auth-input').fill(contact);page.locator('.auth-primary').click()
            expect(page.locator('.auth-shell')).to_have_attribute('data-auth-screen','code')
            page.locator('#auth-input').fill('123456');page.locator('.auth-primary').click()
            expect(page.locator('#register-name')).to_be_visible()
        page.goto(base+'&screen=login');otp('owner-a@example.test')
        page.locator('#register-name').fill('Owner A');page.locator('.auth-primary').click()
        expect(page.locator('.auth-shell')).to_have_count(0)
        saved=page.evaluate("sessionStorage.getItem('oraclepay.auth-preview.session')")
        assert saved and 'Owner A' in saved
        page.goto(base+'&screen=login');otp('owner-b@example.test')
        assert page.evaluate("sessionStorage.getItem('oraclepay.auth-preview.session')") in [None,'null']
        checks.append(theme+' starting B invalidates A session')
        page.goto(base+'&screen=home')
        expect(page.locator('.auth-shell')).to_have_attribute('data-auth-screen','register')
        expect(page.locator('.auth-confirmed-contact')).to_contain_text('owner-b@example.test')
        checks.append(theme+' direct Home preserves B profile gate')
        page.reload();expect(page.locator('.auth-confirmed-contact')).to_contain_text('owner-b@example.test')
        checks.append(theme+' reload preserves B context without A')
        page.locator('#register-name').fill('Owner B');page.locator('.auth-primary').click()
        expect(page.locator('.auth-shell')).to_have_count(0)
        assert 'Owner B' in page.evaluate("sessionStorage.getItem('oraclepay.auth-preview.session')")
        checks.append(theme+' completion enters B only')
        page.goto(base+'&screen=login')
        page.evaluate("""() => {const oldRemove=Storage.prototype.removeItem; const oldSet=Storage.prototype.setItem; Storage.prototype.removeItem=function(k){if(k==='oraclepay.auth-preview.session')throw Error('blocked');return oldRemove.call(this,k)};Storage.prototype.setItem=function(k,v){if(k==='oraclepay.auth-preview.session')throw Error('blocked');return oldSet.call(this,k,v)}}""")
        page.locator('#auth-input').fill('owner-c@example.test');page.locator('.auth-primary').click()
        expect(page.locator('[role=alert]')).to_be_visible()
        expect(page.locator('.auth-shell')).to_have_attribute('data-auth-screen','login')
        checks.append(theme+' failed invalidation blocks new OTP')
        c.close()
    b.close()
(out/'switch-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print('PASS',len(checks),'account-switch checks')
