# How to Use the Export Hub

## What is this feature?

The Export Hub lets you download your expense data in the format of your choice, send it to cloud services like Google Sheets or Dropbox, set up automatic recurring exports, and share a read-only view of your expenses with others — all without leaving the app.

## How to access it

On the **Dashboard** page, click the **Export Hub** button in the top-right corner of the screen. A panel will slide in from the right side. Click anywhere on the dark area to the left of the panel, or click the **Close** button at the very bottom of the left-side icon strip, to close it.

[SCREENSHOT: Top-right corner of the Dashboard page showing the dark "Export Hub" button with the stacked-layers icon]

---

## Step-by-step guide

### Downloading a pre-built report (Templates tab)

1. **Open Export Hub** — click the "Export Hub" button on the Dashboard.
2. **Select a template** — you will see four report cards:
   - **Tax Report** — all expenses sorted by category, great for tax time (PDF)
   - **Monthly Summary** — only expenses from the current month (CSV)
   - **Category Analysis** — a full breakdown of spending by category across all time (JSON)
   - **Quarterly Review** — the last 90 days, useful for business reporting (CSV)
   Click the card for the report you want.

   [SCREENSHOT: Templates tab showing the four report cards with their icons and format badges]

3. **Choose how to export** — five destination buttons appear across the top of the detail screen:
   - **Download** — saves a file directly to your computer
   - **Email** — enter an email address to send the file
   - **Sheets** — syncs to Google Sheets
   - **Dropbox** — saves to your Dropbox folder
   - **OneDrive** — saves to Microsoft OneDrive
   Click the one you want.

   [SCREENSHOT: Template detail screen with the five destination buttons highlighted]

4. **Enter your email address** (if you chose Email) — type the recipient address in the field that appears.
5. **Click the Export button** at the bottom — it shows the format and destination (e.g. "Export PDF via Download"). The button will briefly show "Done! Added to history" when complete.
6. **Check your downloads folder** (if you chose Download) — the file will be there. PDF exports open a print dialog instead; click **Print** or **Save as PDF** in your browser.

   [SCREENSHOT: Export button in loading state, then success state reading "Done! Added to history"]

---

### Downloading any format you want (Destinations tab)

1. **Click the globe icon** (Destinations) in the left icon strip.
2. **Scroll to "Quick Download"** at the bottom of the panel.
3. **Pick your format** — click **CSV**, **JSON**, or **PDF**.
4. **Click the download button** — the file downloads immediately.

   [SCREENSHOT: Destinations tab showing the Quick Download section with the three format buttons]

You can also **connect cloud services** (Google Sheets, Dropbox, OneDrive) in the Cloud Integrations section at the top of this tab, or **send a CSV by email** using the "Send by Email" section.

---

### Setting up automatic recurring exports (Schedule tab)

1. **Click the repeat icon** (Schedule) in the left icon strip.
2. **Turn on the "Automated Exports" toggle** — it will turn violet when active.
3. **Choose a frequency** — Daily, Weekly, or Monthly.
4. **Choose a template** — select which report to export automatically.
5. **Choose a destination** — select where to send it.
6. **Click "Save schedule"** — the panel shows the next scheduled run date.

   [SCREENSHOT: Schedule tab with the toggle enabled, Weekly selected, and the next-run date displayed]

---

### Viewing past exports (History tab)

1. **Click the clock icon** (History) in the left icon strip.
2. Your previous exports are listed with the template name, format badge, destination, number of records, and how long ago the export ran.
3. To wipe the list, click **Clear history** at the bottom.

   [SCREENSHOT: History tab showing a list of past export entries with green checkmarks]

---

### Sharing your expense data (Share tab)

1. **Click the share icon** (Share) in the left icon strip.
2. **Click "Generate Link"** — a shareable URL appears.
3. **Click "Copy"** to copy the link to your clipboard.
4. **Optionally**, set an expiry time (24 hours, 7 days, 30 days, or Never) and add a password.
5. A **QR code** appears automatically — you can download it as an SVG image by clicking "Download SVG".
6. To email the link directly, enter an address in the "Quick Share" section and click **Send**.

   [SCREENSHOT: Share tab with a generated link, the copy button, and the QR code visible]

---

## Common questions

**Q: What file format should I choose?**
A: Use **CSV** if you want to open your expenses in Excel, Google Sheets, or Numbers. Use **PDF** if you want a nicely formatted printable report. Use **JSON** if you are a developer and want to import the data into another tool.

**Q: Does my data get sent to the internet?**
A: No. All your expense data is stored only on your own device. Downloads go straight to your computer. Email sending, cloud connections, and share links are currently simulated — no real data leaves your browser.

**Q: I clicked Export PDF but nothing downloaded. What happened?**
A: PDF export opens a **print dialog** in a new browser tab instead of downloading a file directly. If nothing appeared, your browser may have blocked the pop-up. Look for a pop-up blocked notification in your browser's address bar and allow it, then try again.

**Q: Will my scheduled exports actually run automatically?**
A: The schedule settings are saved, but automatic execution is not yet active. The feature currently shows you when the next run would happen. Future updates will run exports in the background.

**Q: How many exports are kept in History?**
A: The History tab stores your 50 most recent exports. Older entries are removed automatically when the list exceeds 50.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PDF export opens a blank tab with no print dialog | Your browser is blocking pop-ups. Click the pop-up blocked icon in the address bar and allow pop-ups from this site, then try the export again. |
| "Copy" button on the share link does nothing | Your browser may not support clipboard access on insecure connections. Try using HTTPS or a modern browser like Chrome or Firefox. |
| Download button stays disabled | The selected template returned zero matching expenses (for example, Monthly Summary when there are no expenses this month). Try a different template or date range. |
| History tab shows nothing after exporting | Close the Export Hub and reopen it, then check the History tab again. If the issue persists, check that your browser allows localStorage (not in private/incognito mode). |
| Schedule tab settings reset after page refresh | Make sure you clicked the **"Save schedule"** button before closing the panel. The settings are only saved when you click that button. |

---

## Related guides

- Additional user guides will be linked here as they are created.

---
*For technical details, see: [Developer guide → docs/dev/data-export-implementation.md](../dev/data-export-implementation.md)*
