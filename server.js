const express = require("express");
const cors = require("cors");

const app = express();

// Basit güvenlik: key eşleşmezse izin yok
const SECRET_KEY = process.env.SECRET_KEY || "degistir-bunu";

app.use(cors()); // Cloudflare Pages'tan fetch için

let lastCommand = ""; // Son gönderilen komut

// Web arayüzünden komut set et
app.get("/command", (req, res) => {
  const key = req.query.key || "";
  if (key !== SECRET_KEY) return res.status(401).send("Yetkisiz");

  const cmd = (req.query.cmd || "").trim();
  if (!cmd) return res.status(400).send("Komut bulunamadı");

  lastCommand = cmd;
  console.log("Yeni komut:", cmd);
  res.send("Komut alındı: " + cmd);
});

// ESP32 komutu buradan çeker
app.get("/getcommand", (req, res) => {
  const key = req.query.key || "";
  if (key !== SECRET_KEY) return res.status(401).send("Yetkisiz");

  const cmd = lastCommand;
  lastCommand = ""; // bir kez verildikten sonra sıfırla
  res.send(cmd);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sunucu ayakta, port:", PORT));
