const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_TOKEN);
var slackUsers;

const chgSlackUrl = 'https://chgit.slack.com';

/**
 * @return {string}
 */
async function GetSlackUrlForPerson(name) {
    let slackUsers = await getSlackUsers();
    let slackId = await getSlackIdByName(slackUsers, name);

    // If we don't have a slackId for them, let's return undefined so the UI knows not to display it
    if (slackId === undefined) {
        return undefined
    }

    return `${chgSlackUrl}/team/${slackId}`;
}

async function getSlackIdByName(slackUsers, name) {
    let slackId;
    await slackUsers.members.forEach((member) => {
        if (member.real_name === name) {
            slackId = member.id;
        }
    });

    return slackId;
}

async function getSlackUsers() {
    if (slackUsers === undefined) {
        slackUsers = await client.users.list({});
    }
    return slackUsers;
}

module.exports = {
    GetSlackUrlForPerson
};
