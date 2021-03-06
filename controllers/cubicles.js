const parser = require('../service/xlsx.data.parser');
const cubicles = require('../service/cubicles/cubicles');

module.exports = class CubiclesController {
    async get(req, res) {
        let allCubicles = await parser.GetCubicles();
        allCubicles = await cubicles.PopulateCubicleData(allCubicles);
        await res.json(allCubicles)

    }
    async getById(req, res) {
        let cubicleId = req.params.cubicleId;
        let cubicle = await GetCubicleById(cubicleId);
        if (cubicle === undefined) {
            await res.sendStatus(404)
        } else {
            await res.json(cubicle)
        }
    }
};

async function GetCubicleById(cubicleId) {
    let allCubicles = await parser.GetCubicles();
    allCubicles = await cubicles.PopulateCubicleData(allCubicles);
    let foundCubicle;
    await allCubicles.forEach((cubicle) => {
        if (cubicle.id === cubicleId) {
            foundCubicle = cubicle
        }
    });

    return foundCubicle
}

// async function GetCubicles() {
//     return [
//         {
//             "id": "S5.S239",
//             "occupant": {
//                 "name": "Derek Clifford",
//                 "email": "derek.clifford@chghealthcare.com",
//                 "phone": "555-555-5555",
//                 "ext": "123"
//             },
//             "hasPhone": true,
//             "coordinates": {
//                 "x": 5,
//                 "y": 5,
//                 "width": 1,
//                 "height": 1
//             },
//         },
//         {
//             "id": "S5.S027",
//             "occupant": {
//                 "name": "Brian Sant",
//                 "email": "bryan.sant@chghealthcare.com",
//                 "phone": "",
//                 "ext": ""
//             },
//             "hasPhone": false,
//             "coordinates": {
//                 "x": 27,
//                 "y": 5,
//                 "width": 1,
//                 "height": 1
//             },
//         },
//     ]
// }
