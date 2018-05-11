import JiraApi from 'jira-client';
const chalk = require('chalk');
const jiraClient = require('jira-client');

let jira = new jiraclient.JiraApi({
    protocol: "https",
    host: "issues.liferay.com",
    oauth: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN
    }
});

console.log(chalk.blue.bgWhite('Connected to: ' + jira.host));

module.exports = jira;