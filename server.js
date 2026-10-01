const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "Vidora API",
    status: "online"
  });
});

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        status: "error",
        message: "URL is required"
      });
    }

    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL"
      });
    }

    const response = await fetch(parsedUrl, {
      method: "HEAD",
      redirect: "follow"
    });

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.toLowerCase().startsWith("video/")) {
      return res.status(400).json({
        status: "error",
        message: "Direct video URL required"
      });
    }

    res.json({
      status: "success",
      download_url: response.url,
      filename: "vidora_video.mp4"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Could not process URL"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vidora API is running on port ${PORT}`);
});
