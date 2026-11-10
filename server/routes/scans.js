const express = require("express");
const Scan = require("../models/Scan");
const authenticate = require("../middleware/auth");
const { analyzeJob } = require("../services/riskEngine");

const router = express.Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const { input, jobTitle } = req.body;

    if (typeof input !== "string" || !input.trim()) {
      return res.status(400).json({ message: "Enter a job description or URL to analyze." });
    }

    if (input.trim().length > 15000) {
      return res.status(400).json({ message: "Input must be 15,000 characters or fewer." });
    }

    const result = analyzeJob(input.trim());

    const scan = await Scan.create({
      user: req.userId,
      jobTitle:
        typeof jobTitle === "string" && jobTitle.trim()
          ? jobTitle.trim().slice(0, 120)
          : "Untitled job",
      input: input.trim(),
      ...result
    });

    res.status(201).json({ scan });
  } catch {
    res.status(500).json({ message: "Unable to analyze this submission." });
  }
});

router.get("/", async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.userId })
      .select("-input")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ scans });
  } catch {
    res.status(500).json({ message: "Unable to load scan history." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(400).json({ message: "Invalid scan ID." });
    }

    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found." });
    }

    res.json({ scan });
  } catch {
    res.status(500).json({ message: "Unable to load this scan." });
  }
});

module.exports = router;