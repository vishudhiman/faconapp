import express from "express";
import { uploadMultiple, uploadSingle } from "../controllers/uploadController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("file"), uploadSingle);

router.post("/images", upload.array("files", 4), uploadMultiple);

export default router;

