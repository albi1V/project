const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Product = require("../models/product"); // Import Product Model

const mlImageDir = path.join(__dirname, "../uploads/ml_images");
if (!fs.existsSync(mlImageDir)) {
  fs.mkdirSync(mlImageDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mlImageDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("image");

// Path to CSV file
const diseaseInfoFile = path.join(__dirname, "../data/disease_info.csv");

const predictImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.resolve(req.file.path);
  console.log("🔍 Image Path:", imagePath);

  const stats = fs.statSync(imagePath);
  if (stats.size === 0) {
    console.error("❌ Uploaded file is empty!");
    return res.status(400).json({ error: "Uploaded file is empty" });
  }

  const pythonExecutable = "V:/test/project - (loc)/ml-service/venv/Scripts/python.exe";
  const pythonScript = "V:/test/project - (loc)/ml-service/test_image.py";

  const pythonProcess = spawn(pythonExecutable, [pythonScript, imagePath]);

  let result = "";
  let errorMessage = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorMessage += data.toString();
  });

  pythonProcess.on("close", async (code) => {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("⚠️ Error deleting image:", err);
    });

    if (code === 0) {
      const outputLines = result.trim().split("\n");
      const finalPrediction = outputLines.pop().trim();
      console.log("✅ Final Prediction:", finalPrediction);

      let diseaseData = {
        description: "No information available",
        causes: "Unknown cause",
        remedies: "No remedy available",
        productName: null
      };

      fs.createReadStream(diseaseInfoFile)
        .pipe(csv())
        .on("data", (row) => {
          if (row.Class === finalPrediction) {
            diseaseData = {
              description: row.Description,
              causes: row.Causes,
              remedies: row.Remedies,
              productName: row.Products || null  // Fetch product name from CSV
            };
          }
        })
        .on("end", async () => {
          let recommendedProducts = [];
          if (diseaseData.productName) {
            const productKeywords = diseaseData.productName.split(",").map(p => p.trim()); // Split and trim keywords
            recommendedProducts = await Product.find({ name: { $in: productKeywords } }); // Find all matching products
          }
          
          //console.log("🔍 Recommended Products:", recommendedProducts);
          
          return res.json({
            prediction: finalPrediction,
            description: diseaseData.description,
            causes: diseaseData.causes,
            remedies: diseaseData.remedies,
            products: recommendedProducts // Send an array of products
          });
          
          
        });
    } else {
      console.error("🔥 ML Script Error:", errorMessage);
      return res.status(500).json({ error: "ML Model Failed", details: errorMessage });
    }
  });

  pythonProcess.on("error", (error) => {
    console.error("⚠️ Error running ML script:", error);
    res.status(500).json({ error: "Internal Server Error" });
  });
};

module.exports = { upload, predictImage };
