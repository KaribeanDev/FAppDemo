import express from "express";
import multer from "multer";
import {
  listImagesController,
  getImageWithHotspotsController,
  saveImageWithHotspotsController, // nouvelle fonction
} from "../controllers/images.controller.js";

const router = express.Router();

// Configuration Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes User
router.get("/", listImagesController);
router.get("/:id", getImageWithHotspotsController);

// Route Admin (sauvegarde finale image + hotspots)
router.post("/save", upload.single("file"), saveImageWithHotspotsController);

export default router;
