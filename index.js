const express = require('express');
const cors = require('cors');
const ProxyServer = require('./ProxyServer.js');
const SocksProxy = require('./SocksProxy.js');
const GatherProxy = require('./GatherProxy.js');

const port = process.env.PORT || 8080;
const updateInterval = 10; // 10 minutes;

let app = express();
app.use(cors());
app.use('/', express.static('./frontend'));
app.listen(port, () => {
    console.log(`Started server on ${port}`);
});

let proximator = new ProxyServer(GatherProxy, updateInterval);

app.get('/proxy', (req, res) => {
    let proxy = proximator.getProxy();
    console.dir(proxy);
    if (!proxy) return res.status(500).json({error: 'No proxies available'});

    return res.json(proxy);
});