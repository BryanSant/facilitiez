module.exports = class RoomsController {
    async get(req, res) {
        let allRooms = await GetRooms()
        await res.json(allRooms)
    }
    async getById(req, res) {
        let roomId = req.params.roomId
        let room = await GetRoomById(roomId)
        if (room === undefined) {
            await res.sendStatus(404)
        } else {
            await res.json(room)
        }
    }
}

async function GetRoomById(roomId) {
    let allRooms = await GetRooms()
    let foundRoom
    await allRooms.forEach((room) => {
        if (room.id === roomId) {
            foundRoom = room
        }
    })

    return foundRoom
}

// TODO: this is just a stub, we want this data from somewhere else
async function GetRooms() {
    return [
        {
            "id": "S520",
            "capabilities": ["zoom", "tv"],
            "seatingCapacity": 10,
            "photos": [
                "https://i.imgur.com/4Mn6I.jpeg",
                "https://i.imgur.com/ii8hy7t.jpg",
                "https://i.imgur.com/ulsHCPY.png"
            ],
            "coordinates": {
                "x": 4,
                "y": 7,
                "width": 2,
                "height": 2
            }
        },
        {
            "id": "S515",
            "capabilities": ["zoom", "projector"],
            "seatingCapacity": 32,
            "photos": [
                "https://i.imgur.com/x9fCGGL.jpg",
                "https://i.imgur.com/CvcfLo7.png",
                "https://i.imgur.com/kRYzsZL.jpg"
            ],
            "coordinates": {
                "x": 6,
                "y": 6,
                "wide": 3,
                "height": 4
            }
        }
    ]
}
