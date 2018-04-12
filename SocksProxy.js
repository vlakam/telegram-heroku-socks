const _ = require('lodash');
const ProxyAdapter = require('./ProxyAdapter.js');
const request = require('request');
const cheerio = require('cheerio');

class SocksProxy extends ProxyAdapter {

    static getList() {
        return new Promise(
            (resolve, reject) => {
                request(this.providerUrl, (err, response, body) => {
                    if (err) return reject(err);

                    let $ = cheerio.load(body);
                    let table = $(this.tableSelectorName);
                    if (table.length === 0) return reject('Could not find proxy table');

                    let data = [];
                    let tableRows = table.find('tbody tr');
                    tableRows.each((idx, row) => {
                        let rowValues;

                        try {
                            rowValues = [...row.children]
                                .map(column => column.children[0].data);
                        } catch (e) {
                            return;
                        }

                        let proxy = _.reduce(rowValues, (acc, obj, idx) => {
                            acc[this.tableKeys[idx]] = obj;

                            return acc;
                        }, {});

                        if (proxy.version !== 'Socks5') return;

                        data.push(proxy);
                    });

                    resolve(data);
                });
            }
        );
    }

    static get tableKeys() {
        return [
            'ipAddress',
            'port',
            'countryCode',
            'countryPretty',
            'version',
            'anonimity',
            'isHttps',
            'lastCheckedAgo'
        ];
    }

    static get tableSelectorName() {
        return '#proxylisttable';
    }

    static get providerUrl() {
        return 'https://www.socks-proxy.net';
    }
}

module.exports = SocksProxy;