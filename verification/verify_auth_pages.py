from playwright.sync_api import Page, expect, sync_playwright
import time
import os

def test_auth_pages(page: Page):
    # 1. Sign In Page
    print("Navigating to Sign In page...")
    page.goto("http://localhost:3000/auth/signin")
    page.wait_for_selector("text=Sign In")
    page.screenshot(path="verification/signin.png")

    # 2. Sign Up Page
    print("Navigating to Sign Up page...")
    page.goto("http://localhost:3000/auth/signup")
    page.wait_for_selector("text=Sign Up")
    page.screenshot(path="verification/signup.png")

    # 3. Forgot Password Page
    print("Navigating to Forgot Password page...")
    page.goto("http://localhost:3000/auth/forgot-password")
    page.wait_for_selector("text=Forgot Password")
    page.screenshot(path="verification/forgot_password.png")

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
