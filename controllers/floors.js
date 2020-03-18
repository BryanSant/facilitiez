module.exports = class FloorsController {
    async get(req, res) {
        let allFloors = await GetFloors()
        await res.json(allFloors)

    }
    async getById(req, res) {
        let floorId = req.params.floorId
        let floor = await GetFloorById(floorId)
        if (floor === undefined) {
            await res.sendStatus(404)
        } else {
            await res.json(floor)
        }
    }

}

async function GetFloorById(floorId) {
    let allFloors = await GetFloors()
    let foundFloor
    await allFloors.forEach((floor) => {
        if (floor.id === floorId) {
            foundFloor = floor
        }
    })

    return foundFloor
}

// TODO: this is just a stub, we want this data from somewhere else
async function GetFloors() {
    return [
        {
            "id": "3",
            "size": {
                "width": 27,
                "height": 11
            }
        },
        {
            "id": "5",
            "size": {
                "width": 27,
                "height": 11
            }
        },
    ]
}
