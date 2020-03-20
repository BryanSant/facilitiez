const slack = require('./slack');
const email = require('./email');

function PopulateCubicleData(cubicles) {
    cubicles.forEach((cubicle, index, cubicles) => {
        let name = cubicle.occupant.name;
        cubicle.slack = slack.GetSlackUrlForPerson(name);
        cubicle.mailToAddress = email.GetEmailToForPerson(name);
        cubicles[index] = cubicle;
    });

    return cubicles;
}

module.exports = {
    PopulateCubicleData
};
