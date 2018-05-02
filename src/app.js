// issuetype in (Bug, "Regression Bug") AND component in (subcomponents(LPS, Forms, "true"), subcomponents(LPS, "Dynamic Data Lists", "true"), subcomponents(LPS, "Web Form", "true"), subcomponents(LPS, "Dynamic Data Mapping", "true"), subcomponents(LPS, Polls, "true")) AND createdDate >= 2017-01-01 AND createdDate < 2018-01-01 ORDER BY created ASC
import client from './connectors/ElasticConnector';
import {
    searchJira
} from './jira/jira';

const months = ["01", "02"]//["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const years = [2018]//[2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
// const optional = {
// 	maxResults: 1,//600
// 	expand: ["changelog"]
// };

// const doSearch = searchJira(
// 	'issuetype in (Bug, "Regression Bug") AND component in (subcomponents(LPS, Forms, "true")' +
// 	', subcomponents(LPS, "Dynamic Data Lists", "true"), subcomponents(LPS, "Web Form", "true")' +
// 	', subcomponents(LPS, "Dynamic Data Mapping", "true"), subcomponents(LPS, Polls, "true")) AND ' +
// 	`createdDate >= 2017-12-01 AND createdDate < 2018-01-01 ORDER BY created ASC`,
// 	optional
// );
//
// doSearch
// 	.then(response => {
// 		var body = new Array();
//
// 		for (let i = 0; i < response.issues.length; i++) {
// 			body.push({ index:  { _index: 'fwdashboard_teste3', _type: 'issues', _id: response.issues[i].id } })
// 			body.push(response.issues[i]);
// 		}
//
// 		client.bulk({ body: body }, (err, res, status) => {
// 			console.log(status);
// 		})
// 	})
// 	.catch(err => {
// 		throw new Error(err);
// 	});

// function insertResult(response) {
// 	return new Promise(resolve => {
// 		var body = new Array();
//
// 		for (let i = 0; i < response.issues.length; i++) {
// 			body.push({ index:  { _index: 'fwdashboard_analyze', _type: 'issues', _id: response.issues[i].id } });
// 			let updatedIssue = updateFixPriorityLabel(response.issues[i]);
// 			body.push(analyzeHistory(updatedIssue));
// 		}
//
// 		client.bulk({ body: body }, (err, res, status) => {
// 			resolve();
// 		})
// 	});
// }
//
// var chain = Promise.resolve();
//
// function createChain() {
// 	years.forEach(function(year) {
// 		for (let i = 0; i < months.length; i++) {
// 			let firstMonth = months[i];
// 			let secondMonth;
// 			let secondYear = year;
//
// 			if (firstMonth == "12") {
// 				secondMonth = "01";
// 				secondYear = secondYear + 1;
// 			} else if (i == months.length - 1) {
// 				break;
// 			} else {
// 				secondMonth = months[i + 1];
// 			}
//
// 			let jql = 'issuetype in (Bug, "Regression Bug") AND component in (subcomponents(LPS, Forms, "true")' +
// 				', subcomponents(LPS, "Dynamic Data Lists", "true"), subcomponents(LPS, "Web Form", "true")' +
// 				', subcomponents(LPS, "Dynamic Data Mapping", "true"), subcomponents(LPS, Polls, "true")) AND ' +
// 				`createdDate >= ${year}-${firstMonth}-01 AND createdDate < ${secondYear}-${secondMonth}-01 ORDER BY created ASC`;
//
// 			chain = chain.then(() => searchJira(jql, optional))
// 				.then(response => insertResult(response));
// 		}
// 	});
//
// 	return chain.catch(err => {
// 		throw new Error(err);
// 	});
// }
function updateFixPriorityLabel(issue) {
	let fields = issue.fields;

	if ("customfield_12523" in fields) {
		let fixPriority = issue.fields.customfield_12523;
		delete issue.fields.customfield_12523;
		issue.fields.fixPriority = fixPriority;
	}

	return issue;
}

function analyzeHistory(issue) {
	let statusHistory = new Array();

	statusHistory.push({ status: { name: "Open", time_frame: { gte: issue.fields.created } } });

	issue.changelog.histories.forEach(function(history) {
		for (let i = 0; i < history.items.length; i++) {
			let item = history.items[i];

			if (item.field == "status") {
				statusHistory[statusHistory.length - 1].status.time_frame.lte = history.created;
				statusHistory.push({ status: {name: item.toString, time_frame: { gte: history.created } } });
				break;
			}
		}
	});

	issue.statusHistory = statusHistory;

	return issue;
}

client.search({
	index: "fwdashboard",
	size: 10000
}).then(function (body) {
	var hits = body.hits.hits;
	var body = new Array();

	hits.forEach(function(issue) {
		body.push({ index:  { _index: 'fwdashboard_analyze', _type: 'issues', _id: issue._source.id } });
		let updatedIssue = updateFixPriorityLabel(issue._source);
		body.push(analyzeHistory(updatedIssue));
	});

	client.bulk({ body: body }, (err, res, status) => {
		console.log("Done");
	})
}, function (error) {
	console.trace(error.message);
});

// createChain();
