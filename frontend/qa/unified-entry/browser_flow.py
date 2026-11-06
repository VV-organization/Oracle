"""Observable local unified-entry checks. No real OTP delivery or backend is exercised."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).parent
checks = []
def check(name, condition=True):
    assert condition, name
    checks.append(name)

def screen(page, name):
    expect(page.locator('.auth-shell')).to_have_attribute('data-auth-screen', name)

def otp(page, contact):
    page.locator('#auth-input').fill(contact)
    page.locator('.auth-primary').click()
    screen(page, 'code')
    page.locator('#auth-input').fill('123456')
    page.locator('.auth-primary').click()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for theme, layout, lang, business in [('green','cards','ru',False), ('orange','columns','en',True)]:
        ctx = browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        base = f'http://127.0.0.1:5173/?layout={layout}&theme={theme}&lang={lang}'
        page.goto(base+'&screen=register'); screen(page,'login')
        check(theme+' direct profile guarded')
        page.locator('#auth-input').fill('invalid')
        page.locator('.auth-primary').click()
        expect(page.locator('[role=alert]')).to_be_visible()
        screen(page,'login'); check(theme+' invalid contact stays entry')
        contact = theme+'-unified@example.test'
        page.locator('#auth-input').fill(contact); page.locator('.auth-primary').click(); screen(page,'code')
        expect(page.locator('.auth-resend')).to_be_disabled()
        page.locator('#auth-input').fill('000000'); page.locator('.auth-primary').click()
        expect(page.locator('[role=alert]')).to_be_visible(); screen(page,'code')
        check(theme+' wrong OTP and resend cooldown')
        page.locator('#auth-input').fill('123456'); page.locator('.auth-primary').click(); screen(page,'register')
        check(theme+' unknown verified contact opens profile')
        page.locator('.auth-primary').click(); expect(page.locator('[role=alert]')).to_be_visible()
        screen(page,'register'); check(theme+' required profile fields')
        owner = 'Мария Проверкина' if not business else 'Alex Morgan'
        page.locator('#register-name').fill(owner)
        if business:
            page.get_by_role('button',name='For a business',exact=True).click()
            page.locator('.auth-primary').click(); expect(page.locator('[role=alert]')).to_be_visible()
            page.locator('#register-organization').fill('North Example Ltd')
            page.locator('#register-registrationNumber').fill('REG-2046')
        page.reload(); screen(page,'register'); expect(page.locator('#register-name')).to_have_value(owner)
        check(theme+' verified profile draft survives reload')
        page.screenshot(path=str(OUT/f'{theme}-profile-desktop.png'),full_page=True)
        page.set_viewport_size({'width':320,'height':760})
        check(theme+' profile 320 no overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        page.screenshot(path=str(OUT/f'{theme}-profile-mobile.png'),full_page=True)
        page.locator('.auth-confirmed-contact .auth-link').click(); screen(page,'login')
        page.goto(base+'&screen=register'); screen(page,'login'); check(theme+' changing contact invalidates grant')
        otp(page,'second-'+contact); screen(page,'register'); expect(page.locator('#register-name')).to_have_value('')
        check(theme+' other contact cannot inherit draft')
        page.locator('.auth-confirmed-contact .auth-link').click(); screen(page,'login')
        otp(page,contact); screen(page,'register'); expect(page.locator('#register-name')).to_have_value(owner)
        check(theme+' unfinished profile resumes after fresh OTP')
        page.evaluate("""() => { const key='oraclepay.auth-preview.contact-confirmation'; const v=JSON.parse(sessionStorage.getItem(key)); v.verifiedAt=Date.now()-301000;v.expiresAt=v.verifiedAt+300000;sessionStorage.setItem(key,JSON.stringify(v)); }""")
        screen(page,'login'); expect(page.locator('[role=alert]')).to_be_visible()
        check(theme+' expired profile confirmation returns entry')
        otp(page,contact); screen(page,'register'); expect(page.locator('#register-name')).to_have_value(owner)
        page.locator('.auth-primary').click()
        expect(page).to_have_url(__import__('re').compile('screen=home'))
        expect(page.get_by_text(owner,exact=True)).to_be_visible()
        text = page.locator('body').inner_text()
        check(theme+' new account has own owner and no fixture funds', '12 450' not in text and '2 500' not in text and 'Алексей Морозов' not in text)
        check(theme+' no enabled money actions', page.get_by_role('button',name='Пополнить',exact=True).count()==0 and page.get_by_role('button',name='Top up',exact=True).count()==0)
        page.reload(); expect(page.get_by_text(owner,exact=True)).to_be_visible(); check(theme+' session reload retains owner')
        page.get_by_role('button',name='Меню' if lang=='ru' else 'Menu',exact=True).click()
        page.get_by_role('button',name='Выйти' if lang=='ru' else 'Sign out',exact=True).click(); screen(page,'login')
        otp(page,contact); expect(page).to_have_url(__import__('re').compile('screen=home'))
        expect(page.get_by_text(owner,exact=True)).to_be_visible(); check(theme+' returning account skips profile')
        check(theme+' one saved account',page.evaluate("JSON.parse(localStorage.getItem('oraclepay.auth-preview.accounts')).length") == 1)
        check(theme+' no browser exceptions',not errors)
        ctx.close()
    browser.close()
print(json.dumps({'passed':len(checks),'checks':checks},ensure_ascii=False,indent=2))
(OUT/'browser-results.json').write_text(json.dumps({'passed':len(checks),'checks':checks},ensure_ascii=False,indent=2))
