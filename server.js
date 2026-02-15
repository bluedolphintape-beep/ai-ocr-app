import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js";
import OpenAI from "openai";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function extractEmail(text) {
  const emailRegex =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

app.post("/ocr", upload.single("image"), async (req, res) => {

  try {

    const tess = await Tesseract.recognize(
      req.file.path,
      "eng"
    );

    const tessText = tess.data.text;
    const tessEmail = extractEmail(tessText);

    if (tessEmail) {
      return res.json({
        email: tessEmail,
        source: "tesseract"
      });
    }

    try {

      const img = fs.readFileSync(req.file.path);
      const base64 = img.toString("base64");

      const ai = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Znajdź email na obrazie. Zwróć tylko email." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ]
      });

      const aiText = ai.choices[0].message.content;
      const aiEmail = extractEmail(aiText);

      return res.json({
        email: aiEmail || "Nie znaleziono",
        source: "openai"
      });

    } catch {
      return res.json({
        email: "Nie znaleziono",
        source: "none"
      });
    }

  } catch (e) {

    res.json({
      email: "Błąd OCR"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
