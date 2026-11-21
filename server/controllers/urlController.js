
import Url from "../models/url.js";
import Click from "../models/click.js";
import { nanoid } from "nanoid";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

// Create short URL
export const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "Please enter a URL"
      });
    }

    let finalUrl = originalUrl.trim();

    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://")
    ) {
      finalUrl = "https://" + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      return res.status(400).json({
        message: "Please enter a valid URL"
      });
    }

    // Validate expiration date
    let expiryDate = null;

    if (expiresAt) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
        return res.status(400).json({
          message: "Invalid expiration date"
        });
      }

      expiryDate = new Date(`${expiresAt}T23:59:59.999`);

      if (Number.isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          message: "Invalid expiration date"
        });
      }

      if (expiryDate < new Date()) {
        return res.status(400).json({
          message: "Expiration date cannot be in the past"
        });
      }
    }

    // Custom alias or random code
    let shortCode = customAlias
      ? customAlias.trim()
      : nanoid(6);

    if (customAlias) {
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(shortCode)) {
        return res.status(400).json({
          message: "Alias must be 3-20 characters and contain only letters, numbers, hyphens or underscores"
        });
      }

      const existingUrl = await Url.findOne({ shortCode });

      if (existingUrl) {
        return res.status(409).json({
          message: "This custom alias is already taken"
        });
      }
    }

    const newUrl = new Url({
      originalUrl: finalUrl,
      shortCode,
      user: req.user.id,
      expiresAt: expiryDate
    });

    await newUrl.save();

    res.status(201).json({
      message: "Short URL created",
      shortUrl: "https://linkshort-backend-upje.onrender.com/" + shortCode,
      originalUrl: finalUrl,
      expiresAt: expiryDate
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This alias is already taken. Try another one."
      });
    }

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

// Get logged-in user's URLs
export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(urls);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

// Delete user's short URL
export const deleteUrl = async (req, res) => {
  try {
    const deletedUrl = await Url.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedUrl) {
      return res.status(404).json({
        message: "URL not found"
      });
    }

    res.status(200).json({
      message: "URL deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

// Redirect URL and track analytics
export const redirectUrl = async (req, res) => {
  try {
    const code = req.params.code;

    const url = await Url.findOne({
      shortCode: code
    });

    if (!url || !url.isActive) {
      return res.status(404).send("URL not found");
    }

    // Check expiration
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).send("This short link has expired");
    }

    const parser = new UAParser(req.headers["user-agent"]);

    const browser =
      parser.getBrowser().name || "Unknown";

    const device =
      parser.getDevice().type || "Desktop";

    const forwardedFor = req.headers["x-forwarded-for"];

    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.ip;

    const geo = geoip.lookup(ip);

    const country = geo ? geo.country : "Unknown";

    // Save click analytics
    try {
      await Click.create({
        url: url._id,
        browser,
        device,
        country
      });
    } catch (analyticsError) {
      console.log("Analytics tracking failed:", analyticsError.message);
    }

    url.clicks = url.clicks + 1;
    await url.save();

    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
