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

async function createProblema(folder_id, doc_title){
  try {
    // var fileMetadata = {
    //   name: folder_name,
    //   mimeType: "application/vnd.google-apps.folder",
    //   parents: [folder_id],
    // };
    const res = await docs.documents.create({
      title: doc_title,
    });
    print(res)
    return res.data;
  } catch (error) {
    return error.message;
  }
}

module.exports = { createFolder, createFolderInsideFolder, createProblema };
