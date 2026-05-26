from playwright.sync_api import sync_playwright
import time

def verify_docs():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000/docs")
            time.sleep(5)
            content = page.content()

            checks = [
                ("Requirements Review", "Requirements Review" in content),
                ("Maintenance & Hosting", "Maintenance" in content and "Hosting" in content)
            ]

            for name, found in checks:
                if found:
                    print(f"SUCCESS: {name} found in docs")
                else:
                    print(f"FAILURE: {name} NOT found in docs")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_docs()
