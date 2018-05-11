import jira from '../config/connectors/JiraConnector';
import { updateFixPriorityField, analyzeHistory } from 'utils';

/**
 * 
 * @param {string} jql - jira query string in JQL
 * @param {object} optional - object containing any of the following properties
 * @param {integer} [optional.startAt=0]: optional starting index number
 * @param {integer} [optional.maxResults=50]: optional ending index number
 * @param {array} [optional.fields]: optional array of string names of desired fields
 */
export async function searchJira(jql, optional = {}) {
    try {
        const issues = await jira.searchJira(
            jql,
            optional,
            function callback(error, body) {
                if (error) {
                    return Promise.reject(error);
                }

                if (!result.total) {
                    result.total = body.total;
                }

                body.issues.forEach((item, index, arr) => {
                    result.issues.push(item);
                });
                return result;
            });
        return issues;
    } catch (err) {
        console.error(err);
    }
};

export function insertResult(response) {
    return new Promise(resolve => {
        var body = new Array();

        for (let i = 0; i < response.issues.length; i++) {
            body.push({ index: { _index: 'fwdashboard_analyze', _type: 'issues', _id: response.issues[i].id } });
            let updatedIssue = updateFixPriorityField(response.issues[i]);
            body.push(analyzeHistory(updatedIssue));
        }

        client.bulk({ body: body }, (err, res, status) => {
            resolve();
        })
    });
};

export async function getIssueProperty(issueNumber, property) {
    return jira.getIssueProperty(issueNumber, property)
        .then(res => {
            return res;
        })
        .catch(error => {
            jira.showErrors(error);
        });
}

export async function getBoards() {
    return jira.agileRequest('/board')
        .then(function (res) {

            let boards = [];
            const boardObj = res.values;

            for (var index in boardObj) {
                boards.push({
                    id: boardObj[index].id,
                    name: boardObj[index].name
                });
            }

            return boards;
        })
        .catch(function (r) {
            jira.showErrors(r);
        });
};