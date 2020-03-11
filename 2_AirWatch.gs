var scriptProps = PropertiesService.getScriptProperties();

//return AW authentication params for UrlFetchApp API calls
function getAirwatchParams() {
  
  //remember to set your Script Properties
  var username = scriptProps.getProperty("airWatchUsername");
  var password = scriptProps.getProperty("airWatchPassword");
  var tenantCode = scriptProps.getProperty("airWatchTenantCode");

  var airwatchHeaders = {
    "Authorization": "Basic " + " " + Utilities.base64Encode(username + ":" + password),
    "aw-tenant-code": tenantCode,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  
  var airwatchParams = {
    "method": "get",
    "headers": airwatchHeaders
  };
  
  return airwatchParams;  
}

//return an object with an array of group names formatted for Slack modal selector
function getAirwatchGroups(search) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/system/groups/search?orderby=Id" + search, airwatchParams);  
  var text = response.getContentText();
  var json = JSON.parse(text);
  var data = json.LocationGroups;

  var airwatchGroups = {
    "options": []
  };

  for (var i = 0; i < data.length; i++) {
    var value = data[i].Id.Value
    airwatchGroups.options[i] = {
      "text": {
        "emoji": true,
        "type": "plain_text",
        "text": data[i].Name
      },
      "value": value.toString()
    }
  };

  log("getAirwatchGroups", airwatchGroups);

  return airwatchGroups;
}

//return an object with an array of computers formatted for Slack modal selector
function getAirwatchDevices(groupId, search) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/mdm/devices/search?pagesize=2000&lgid=" + groupId + search, airwatchParams);  
  var text = response.getContentText();
  var json = JSON.parse(text);
  var data = json.Devices;

  log("getAirwatchDevice data", data);

  var airwatchDevices = {
    "options": []
  };

  for (var i = 0; i < data.length; i++) {
    var name = data[i].DeviceFriendlyName;

    //Slack max characters = 75
    //shorten computer name if > 50 characters (leaves 25 characters for SN)
    if (name.length > 50) {
      name = name.substring(0, 49);
    };

    var serialNumber = data[i].SerialNumber;

    //shorten SN if > 25 characters
    if (serialNumber.length > 25) {
      serialNumber = serialNumber.substring(0, 24);
    };

    name = name + " - " + serialNumber;
    var value = data[i].Id.Value;
    airwatchDevices.options[i] = {
      "text": {
        "emoji": true,
        "type": "plain_text",
        "text": name
      },
      "value": value.toString()
    }
  };

  return airwatchDevices;
}

//return number of devices in an OG
function getAirwatchDeviceCount(groupId) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/mdm/devices/devicecountinfo?organizationgroupid=" + groupId, airwatchParams);  
  var text = response.getContentText();
  var data = JSON.parse(text);
  var count = data.TotalDevices;
  return count;
}

//return an object with an array of user names formatted for Slack modal selector
function getAirwatchUsers(groupId, search) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/system/users/search?locationgroupId=" + groupId + search, airwatchParams);  
  var text = response.getContentText();
  var json = JSON.parse(text);
  var data = json.Users;

  var airwatchUsers = {
    "options": []
  };

  for (var i = 0; i < data.length; i++) {
    var value = data[i].Id.Value
    airwatchUsers.options[i] = {
      "text": {
        "emoji": true,
        "type": "plain_text",
        "text": data[i].FirstName + " " + data[i].LastName
      },
      "value": value.toString()
    }
  };

  return airwatchUsers;
}

//change the enrollment user for the given computer
function changeEnrollmentUser(deviceId, userId) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  airwatchParams.method = "patch";
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/mdm/devices/" + deviceId + "/enrollmentuser/" + userId, airwatchParams);  
}

//get details for given computer and format for Slack modal
function getDeviceDetails(deviceId) {
  var tenant = scriptProps.getProperty("airWatchTenant");
  var airwatchParams = getAirwatchParams();
  var response = UrlFetchApp.fetch("https://" + tenant + "/api/mdm/devices/" + deviceId, airwatchParams);  
  var text = response.getContentText();
  var data = JSON.parse(text);

  var sn = data.SerialNumber;
  var name = data.DeviceFriendlyName;
  var group = data.LocationGroupName;
  var user = data.UserName;
  var model = data.Model;
  var compliance = data.ComplianceStatus;
  
  var fields = [
    {
      "type": "mrkdwn",
      "text": "*Computer:*"
    },
    {
      "type": "plain_text",
      "text": name,
      "emoji": true
    },
    {
      "type": "mrkdwn",
      "text": "*Model:*"
    },
    {
      "type": "plain_text",
      "text": model,
      "emoji": true
    },
    {
      "type": "mrkdwn",
      "text": "*User:*"
    },
    {
      "type": "plain_text",
      "text": user,
      "emoji": true
    },
    {
      "type": "mrkdwn",
      "text": "*Serial Number:*"
    },
    {
      "type": "plain_text",
      "text": sn,
      "emoji": true
    }
  ];
  
  return fields;
}
