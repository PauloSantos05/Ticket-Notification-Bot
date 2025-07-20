# Ticket Status Notifier Bot

A bot developed with Google Apps Script to monitor a Google Sheets ticket log and automatically send email alerts whenever the status of a ticket is updated.

---

## 📌 Features

- Automatically tracks status changes in helpdesk tickets managed in Google Sheets.
- Sends email notifications to responsible users when a ticket status changes.
- Easy to adapt for any support workflow that uses Google Workspace.

---

## 🚀 How to Use

1. **Create a Google Sheets spreadsheet** 
<img width="329" height="312" alt="image" src="https://github.com/user-attachments/assets/cca811e0-8e2c-43c9-9d8d-506819bbfa89" />

with the following columns:
    - **A:** Ticket ID
    - **B:** Description
    - **C:** Status (e.g., Open, In Progress, Closed)
    - **D:** Responsible User Email.
<img width="608" height="92" alt="image" src="https://github.com/user-attachments/assets/a9e3a029-dd41-48ab-be5d-cb888857e9a8" />

2. **Open the Apps Script editor** (`Extensions` > `Apps Script`) on your spreadsheet and paste the code from `src/main.gs`.  
1- <img width="640" height="68" alt="image" src="https://github.com/user-attachments/assets/0777a685-adc8-47c4-b824-afd8b44fdcdb" />  
2- <img width="321" height="210" alt="image" src="https://github.com/user-attachments/assets/208d81b1-7573-4adc-839b-f4a3428ea0a4" />  
3- <img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/6cd4c5be-269d-4d3e-99ea-5fa249210f2b" />  

3. **Save the project** and grant any necessary permissions.

4. **Set up a trigger** to run the `checkTicketStatusChange` function every 5 or 10 minutes:
    - In the Apps Script editor: Go to "Triggers" (clock icon) > "Add Trigger" > Select the function and desired frequency.

5. **Done!** Whenever a ticket status is updated, the responsible user will receive an email alert.

---

## 🧑‍💻 Example Code (`src/main.gs`)

```javascript
/**
 * Google Apps Script to monitor status changes in tickets and send email notifications.
 */

const STATUS_COLUMN = 3; // Column C
const EMAIL_COLUMN = 4;  // Column D

function checkTicketStatusChange() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tickets');
  const data = sheet.getDataRange().getValues();
  const cache = CacheService.getScriptCache();
  
  for (let i = 1; i < data.length; i++) { // Skip header
    const ticketId = data[i][0];
    const currentStatus = data[i][STATUS_COLUMN - 1];
    const email = data[i][EMAIL_COLUMN - 1];

    const cacheKey = 'ticket-' + ticketId;
    const lastStatus = cache.get(cacheKey);

    if (lastStatus && lastStatus !== currentStatus) {
      MailApp.sendEmail({
        to: email,
        subject: `Ticket #${ticketId} - Status Updated`,
        body: `The status of ticket #${ticketId} has changed from "${lastStatus}" to "${currentStatus}".`
      });
    }
    cache.put(cacheKey, currentStatus, 21600); // 6 hours
  }
}
