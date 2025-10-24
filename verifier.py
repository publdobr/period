
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Get the absolute path to the local HTML file
            html_file_path = os.path.abspath('google_calendar.html')

            # Navigate to the local HTML file
            print(f"Navigating to local file: {html_file_path}")
            await page.goto(f'file://{html_file_path}')

            # Read the content script
            with open('content.js', 'r', encoding='utf-8') as f:
                content_script = f.read()

            # Mock chrome.storage and chrome.runtime
            mock_script = """
            window.chrome = {
                storage: {
                    local: {
                        get: (keys, callback) => {
                            const MOCK_STORAGE = {
                                cycleStartDate: '2024-07-28',
                                cycleLength: 28,
                                periodLength: 5
                            };
                            callback(MOCK_STORAGE);
                        }
                    }
                },
                runtime: {
                    onMessage: {
                        addListener: () => {}
                    }
                }
            };
            """

            # Inject the mock and the content script
            print("Injecting mock and content script...")
            await page.evaluate(mock_script)
            await page.evaluate(content_script)

            # Give the script a moment to apply styles
            await page.wait_for_timeout(2000)

            # Take a screenshot
            screenshot_path = 'calendar_screenshot.png'
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Save the HTML to a file for inspection
            output_path = 'calendar_dom.html'
            page_html = await page.content()
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(page_html)
            print(f"Full page DOM saved to {output_path} for debugging.")
        finally:
            print("Closing browser.")
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
