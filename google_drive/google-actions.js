const {drive, docs} = require("./google-setup");

async function createFolder(folder_name) {
  try {
    var fileMetadata = {
      name: folder_name,
      mimeType: "application/vnd.google-apps.folder",
    };
    const res = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    return res.data;
  } catch (error) {
    return error;
  }
}

async function createFolderInsideFolder(folder_id, folder_name) {
  try {
    var fileMetadata = {
      name: folder_name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folder_id],
    };
    const res = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
}

async function createDocument(folder_id, doc_title, file_type){
  try {
    var fileMetadata = {
      name: doc_title,
      parents: [folder_id],
      mimeType: `application/vnd.google-apps.${file_type}`,
    };
    const res = await drive.files.create({
      resource: fileMetadata,
      fields:"id",
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
}

async function createSingleDocument(doc_title){
  try {
    const res = await docs.documents.create({
      requestBody: {
        title: doc_title,
      },
    });
    return res.data.documentId;
  } catch (error) {
    return [error.message];
  }
}

module.exports = { createFolder, createFolderInsideFolder, createDocument, createSingleDocument };
