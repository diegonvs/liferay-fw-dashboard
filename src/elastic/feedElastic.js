import getRandomData from '../misc/DataGenerator';
import client from '../connectors/ElasticConnector';
import Info from '../connectors/Info';
import chalk from 'chalk';

export function exclude(index) {
    client.indices.delete({
        index: index
    }, (err, resp, status) => {
        console.log(`${index} deleted`, resp);
    });
};

export function bulk(body, callback) {
	client.bulk({
		body: body
	}, callback);
};

export function updateId(index, type) {
    client.count({
        index: index,
        type: type
    }, (err, res, status) => {
        return res.count;
    });
};

export function insert(index, type, obj) {
    client.index({
        index: index,
        type: type,
        body: obj
    }, (err, res, status) => {
        console.log(chalk.green.bgWhiteBright(status));
    });
};

export function search(queryObject) {
    client.search(queryObject).then(res => {
        return res.hits.hits;
    }, err => {
        console.trace(err.message);
    });
};

export function feed() {
    setInterval(() => {
        insert(getRandomData())
    }, 2000);
};

export function update() {
    console.log(chalk.orange('not implemented'));
};

export function existsId(id) {
    console.log(chalk.orange('not implemented'));
};
