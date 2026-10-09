/** DigitalLearn quiz-attempt collector for Google Sheets.
 * Creates one row per attempt and includes per-question correctness in JSON.
 * Do not collect Aadhaar/PAN numbers, OTPs, passwords or identity documents.
 */
const SHEET_NAME = 'QuizAttempts';

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ok:true, service:'DigitalLearn quiz collector'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.event !== 'quiz_attempt' || !data.sessionId || !Array.isArray(data.answers)) {
      throw new Error('Invalid quiz attempt payload');
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp (UTC)','Anonymous Session ID','Attempt Number','Score','Total Questions','Correct','Wrong','Percentage','Q1 Correct','Q2 Correct','Q3 Correct','Q4 Correct','Q5 Correct','Q6 Correct','Q7 Correct','Q8 Correct','Q9 Correct','Q10 Correct','Answers JSON']);
      sheet.setFrozenRows(1);
    }
    const correctness = Array.from({length:10}, (_,i) => data.answers[i] ? (data.answers[i].isCorrect ? 'Correct' : 'Wrong') : 'N/A');
    sheet.appendRow([
      data.timestamp || new Date().toISOString(), String(data.sessionId), Number(data.attemptNumber)||1,
      Number(data.score)||0, Number(data.totalQuestions)||data.answers.length, Number(data.correct)||0,
      Number(data.wrong)||0, Number(data.percentage)||0, ...correctness,
      JSON.stringify(data.answers)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message||err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
