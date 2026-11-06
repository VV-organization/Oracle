import json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
out=Path(__file__).parent
checks=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    for theme,layout in [('green','cards'),('orange','columns')]:
        for lang,width in [('ru',390),('en',768)]:
            c=b.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
            page=c.new_page();page.goto(f'http://127.0.0.1:5173/?theme={theme}&layout={layout}&lang={lang}&screen=login')
            page.locator('#auth-input').fill('+7 (999) 123-45-67');page.locator('#auth-input').press('Enter')
            expect(page.locator('.auth-subtitle')).to_contain_text('+79991234567')
            page.locator('#auth-input').fill('123 456');page.locator('#auth-input').press('Enter')
            expect(page.locator('#register-name')).to_be_focused()
            other='EN' if lang=='ru' else 'RU';page.get_by_role('button',name=other,exact=True).click()
            expect(page.locator('html')).to_have_attribute('lang','en' if lang=='ru' else 'ru')
            expect(page.locator('.auth-confirmed-contact')).to_contain_text('+79991234567')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            checks.append(f'{theme}/{lang}/{width}: phone normalization, pasted OTP, profile focus, locale switch preserves contact, no overflow')
            page.screenshot(path=str(out/f'{theme}-{width}-profile-switched.png'),full_page=True)
            c.close()
    b.close()
(out/'matrix-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print('PASS',len(checks),'matrix combinations')
