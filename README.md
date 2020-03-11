# AirWatch-Engine
Slack bot to control AirWatch via API. Current function includes changing the enrollment user on any computer.

<img src="https://github.com/Ignition-IT/AirWatch-Engine/blob/master/Images/app_home.png" alt="app_home">

## SETUP: ##

1. Make a copy of this Google Sheet with the GAS project attached: https://docs.google.com/spreadsheets/d/1DkIUSqdDM5fnHMG7zd7hO0EVUcaw6z9AzpL0RRHeKtw/edit?usp=sharing


2. Open the Script Editor (__Tools__ > __Script Editor__) and deploy the project as a web app (__Publish__ > __Deploy as web app...__)
	+ __Project version:__ _New_
	+ __Execute the app as:__ _Me_
	+ __Who has access to the app:__ _Anyone, even anonymous_
  

<img src="https://github.com/Ignition-IT/AirWatch-Engine/blob/master/Images/deploy_as_web_app.png" alt="deploy_as_web_app">  

<img src="https://github.com/Ignition-IT/AirWatch-Engine/blob/master/Images/set_web_app_options.png" alt="set_web_app_options" width="300">


3. Copy the web app URL and paste it into the `//URL` comment at the top of __1. Handler.gs__ for later use


4. Navigate to __File__ > __Project properties__ > __Script properties__ and set `scriptSecret` to a random password. Replace `TOKEN` in the `//URL` comment with this password


5. Go to https://api.slack.com/apps and create a new app. Set an app name, description, color, and icon (use __airwatch_square.png__ in the __Images__ folder if you'd like)


6. Add `users:read` and `users:write` to the Bot Token Scopes (__OAuth & Permissions__ > __Scopes__ > __Bot Token Scopes__ > __Add an OAuth Scope__)


7. Navigate to __App Home__ and set __Always Show My Bot as Online__ to _ON_, __Home Tab__ to _ON_, and __Messages Tab__ to _OFF_


8. Navigate to __Interactive Components__ and turn on __Interactivity__


9. Copy your Web App URL from Step 3. and set the `app=` to `slack` and the `type=` to `interaction`, then paste the link into the __Request URL__ box


10. Under __Select Menus__, paste the same URL into the __Options Load URL__ but change `type=` to `menu`. Click __Save Changes__


11. Navigate to __Event Subscriptions__ and set __Enable Events__ to _ON_


12. In the __Request URL__ box, paste the same link as Steps 9. and 10. but change the `type=` to `event`. Slack will then verify that your script succesfully returns the challenge token (see "//Slack one-time URL verification" section, around line 160 of __1. Handler.gs__)


13. Open the __Subscribe to bot events__ section and add __app_home_opened__. Click __Save Changes__


14. Navigate to __Install App__ and click __Install App to Workspace__


15. Copy the __Bot User OAuth Access Token__. Go back to the Script Editor and add it to Script Properties under `slackBotToken`


16. Publish your web app as a new version to push changes (__Publish__ > __Deploy as web app...__): Set __Project version:__ to _New_ and click __Update__


17. In Slack, open your new App (search for your app in the quick switcher). After a moment, the App Home tab should load with the AirWatch logo and the __Change Enrollment User__ button


18. Create an API admin service account: In the AirWatch console, navigate to __Accounts__ > __Administrators__ > __List View__ and click __Add__ > __Add Admin__. Set name, password, etc. Make sure to assign to a permissions role that allows for read/write API access to any OGs you'd like the Slack App to be able to access.


19. In the Script Editor, navigate to __Script properties__ and add API admin service account username as `airWatchUsername` and password as `airWatchPassword` 


20. Navigate to __Settings__ > __System__ > __Advanced__ > __API__ > __REST API__ and add an Admin API key


20. Add the AirWatch API key in __Script properties__ as `airWatchTenantCode`

21. Add your AirWatch tenant URL (e.g. "ds000.awmdm.com") in __Script properties__ as `airWatchTenant`

22. Go back to your app in Slack and click the __Change Enrollment User__ button!



--------------------------


## Notes: ##
To turn on logging, set `var logging = true;` in __99. Logger.gs__. I have various `log()` functions scattered around the code currently. Due to the speed limitations of writing logs to Google Sheets, having too many logging entries can slow the script down to the point where it extends past the strict time limitations Slack has on it's API response requirements. Comment out any `log()` entries you don't need.

Also I'd just like to mention that I'm very inexperienced with JS (and coding in general), if any part of this code sucks, please let me know!
