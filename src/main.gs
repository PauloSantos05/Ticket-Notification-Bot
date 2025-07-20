/**
 * Ticket Status Notifier Bot
 * Google Apps Script to monitor status changes in tickets and send email notifications.
 * Author: Paulo
 * Contact: pauloribeirosantos1606@gmail.com
 */

const STATUS_COLUMN = 3; // Column C (Status)
const EMAIL_COLUMN = 4;  // Column D (Responsible Email)

function checkTicketStatusChange() {
  // Change 'Tickets' to your sheet's name if necessary
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tickets');
  if (!sheet) {
    Logger.log("Sheet 'Tickets' not found!");
    return;
  }
  const data = sheet.getDataRange().getValues();
  const cache = CacheService.getScriptCache();

  for (let i = 1; i < data.length; i++) { // Skip header row
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
