const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

//import module from config/db.js
const dbConfig = require("../config/db");

//create a new storage from the gridfsstorage
//gridfsstorage help to connect automatically to mongodb
var storage = new GridFsStorage({
  //url must be a Standard Mongodb connection string pointing the Mongodb Dataset
  url: dbConfig.url + dbConfig.database,
  //options are mentioned in Mongodb documentation
  options: { useNewUrlParser: true, useUnifiedTopology: true },

  //Anonymous function to control the file storage in the data-base
  //Create file function
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }
    return {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});
//we use multer module to initialize middleware
var uploadFiles = multer({ storage: storage }).single("file");
//
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
