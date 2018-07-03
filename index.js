'use strict';

const express = require(`express`),
      app = express(),
      bodyParser = require(`body-parser`),
      crypto = require('crypto'),
      cors = require('cors');

let PORT = process.env.PORT || 3000,
    verificationSecret = process.env.VERIFICATION_SECRET,
    allowed_domains = JSON.parse(process.env.ALLOWED_DOMAINS);

app.use(bodyParser.json());

app.get(`/`, (req, res) => {
  res.end(`<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><h1>200 ok</h1>`);
});

app.post(`/verify`, cors({
  origin: (origin, cb) => {
    if (allowed_domains.indexOf(origin) !== -1) cb(null, true);
    else cb(`Not allowed by CORS`);
  }
}), (req, res) => {
  let hmac = crypto.createHmac('sha256', verificationSecret);

  res.json({
    chatHash: hmac.update(req.body.email).digest('hex')
  });
});

app.get(`/*`, (req, res) => {
  res.end(`<h1>404 u w0t m8</h1>`);
});

app.listen(PORT, () => console.log(`http server listening on port ${ PORT }`));