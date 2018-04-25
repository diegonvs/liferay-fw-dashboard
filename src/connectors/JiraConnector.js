import JiraApi from 'jira-client';
import chalk from 'chalk';

const username = process.env.JIRA_USER;
const password = process.env.JIRA_PASS;

let jira = new JiraApi({
    protocol: "https",
    host: "issues.liferay.com",
    username: username,
    password: password,
    apiVersion: 2
});

console.log(chalk.blue.bgWhite(jira.host));
export default jira;