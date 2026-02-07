import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("AI OCR APP DZIAŁA 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
