const _ = require('lodash');

class ProxyServer {
    constructor(proxyAdapter, intervalMin) {
        this.proxyAdapter = proxyAdapter;
        this.proxyList = [];
        this.updateProxies();

        setInterval(this.updateProxies.bind(this), intervalMin * 1000 * 60);
    }

    getProxy() {
        return _.sample(this.proxyList);
    }

    updateProxies() {
        this.proxyAdapter.getList().then((list) => {
            this.proxyList = list;
        });
    }
}

module.exports = ProxyServer;