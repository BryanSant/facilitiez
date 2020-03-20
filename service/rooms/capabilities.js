function GetRoomCapabilitiesById(roomId) {
    let capabilities = allRoomCapabilities();
    return capabilities[roomId];
}

function allRoomCapabilities() {
    return {
        "S520": ["zoom", "tv", "phone"],
        "S519": ["zoom", "tv", "phone"],
        "S515": ["zoom", "tv", "phone"],
        "S511": ["zoom", "tv", "phone"],
        "S508": ["zoom", "tv", "phone"],
        "S507": ["zoom", "tv", "phone"],
        "S506": ["zoom", "tv", "phone"],
        "S504": ["zoom", "tv", "phone"],
        "S512": ["zoom", "tv", "phone"],
    };
}

module.exports = {
    GetRoomCapabilitiesById
};
