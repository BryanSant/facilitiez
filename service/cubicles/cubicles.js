const slack = require('./slack');
const email = require('./email');

async function PopulateCubicleData(cubicles) {
    const start = async () => {
        await asyncForEach(cubicles, async (cubicle, index, cubicles) => {
            let name = cubicle.occupant.name;
            cubicle.occupant.slack = await slack.GetSlackUrlForPerson(name);
            cubicle.occupant.mailToAddress = email.GetEmailToForPerson(name);
            cubicles[index] = cubicle;
        });
    };
    await start();

    return cubicles;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {
    PopulateCubicleData
};
