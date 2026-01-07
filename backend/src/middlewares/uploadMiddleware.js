const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if(!file.mimetype.startsWith("image/")){
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter });


