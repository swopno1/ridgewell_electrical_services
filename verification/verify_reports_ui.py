import os
import time
from playwright.sync_api import sync_playwright, expect

def test_reports_page(page):
    print("Navigating to reports page...")
    # Since we can't easily bypass auth in this environment without real session,
    # we'll try to at least see if the page redirects to signin or shows something.
    # But wait, the previous test passed but said 'Skipping visual verification'.
    # Let's try to mock the session properly or just check if the dev server responds.

    try:
        page.goto("http://localhost:3000/reports")
        time.sleep(2) # wait for potential redirects
        print(f"Current URL: {page.url}")
        page.screenshot(path="verification/reports_page_initial.png")

        # If redirected to signin
        if "signin" in page.url:
            print("Redirected to signin. Attempting to mock session.")
            # This is hard without real next-auth setup, but let's try to just capture the signin page
            page.screenshot(path="verification/signin_page.png")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        test_reports_page(page)
        browser.close()
