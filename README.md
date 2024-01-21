# RHDev Job Application Autofill

Follow the guide [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) to enable developer mode for chrome extensions and load the extension.

Tip! Pin the extension for easier access.

Open `test_page.html` in a live server.

Click on the extension and click "Autofill".

### Note before pushing to production

Remove `"http://localhost/*"` under `content_scripts.matches` in `manifest.json` before building production version.