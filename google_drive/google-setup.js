const { google } = require("googleapis");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

const CLIENT_ID = Env.get("CLIENT_ID");
const CLIENT_SECRECT = Env.get("CLIENT_SECRECT");
const REFRESH_TOKEN = Env.get("REFRESH_TOKEN");
const ACCESS_TOKEN = Env.get("ACCESS_TOKEN");
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRECT,
  REDIRECT_URI
);

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const docs = google.docs({version: 'v1', auth:oauth2Client});

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN, access_token: ACCESS_TOKEN });

module.exports = {drive, docs};
