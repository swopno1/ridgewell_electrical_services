from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Connecting to dev server...")
            # We use /auth/signin because it shouldn't require a DB connection just to render the form (usually)
            # although Next.js might try to connect anyway.
            page.goto("http://localhost:3000/auth/signin", timeout=60000)
            print("Page loaded. Taking screenshot...")
            page.screenshot(path="verification/signin_verification.png")
            print("Screenshot saved.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
