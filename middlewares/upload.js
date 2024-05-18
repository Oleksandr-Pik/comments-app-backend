import multer from "multer";
import path from "path";

import { HttpError } from "../helpers/index.js";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(HttpError(400,"Invalid file type, only JPG, PNG, and GIF are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
