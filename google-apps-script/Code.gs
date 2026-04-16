/**
 * Приём анкеты с сайта (GitHub Pages) - новая строка в этой Google Таблице.
 *
 * Шаги:
 * 1) Откройте нужную таблицу.
 * 2) Расширения - Apps Script - вставьте код - Сохранить.
 * 3) Развернуть - Новое развёртывание - тип "Веб-приложение":
 *    выполнять от имени: я; доступ: все.
 * 4) URL веб-приложения (строка с .../macros/s/.../exec) вставьте в
 *    SHEETS_FORM.scriptUrl в index.html.
 *
 * В первой строке листа задайте заголовки: Дата | Имя | Фамилия | Участие
 */

/** Должен совпадать с SHEETS_FORM.secret в index.html. */
var FORM_SECRET = 'mJ8kL2nQ9pR5sT7vW1xY4zA6bC0dE3fG7h';

/** Ответ на CORS preflight (на случай расширенных запросов). */
function doOptions() {
  return ContentService.createTextOutput('');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    if (data.secret !== FORM_SECRET) {
      return jsonResponse({ ok: false });
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      String(data.first || ''),
      String(data.last || ''),
      String(data.attendance || ''),
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
