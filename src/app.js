import client from './connectors/JiraConnector';
import {
    insert,
    search,
    exclude
} from './elastic/feedElastic';

import {
    searchJira
} from './jira/jira';


Array.prototype.remove = (index) => {
    this.splice(index, 1);
}

// @Jira search Example!
const MAX_RESULTS = 300;

let result = {};

const doSearch = searchJira(`project = LPS AND component = "Forms" AND updated >= startOfYear()`, {
    maxResults: MAX_RESULTS, fields: ["key", "created"], expand: ["changelog"]
});

// exclude('jira');

doSearch
    .then(response => {
        for (let i = 0; i < response.issues.length; i++) {
            insert('jira', 'issues', response.issues[i]);
        }
    })
    .catch(err => {
        throw new Error(err);
    });


// // // @Elastic.api search Example!
// const elastic = search({
//     "index": "jira",
//     "type": "issues",
//     "body": {
//         "_source": {
//             "excludes": ["*.customfield*", "*.*.avatar*"]
//         },
//         "query": {
//             "match": {
//                 "fields.creator.displayName": "Rodrigo Souza"
//             }
//         }
//     }


// }, err => {
//     console.trace(err.message);
// });

// Query example in Kibana devTools
// GET jira / _search
// {
    // "_source": {
    //     "excludes": ["*.customfield*", "*.*.avatar*"]
    // },
    // "query": {
    //     "match": {
    //         "fields.creator.displayName": "Rodrigo Souza"
    //     }
    // }
// }
