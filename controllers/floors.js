const parser = require('../service/xlsx.data.parser');

module.exports = class FloorsController {
    async get(req, res) {
        let allFloors = await parser.GetFloors();
        await res.json(allFloors)

    }
    async getById(req, res) {
        let floorId = req.params.floorId;
        let floor = await GetFloorById(floorId);
        if (floor === undefined) {
            await res.sendStatus(404)
        } else {
            await res.json(floor)
        }
    }
};

async function GetFloorById(floorId) {
    let allFloors = await parser.GetFloors();
    let foundFloor;
    await allFloors.forEach((floor) => {
        if (floor.id === floorId) {
            foundFloor = floor
        }
    });

    return foundFloor
}
