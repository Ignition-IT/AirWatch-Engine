//URL: WEB_APP_URL?token=TOKEN&app=APP&type=TYPE

var scriptProps = PropertiesService.getScriptProperties()

function doGet(e) {
  var params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
}

function doPost(e) {
  var params = "OK";
  
  var queryString = e.queryString
  var parameter = e.parameter
  var parameters = e.parameters 
  var contextPat = e.contextPat
  var contentLength = e.contentLength 
  var requestType = e.postData.type
  var contents = e.postData.contents
  var name = e.postData.name
  
  if (requestType == "application/json") {
    var body = JSON.parse(contents);
  };
  
  //query string parameters
  var token = parameters.token
  var app = parameters.app
  var type = parameters.type
  
  //authentication
  //set "scriptSecret" in Script Properties
  var secret = scriptProps.getProperty("scriptSecret");
  if (token == secret) {

    //filter app

    //Slack
    if (app == "slack") {
      
      //filter type

      //interaction
      if (type == "interaction") {
        var payload = JSON.parse(parameter.payload);

        log("Payload", payload);

        var eventType = payload.type;
        
        if (eventType == "block_actions") {
          var actions = payload.actions;
          var blockId = actions[0].block_id;
          var actionId = actions[0].action_id;

          log("block_actions actionId", actionId);
          
          if (actionId == "changeUser") {
            var triggerId = payload.trigger_id;
            var message = {
              "trigger_id": triggerId,
              "view": getView("changeEnrollmentUser")
            };

            log("changeUser message", message);

            slackViewsOpen(message);
          };
          
          if (actionId == "submitUserChange") {
            var deviceId = scriptProps.getProperty("deviceValue");
            var userId = scriptProps.getProperty("userValue");
            
            Utilities.sleep(3000);
            
            changeEnrollmentUser(deviceId, userId);
            
            var triggerId = payload.trigger_id;
            var view = getView("getDeviceDetails", deviceId);
            var viewId = payload.view.id;

            var message = {
              "view_id": viewId,
              "view": view
            };

            slackViewsUpdate(message);
          };
          
          if (blockId == "selectClient") {
            var groupId = actions[0].selected_option.value;
            scriptProps.setProperty("selectedGroup", groupId);
            var triggerId = payload.trigger_id;
            var viewId = payload.view.id;
            var count = getAirwatchDeviceCount(groupId);
            var view = getView("selectEnrollmentOptions", groupId);
            
            //if device count is over 100, use external "external_select" menu type
            if (count > 100) {
              view = getView("selectEnrollmentOptionsSpecial");
            };

            var message = {
              "view_id": viewId,
              "view": view
            };

            log("selectClient triggerId", triggerId);
            log("selectClient view", view);
            log("selectClient message", message);
            
            slackViewsUpdate(message);
          };
          
          //push device ID to Script Properties
          if (blockId == "selectDevice") {
            var currentId = actions[0].selected_option.value;
            scriptProps.setProperty(actionId, currentId);

            log("selectEnrollmentOptions currentId", currentId);
            log("selectEnrollmentOptions actionId", actionId);
          };
          
        };
        
        //view submission
        if (eventType == "view_submission") {
          var callbackId = payload.view.callback_id;
          
          //change enrollment user
          if (callbackId = "selectEnrollmentOptions") {
            var deviceId = scriptProps.getProperty("deviceValue");
            var userId = scriptProps.getProperty("userValue");
            
            log("selectEnrollmentOptions deviceId", deviceId);
            log("selectEnrollmentOptions userId", userId);
            
            changeEnrollmentUser(deviceId, userId);
            
            var triggerId = payload.trigger_id;
            var view = getView("getDeviceDetails", deviceId);
            var viewId = scriptProps.getProperty("lastViewId");
            var message = {
              "view_id": viewId,
              "view": view
            };
            Utilities.sleep(3000);
            slackViewsUpdate(message);
            params = message;

            log("Script Check", "error: did not return '200' properly")
          };
        };
      };
      
      //event
      if (type == "event") {
        var eventType = body.type;

        //Slack one-time URL verification
        if (eventType == "url_verification") {
          var challenge = body.challenge;
          return ContentService.createTextOutput(challenge);
        };

        //event callback
        if (eventType == "event_callback") {

          eventType = body.event.type;
          if (eventType == "app_home_opened") { 
            
            var slackUserId = body.event.user;
            var channel = body.event.channel;
            var message = {
              "user_id": slackUserId,
              "view": getView("appHomeOpened")
            }
            
            log("appHome Message", message);
            
            slackViewsPublish(message);
          };
        };
      };
      
      //menu
      if (type == "menu") {
        var payload = JSON.parse(parameter.payload)

        log("Payload", payload);

        var view = payload.view;
        var value = payload.value;
        var groupId = scriptProps.getProperty("selectedGroup");
        var actionId = payload.action_id;

        if (actionId == "clientValue") {
          var search = "&name=" + value;
          var params = JSON.stringify(getAirwatchGroups(search));
        };
        
        if (actionId == "deviceValue") {
          var search = "&user=" + value;
          var params = JSON.stringify(getAirwatchDevices(groupId, search));
        };
        
        if (actionId == "userValue") {
          var search = "&username=" + value;
          var params = JSON.stringify(getAirwatchUsers(groupId, search));
        };
        
        var output = ContentService.createTextOutput(params)
        .setMimeType(ContentService.MimeType.JSON);

        log("Output", output);

        return output;
      };
    };
  };

  return HtmlService.createHtmlOutput(params);
}
