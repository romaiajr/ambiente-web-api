const { google } = require("googleapis");

const CLIENT_ID =
  "967944364149-g2si4cub1bolachsvgs6pm9q3kcba4jf.apps.googleusercontent.com";
const CLIENT_SECRECT = "wKuyeB10eLpDilriLHSnHTY6";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
"1//04o_MovwSTiU_CgYIARAAGAQSNwF-L9Irg2DboK0IruegjHkREBBhN8Ngg70iohpnSnTuutFqeZG7FMe4tyAXGdcrWJonV0G_8mo";

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
