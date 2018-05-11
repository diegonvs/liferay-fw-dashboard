import client from './ElasticConnector';

import chalk from 'chalk';

class Info {
    getInfo() {
        client
            .cluster
            .health({}, function (err, resp, status) {
                console.log(chalk.green(resp));
            });
    };

    checkStatus () {
        client.ping({
            requestTimeout: 1000,
        }, function (error) {
            if (error) {
                return false;
            } else {
                return true;
            }
        });
    };

    
};

module.exports = Info;