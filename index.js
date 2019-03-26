const axios = require('axios');
const cors = require('cors');
const express = require('express');

const port = process.env.PORT || 8080;
let app = express();
app.use(cors());
app.use('/', express.static('./frontend'));
app.listen(port, () => {
    console.log(`Started server on ${port}`);
});

const axiosInstance = axios.create();
axiosInstance.defaults.headers.common['User-Agent'] = 'telegramsocks.tk/0.0.1';

app.get('/proxy', async (req, res) => {
    try {
        const result = await axiosInstance.get(`http://api.firexproxy.com/v1/proxy?protocol=SOCKS5`);
        console.log(result);

        let proxies = result.data;
        let proxy = proxies[Math.floor(Math.random() * proxies.length)];
        return res.json(proxy);
    } catch (err) {
        res.status(500).json({error: err});
    }
});
