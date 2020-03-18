module.exports = class CubiclesController {
    async get(req, res) {
        let allCubicles = await GetCubicles()
        await res.json(allCubicles)

    }
    async getById(req, res) {
        let cubicleId = req.params.cubicleId
        let cubicle = await GetCubicleById(cubicleId)
        if (cubicle === undefined) {
            await res.sendStatus(404)
        } else {
            await res.json(cubicle)
        }
    }
}

async function GetCubicleById(cubicleId) {
    let allCubicles = await GetCubicles()
    let foundCubicle
    await allCubicles.forEach((cubicle) => {
        if (cubicle.id === cubicleId) {
            foundCubicle = cubicle
        }
    })

    return foundCubicle
}

// TODO: this is just a stub, we want this data from somewhere else
async function GetCubicles() {
    return [
        {
            "id": "S5.S239",
            "occupant": {
                "name": "Derek Clifford",
                "email": "derek.clifford@chghealthcare.com",
                "phone": "555-555-5555",
                "ext": "123"
            },
            "hasPhone": true,
            "coordinates": {
                "x": 5,
                "y": 5,
                "width": 1,
                "height": 1
            },
        },
        {
            "id": "S5.S027",
            "occupant": {
                "name": "Brian Sant",
                "email": "bryan.sant@chghealthcare.com",
                "phone": "",
                "ext": ""
            },
            "hasPhone": false,
            "coordinates": {
                "x": 27,
                "y": 5,
                "width": 1,
                "height": 1
            },
        },
    ]
}
