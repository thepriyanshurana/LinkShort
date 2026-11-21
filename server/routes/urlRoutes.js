
import express from "express";

import {
  createUrl,
  redirectUrl,
  getUserUrls,
  deleteUrl
} from "../controllers/urlController.js";

import { getUrlAnalytics } from "../controllers/analyticsController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create short URL
router.post("/create", authMiddleware, createUrl);

// Get logged-in user's URLs
router.get("/my-links", authMiddleware, getUserUrls);

// Get URL analytics
router.get("/analytics/:id", authMiddleware, getUrlAnalytics);

// Delete short URL
router.delete("/:id", authMiddleware, deleteUrl);

// Redirect URL
router.get("/:code", redirectUrl);

export default router;
