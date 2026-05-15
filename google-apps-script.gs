const SHEET_NAME = 'Ответы гостей';
const HEADERS = [
  'Дата отправки',
  'ФИО',
  'Придет / не придет',
  'Один / вдвоем',
  'Нужен трансфер',
  'Город трансфера',
  'Район / откуда забрать',
  'Напитки',
  'Еда',
  'Аллергии / ограничения',
  'Комментарий',
  'Время с сайта'
];

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function setup() {
  const sheet = getSheet_();
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function doPost(e) {
  const sheet = getSheet_();
  const p = e.parameter || {};

  sheet.appendRow([
    new Date(),
    p.fullName || '',
    p.attendance || '',
    p.guestCount || '',
    p.transfer || '',
    p.transferCity || '',
    p.transferDistrict || '',
    p.drinks || '',
    p.food || '',
    p.allergies || '',
    p.comment || '',
    p.submittedAt || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
