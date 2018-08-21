const express = require('express');
const cors = require('cors');
const request = require('request');
const port = process.env.PORT || 8080;

let app = express();
app.use(cors());
app.use('/', express.static('./frontend'));
app.listen(port, () => {
    console.log(`Started server on ${port}`);
});

app.get('/proxy', (req, res) => {
    request(`http://firexproxy.com:4040/v1/proxy?protocol=SOCKS5`, (err, response, body) => {
            if (err) return res.status(500).json({error: err});

            let proxies = JSON.parse(body);
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];

            return res.json(proxy);
    });
});