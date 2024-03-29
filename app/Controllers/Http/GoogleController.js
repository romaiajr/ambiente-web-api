"use strict";
const google = require("../../../google_drive/google-actions");

class GoogleController {
  async createFolder({ response, request }) {
    try {
      const data = request.all();
      const res = await google.createFolder(data.folder_name);
      response.send(res);
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }
  async createFolderInsideFolder({ response, request }) {
    try {
      const data = request.all();
      console.log(data);
      const res = await google.createFolderInsideFolder(
        data.folder_id,
        data.folder_name
      );
      response.send(res);
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }

  async createDocument({response, request}){
    try {
      const data = request.all();
      const res = await google.createSingleDocument(data.doc_title);
      response.send(res);
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }
}

module.exports = GoogleController;
