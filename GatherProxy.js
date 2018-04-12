const _ = require('lodash');
const ProxyAdapter = require('./ProxyAdapter.js');
const request = require('request');
const cheerio = require('cheerio');

function getTextFromNode(node) {
    while (_.size(node.children)) node = node.children[0];
    return node.data || 'undefined';
}

function extraTrim(string) {
    string = string.trim();
    if (string.startsWith('document'))
        string = string.replace(/document.write\('(.*?)'\)/, '$1');
    return string;
}

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
                            let tds = _.filter(row.children, (node) => {
                                return node.name === 'td';
                            });

                            if (_.size(tds) !== _.size(this.tableKeys)) return;

                            rowValues = [...tds]
                                .map(column => extraTrim(getTextFromNode(column)));
                        } catch (e) {
                            return;
                        }


                        let proxy = _.reduce(rowValues, (acc, obj, idx) => {
                            acc[this.tableKeys[idx]] = obj;

                            return acc;
                        }, {});

                        if (proxy.version.toLowerCase() !== 'sock5' && proxy.version.toLowerCase() !== 'sock4/5') return;

                        data.push(proxy);
                    });

                    resolve(data);
                });
            }
        );
    }

    static get tableKeys() {
        return [
            'lastCheckedAgo',
            'ipAddress',
            'port',
            'country',
            'shit',
            'version',
            'ping'
        ];
    }

    static get tableSelectorName() {
        return '#tblproxy';
    }

    static get providerUrl() {
        return 'http://www.gatherproxy.com/ru/sockslist';
    }
}

module.exports = SocksProxy;