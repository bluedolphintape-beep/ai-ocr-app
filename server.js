import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

/* Serwuj stronę */
app.use(express.static("public"));

/* TEST API */
app.get("/api", (req, res) => {
  res.json({ status: "API działa 🚀" });
});

/* 🔥 OCR ENDPOINT */
app.post("/ocr", upload.single("image"), async (req, res) => {

  console.log("Zdjęcie odebrane:", req.file?.filename);

  // NA RAZIE TEST
  res.json({
    email: "test@email.com"
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
