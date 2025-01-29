import multer from "multer";
import path from "path";
// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFiles = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFiles.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
    }
  },
  limits: {
    // 5MB limit
    fileSize: 5 * 1024 * 1024,
  },
});
export const uploadMiddleware = upload.single("artistList");
