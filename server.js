import express from "express";

const app = express();

/* 🔥 TO JEST NAJWAŻNIEJSZE */
app.use(express.static("public"));

/* Test endpoint */
app.get("/api", (req, res) => {
  res.json({ status: "API działa 🚀" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
