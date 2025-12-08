import { Router } from "express";
import {
  createHotspotController,
  updateHotspotController,
  deleteHotspotController
} from "../controllers/hotspots.controller.js";

const router = Router();

router.post("/", createHotspotController);
router.patch("/:id", updateHotspotController);
router.delete("/:id", deleteHotspotController);

export default router;
