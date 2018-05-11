// issuetype in (Bug, "Regression Bug") AND component in (subcomponents(LPS, Forms, "true"), subcomponents(LPS, "Dynamic Data Lists", "true"), subcomponents(LPS, "Web Form", "true"), subcomponents(LPS, "Dynamic Data Mapping", "true"), subcomponents(LPS, Polls, "true")) AND createdDate >= 2017-01-01 AND createdDate < 2018-01-01 ORDER BY created ASC
import client from './config/connectors/ElasticConnector';

import searchJira from './jira/jira';

import {
	updateFixPriorityField,
	analyzeHistory
} from './utils/utils';

import * as later from 'later';
// import { createChain } from './jira/jira';

// let schedDefinition = later.parse.text('at 5:00am every weekday');
// let schedDefinition = later.parse.text('at 7:15pm every weekday');

// let timer = later.setTimeout(() => {
// 	search();
// 	createChain(['2018', '2017']);
// }, schedDefinition);

Array.prototype.forEach = function (a) {
	var l = this.length;
	for (var i = 0; i < l; i++)a(this[i], i)
}

function search() {
	client.search({
		index: "fwdashboard",
		size: 10000
	}).then(function (body) {
		let hits = body.hits.hits;

		hits.forEach(function (issue) {
			body.push({
				index: {
					_index: 'fwdashboard_analyze',
					_type: 'issues',
					_id: issue._source.id
				}
			});
			let updatedIssue = updateFixPriorityField(issue._source);
			body.push(analyzeHistory(updatedIssue));
		});

		client.bulk({
			body: body
		}, (err, res, status) => {
			console.log("Done");
		})
	}, function (error) {
		console.trace(error.message);
	});
};

let chain;

export function createChain(years, months) {
	if (!months || months == '') {
		months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	}

	if (!years) {
		years = ['2018'];
	}

	years.forEach(function (year) {
		for (let i = 0; i < months.length; i++) {
			let firstMonth = months[i];
			let secondMonth;
			let secondYear = year;

			if (firstMonth == "12") {
				secondMonth = "01";
				secondYear = secondYear + 1;
			} else if (i == months.length - 1) {
				break;
			} else {
				secondMonth = months[i + 1];
			}

			let jql = 'issuetype in (Bug, "Regression Bug") AND component in (subcomponents(LPS, Forms, "true")' +
				', subcomponents(LPS, "Dynamic Data Lists", "true"), subcomponents(LPS, "Web Form", "true")' +
				', subcomponents(LPS, "Dynamic Data Mapping", "true"), subcomponents(LPS, Polls, "true")) AND ' +
				`createdDate >= ${year}-${firstMonth}-01 AND createdDate < ${secondYear}-${secondMonth}-01 ORDER BY created ASC`;

			chain = chain.then(() => searchJira(jql, optional)).then(response => insertResult(response));
		}
	});

	return chain.catch(err => {
		throw new Error(err);
	});
}


createChain(['2018', '2017']);

// chain = Promise.resolve();