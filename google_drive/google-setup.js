const { google } = require("googleapis");

const CLIENT_ID =
  "967944364149-g2si4cub1bolachsvgs6pm9q3kcba4jf.apps.googleusercontent.com";
const CLIENT_SECRECT = "wKuyeB10eLpDilriLHSnHTY6";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
"1//04NVhhEr4XzN9CgYIARAAGAQSNwF-L9Ir2NAEJmJhDSjvVPxwb0xuXipRCAEDSvicudnMHePGdWCn80rGYsTARXZVr4XNGAX6X4A";

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

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = {drive, docs};
