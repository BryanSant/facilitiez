const chgSlackUrl = 'https://chgit.slack.com';

/**
 * @return {string}
 */
function GetSlackUrlForPerson(name) {
    let slackUsers = getSlackUsers();
    let slackId = slackUsers[name];

    // If we don't have a slackId for them, let's return undefined so the UI knows not to display it
    if (slackId === undefined) {
        return undefined
    }

    return `${chgSlackUrl}/team/${slackId}`;
}

function getSlackUsers() {
    return {
        "Derek Clifford": "UU30XPZQT",
        "Brian Sant": "UQP58H61W",
    }
}

module.exports = {
    GetSlackUrlForPerson
};
