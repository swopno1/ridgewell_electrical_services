from playwright.sync_api import Page, expect, sync_playwright
import time
import os

def test_auth_pages(page: Page):
    # 1. Sign In Page
    print("Navigating to Sign In page...")
    page.goto("http://localhost:3000/auth/signin")
    page.wait_for_selector("text=Sign In")
    page.screenshot(path="verification/signin_new.png")

    # 2. Sign Up Page
    print("Navigating to Sign Up page...")
    page.goto("http://localhost:3000/auth/signup")
    page.wait_for_selector("text=Sign Up")
    page.screenshot(path="verification/signup_new.png")

    # 3. Setup Password Page
    print("Navigating to Setup Password page...")
    page.goto("http://localhost:3000/auth/setup-password?token=test&email=test@example.com")
    page.wait_for_selector("text=Complete Your Setup")
    page.screenshot(path="verification/setup_password.png")

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_auth_pages(page)
        finally:
            browser.close()
