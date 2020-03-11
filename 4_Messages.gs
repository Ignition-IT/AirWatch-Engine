var scriptProps = PropertiesService.getScriptProperties()

function getView(type, groupId) {
  var message;

  if (type == "appHomeOpened") {
    message = { 
      "type":"home",
      "blocks": [
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": ":warning: This app is still in development. Safety not guaranteed!"
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Welcome to the Ignition AirWatch Engine*\n\nChoose an option to get started:"
          }
        },
        {
          "type": "actions",
          "block_id": "appHomeMain",
          "elements": [
            {
              "type": "button",
              "action_id": "changeUser",
              "text": {
                "type": "plain_text",
                "text": "Change Enerollment User",
                "emoji": true
              },
              "value": "changeEnrollmentUser"
            }
          ]
        }
      ]
    };
  };
  
  if (type == "changeEnrollmentUser") {
    message = {
      "type": "modal",
      "callback_id": "changeEnrollmentUser",
      "title": {
        "type": "plain_text",
        "text": "Change Enrollment User",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": ":female-technologist: Use this dialoge to change the enrollment user associated with a computer in AirWatch",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "actions",
          "block_id": "selectClient",
          "elements": [
            {
              "type": "static_select",
              "action_id": "clientValue",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a client",
                "emoji": true
              },
              //"min_query_length": 0
              "options": getAirwatchGroups().options
            }
          ]
        }
      ]
    };
  };
  
  if (type == "selectEnrollmentOptions") {
    message = {
      "type": "modal",
      "callback_id": "selectEnrollmentOptions",
      "title": {
        "type": "plain_text",
        "text": "Change Enrollment User",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": ":female-technologist: Select a device and user",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "actions",
          "block_id": "selectDevice",
          "elements": [
            {
              "type": "static_select",
              "action_id": "deviceValue",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a device",
                "emoji": true
              },
              "options": getAirwatchDevices(groupId, "").options
            },
            {
              "type": "static_select",
              "action_id": "userValue",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a user",
                "emoji": true
              },
              "options": getAirwatchUsers(groupId, "").options
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Submit enrollment user change: "
          },
          "accessory": {
            "type": "button",
            "action_id": "submitUserChange",
            "text": {
              "type": "plain_text",
              "text": "Confirm",
              "emoji": true
            },
            "value": "submitUserChange"
          }
        }
      ]
    };
  };
  
  if (type == "selectEnrollmentOptionsSpecial") {
    message = {
      "type": "modal",
      "callback_id": "selectEnrollmentOptions",
      "title": {
        "type": "plain_text",
        "text": "Change Enrollment User",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": ":female-technologist: Select a device and user",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "actions",
          "block_id": "selectDevice",
          "elements": [
            {
              "type": "external_select",
              "action_id": "deviceValue",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a device",
                "emoji": true
              },
              "min_query_length": 0
            },
            {
              "type": "external_select",
              "action_id": "userValue",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a user",
                "emoji": true
              },
              "min_query_length": 0
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Submit enrollment user change: "
          },
          "accessory": {
            "type": "button",
            "action_id": "submitUserChange",
            "text": {
              "type": "plain_text",
              "text": "Confirm",
              "emoji": true
            },
            "value": "submitUserChange"
          }
        }
      ]
    };
  };
  
  if (type == "getDeviceDetails") {
    message = {
      "type": "modal",
      "callback_id": "getDeviceDetails",
      "title": {
        "type": "plain_text",
        "text": "Change Enrollment User",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Close",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": ":female-technologist: All done! Here are the results:",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "fields": getDeviceDetails(groupId)
        }
      ]
    };
  };
  
  return message;
}
