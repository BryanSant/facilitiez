const capabilities = require('./capabilities');
const capacity = require('./capacity');

function PopulateRoomData(rooms) {
    rooms.forEach((room, index, rooms) => {
        room.capabilities = capabilities.GetRoomCapabilitiesById(room.id);
        room.capacity = capacity.GetRoomCapacityById(room.id);
        rooms[index] = room;
    });

    return rooms;
}

module.exports = {
    PopulateRoomData
};
