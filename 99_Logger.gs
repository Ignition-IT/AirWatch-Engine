//set to "true" to turn on logging, "false" to turn off
var logging = false;

function log(header, logs) {
  if (logging == false) {
    return;
  }
  
  try {
    logs = JSON.stringify(logs);
  }
  catch(err) {
  };
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
  var timestamp = new Date();
  var json = {};
  json[header] = logs;
  json["Timestamp"] = timestamp;
  
  var keys = Object.keys(json).sort();
  var last = sheet.getLastColumn();
  var header = sheet.getRange(1, 1, 1, last).getValues()[0];
  
  var newCols = [];
  
  for (var k = 0; k < keys.length; k++) {
    if (header.indexOf(keys[k]) === -1) {
      newCols.push(keys[k]);
    }
  }
  
  if (newCols.length > 0) {
    sheet.insertColumnsAfter(last, newCols.length);
    sheet.getRange(1, last + 1, 1, newCols.length).setValues([newCols]);
    header = header.concat(newCols);
  }
  
  var row = [];
  Logger.log(row);
  for (var h = 0; h < header.length; h++) {
    row.push(header[h] in json ? json[header[h]] : "");
  }
  
  sheet.appendRow(row);
  sheet.sort(1, false);
};
