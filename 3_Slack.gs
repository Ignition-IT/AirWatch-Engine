var scriptProps = PropertiesService.getScriptProperties()

function getSlackParams(body) {
  var botToken = scriptProps.getProperty("slackBotToken");
  
  var headers = {
    "content-type": "application/json",
    "Authorization": "Bearer " + botToken
  };

  var params = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(body)
  };

  return params;
}

//https://api.slack.com/methods/chat.postMessage
function slackPostMessage(body) {
  var params = getSlackParams(body);
  var response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", params);
  var text = response.getContentText();
  var data = JSON.parse(text);
  var ts = data.ts;

  log("slackPostMessage data", data);
}

//https://api.slack.com/methods/views.publish
function slackViewsPublish(body) {
  var params = getSlackParams(body);
  var response = UrlFetchApp.fetch("https://slack.com/api/views.publish", params);
  var text = response.getContentText();
  var data = JSON.parse(text);
  var ts = data.ts;

  log("slackViewsPublish data", data);
}

//https://api.slack.com/methods/views.open
function slackViewsOpen(body) {
  var params = getSlackParams(body);
  var response = UrlFetchApp.fetch("https://slack.com/api/views.open", params);
  var text = response.getContentText();
  var data = JSON.parse(text);
  var view = data.view;
  var viewId = view.id;
  scriptProps.setProperty("lastViewId", viewId);
  
  log("slackViewsOpen", data);  
}

//https://api.slack.com/methods/views.update
function slackViewsUpdate(body) {
  var params = getSlackParams(body);
  var response = UrlFetchApp.fetch("https://slack.com/api/views.update", params);
  var text = response.getContentText();
  var data = JSON.parse(text);

  log("slackViewsUpdate data", data);
}

//https://api.slack.com/methods/views.push
function slackViewsPush(body) {
  var params = getSlackParams(body);
  var response = UrlFetchApp.fetch("https://slack.com/api/views.push", params);
  var text = response.getContentText();
  var data = JSON.parse(text);

  log("slackViewsPush data", data);
}
