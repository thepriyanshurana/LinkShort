
import Click from "../models/click.js";
import Url from "../models/url.js";

// Get analytics for a user's URL
export const getUrlAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found"
      });
    }

    const clicks = await Click.find({
      url: url._id
    }).sort({ clickedAt: -1 });

    const browserStats = {};
    const deviceStats = {};
    const countryStats = {};

    clicks.forEach((click) => {
      browserStats[click.browser] =
        (browserStats[click.browser] || 0) + 1;

      deviceStats[click.device] =
        (deviceStats[click.device] || 0) + 1;

      countryStats[click.country] =
        (countryStats[click.country] || 0) + 1;
    });

    res.json({
      totalClicks: url.clicks,
      browsers: browserStats,
      devices: deviceStats,
      countries: countryStats,
      recentClicks: clicks
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch analytics"
    });
  }
};
