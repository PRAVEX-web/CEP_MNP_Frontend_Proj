# DigitalLearn — Responsive frontend + optional Google Sheets reporting

A single-page educational demo for DigiLocker, Aadhaar services, PAN services and digital safety. The site itself is static and works with VS Code Live Server or GitHub Pages. Quiz scoring happens in the browser.

## Run locally
1. Extract the ZIP and open `DigitalLearn_Frontend` in VS Code.
2. Right-click `index.html` → **Open with Live Server**, or open the file in a browser.
3. Complete the modules and quiz. The quiz works even if reporting is not configured.

## Optional: record quiz attempts in Google Sheets
This integration sends one row per quiz submission, including timestamp, anonymous browser-session ID, attempt number, score, correct/wrong totals, percentage and whether each of the 10 questions was right or wrong. It does not collect names, emails, Aadhaar/PAN numbers, OTPs or passwords.

### Set up the Sheet endpoint
1. Create a new Google Sheet for your project data.
2. In the Sheet, choose **Extensions → Apps Script**.
3. Copy the contents of `google-apps-script/Code.gs` into the Apps Script editor and save.
4. Choose **Deploy → New deployment → Web app**.
5. Set **Execute as: Me**. Set access to **Anyone** if your institution's policies allow public submissions; otherwise use the access policy approved by your supervisor. Authorize the script and deploy.
6. Copy the Web app URL ending in `/exec`.
7. Open `index.html` and find `const GOOGLE_SHEETS_ENDPOINT = '';` near the start of its script. Paste the URL between the quotes, e.g. `const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';`.
8. Save and reload the site. Submit a test quiz and check the `QuizAttempts` tab in the Sheet.

If you edit Apps Script later, redeploy a new version from **Deploy → Manage deployments → Edit**.

### Reporting ideas
In Google Sheets, use `COUNT` for total attempts, `AVERAGE` for score percentage, and `COUNTIF` on the Q1–Q10 Correct columns to see which concepts are least understood. For unique participants, count unique anonymous session IDs; do not confuse attempts with participants. A person retrying contributes multiple attempts but remains one session ID on that browser.

## Important limitations
- The endpoint is optional. If the URL is blank, no quiz data is transmitted.
- Browser-based submissions can be blocked by privacy settings or network policy. Test the deployed endpoint before collecting project responses.
- A public Apps Script endpoint is not an authenticated database; it is suitable for a low-risk student demonstration, not sensitive or high-assurance data. Do not collect government ID numbers, OTPs, passwords or identity documents.
- Report only actual collected responses. Do not claim 50+ responses unless the Sheet contains that many valid responses. Distinguish unique participants from total attempts.
- The website is educational and is not an official government service portal.
