import os
import time
import re
from playwright.sync_api import sync_playwright, expect

def verify_calendar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Sign up a new user
        print("Signing up...")
        page.goto("http://localhost:3000/auth/signup")
        page.fill('input[name="name"]', 'Test User')
        page.fill('input[name="email"]', 'test-calendar-2@example.com')
        page.fill('input[name="password"]', 'Password@123')
        page.click('button[type="submit"]')

        time.sleep(3)

        # 2. Look for verification link in logs
        print("Checking logs for verification link...")
        with open('dev_output.log', 'r') as f:
            logs = f.read()

        # Pattern: http://localhost:3000/auth/verify-email?token=...
        match = re.search(r'http://localhost:3000/auth/verify-email\?token=[^\s\n]+', logs)
        if match:
            verify_url = match.group(0)
            print(f"Found verification URL: {verify_url}")
            page.goto(verify_url)
            time.sleep(2)
        else:
            print("Verification link not found in logs")

        # 3. Sign in
        print("Signing in...")
        page.goto("http://localhost:3000/auth/signin")
        page.fill('input[name="email"]', 'test-calendar-2@example.com')
        page.fill('input[name="password"]', 'Password@123')
        page.click('button[type="submit"]')
        time.sleep(3)

        # 4. Go to calendar
        print(f"Navigating to calendar... Current URL: {page.url}")
        page.goto("http://localhost:3000/calendar")
        time.sleep(5)

        # Take screenshot
        page.screenshot(path="/home/jules/verification/calendar_view.png")
        print(f"Final URL: {page.url}")

        # Check for Calendar heading
        heading = page.query_selector('h1')
        if heading:
            print(f"Heading found: {heading.inner_text()}")

        browser.close()

if __name__ == "__main__":
    verify_calendar()
