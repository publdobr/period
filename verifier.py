
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # Navigate to Google Calendar
            print("Navigating to Google Calendar...")
            # Increased timeout for navigation as the page can be slow to load
            await page.goto('https://calendar.google.com', wait_until='networkidle', timeout=60000)

            # Wait for a few seconds to ensure all dynamic content has a chance to load
            print("Waiting for dynamic content to load...")
            await page.wait_for_timeout(5000)

            # Get the full HTML content of the page
            page_html = await page.content()

            # Save the HTML to a file for inspection
            output_path = 'calendar_dom.html'
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(page_html)
            print(f"Full page DOM saved to {output_path}")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            print("Closing browser.")
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
