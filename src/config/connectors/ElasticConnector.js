const elastic = require('elasticsearch');

const client = elastic.Client({
    host: 'https://elasticsearch-fwdashboard.wedeploy.io:443', 
    log: 'trace'
});

module.exports = client;