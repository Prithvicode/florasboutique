import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

// Add: Filter to validate file as image.
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
