function GetRoomCapacityById(roomId) {
    let capacity = allRoomCapacity();
    return capacity[roomId];
}

function allRoomCapacity() {
    return {
        "S520": 15,
        "S519": 15,
        "S515": 40,
        "S511": 15,
        "S512": 15,
        "S508": 6,
        "S507": 6,
        "S506": 6,
        "S504": 6,
    };
}

module.exports = {
    GetRoomCapacityById
};
