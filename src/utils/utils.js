export function updateFixPriorityField(issue) {
    let fields = issue.fields;

    if ("customfield_12523" in fields) {
        let fixPriority = issue.fields.customfield_12523;
        issue.fields.customfield_12523 = null;
        issue.fields.fixPriority = fixPriority;
    }

    return issue;
}

export function analyzeHistory(issue) {
    let statusHistory = new Array();

    statusHistory.push({ status: { name: "Open", time_frame: { gte: issue.fields.created } } });

    issue.changelog.histories.forEach(function (history) {
        for (let i = 0; i < history.items.length; i++) {
            let item = history.items[i];

            if (item.field == "status") {
                statusHistory[statusHistory.length - 1].status.time_frame.lte = history.created;
                statusHistory.push({ status: { name: item.toString, time_frame: { gte: history.created } } });
                break;
            }
        }
    });

    issue.statusHistory = statusHistory;

    return issue;
}

Array.prototype.forEach = function (a) {
    var l = this.length;
    for (var i = 0; i < l; i++)a(this[i], i)
}