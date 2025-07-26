const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (error) {
    console.error("Puppeteer error:", error.message);
    res.status(500).send("Failed to capture screenshot");
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
