import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/report-sim", (req, res) => {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({
      error: "Missing number"
    });
  }

  const digits = number.replace(/\D/g, "");
  if (digits.length < 5) {
    return res.status(400).json({
      error: "Invalid number"
    });
  }

  // seed
  let seed = 0;
  for (const d of digits) seed += Number(d);

  // reports 3–18
  const reports = 3 + (seed % 16);

  // severity
  const severity = ["Low", "Medium", "High"][seed % 3];

  // creator data
  const creatorNumber = "+559999999999";
  const creatorCountry = detectCountry(creatorNumber);

  setTimeout(() => {
    res.json({
      target: number,
      reports,
      severity,
      creator: {
        name: "SoomoonNerd",
        number: creatorNumber,
        country: creatorCountry
      }
    });
  }, 500);
});

function detectCountry(num) {
  const map = {
    "1": "United States / Canada",
    "7": "Russia",
    "44": "United Kingdom",
    "55": "Brazil",
    "62": "Indonesia",
    "81": "Japan",
    "86": "China",
    "91": "India"
  };

  const digits = num.replace(/\D/g, "");
  for (const code of Object.keys(map).sort((a, b) => b.length - a.length)) {
    if (digits.startsWith(code)) return map[code];
  }
  return "Unknown";
}

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});