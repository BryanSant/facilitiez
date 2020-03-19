const pathToXlsx = 'seating_chart_xlsx/Seating Chart Dig & IT_2020.xlsx';
const XLSX = require('xlsx');
const workbook = XLSX.readFile(pathToXlsx, {cellText: true});

function GetFloors() {
    let floorNames = workbook.SheetNames;
    let floors = [];
    floorNames.forEach((floorName) => {
        let sheet = workbook.Sheets[floorName];
        let floorCoordinates = GetFloorCoordinates(sheet);
        let floorData = getFloorData(sheet, floorCoordinates, floorName);

        floors.push(floorData.floor)
    });

    return floors
}

function GetRooms() {
    let floorNames = workbook.SheetNames;
    let rooms = [];
    floorNames.forEach((floorName) => {
        let sheet = workbook.Sheets[floorName];
        let floorCoordinates = GetFloorCoordinates(sheet);
        let floorData = getFloorData(sheet, floorCoordinates, floorName);

        rooms = [...floorData.rooms, ...rooms];
    });

    return rooms
}

function GetCubicles() {
    let floorNames = workbook.SheetNames;
    let cubicles = [];
    floorNames.forEach((floorName) => {
        let sheet = workbook.Sheets[floorName];

        let floorCoordinates = GetFloorCoordinates(sheet);
        let floorData = getFloorData(sheet, floorCoordinates, floorName);
        cubicles = [...floorData.cubicles, ...cubicles]
    });

    return cubicles
}

function getFloorData(sheet, floorCoordinates, floorName) {
    let columnNamesWithIndex = getColumnNamesWithIndex(floorCoordinates);
    let cubicleColumnNames = getColumnNamesWithData(sheet, floorCoordinates, looksLikeACubicleId);
    let cubicleRows = getRowsWithData(sheet, floorCoordinates, looksLikeACubicleId);
    let roomColumnNames = getColumnNamesWithData(sheet, floorCoordinates, looksLikeARoomId);
    let roomRows = getRowsWithData(sheet, floorCoordinates, looksLikeARoomId);

    let cubicles = [];
    let rooms = [];
    let cubicleOwnerMapping = getCubicleOwnerMapping(sheet, floorCoordinates, cubicleColumnNames);
    let roomMapping = getRoomMapping(sheet, floorCoordinates, roomColumnNames, cubicleColumnNames, columnNamesWithIndex);
    for (const key of Object.keys(cubicleOwnerMapping)) {
        let cubicle = cubicleOwnerMapping[key];
        cubicles.push({
            "id": key,
            "floor": floorName,
            "occupant": {
                "name": cubicle.name,
            },
            "coordinates": cubicle.coordinates
        })
    }

    for (const key of Object.keys(roomMapping)) {
        let room = roomMapping[key];
        room.id = key;
        room.floor = floorName;
        rooms.push(room);
    }

    return {
        "floor": {
            "id": floorName,
            "size": {
                "height": getFloorHeight(roomRows, cubicleRows),
                "width": getFloorWidth(sheet, floorCoordinates),
            }
        },
        "cubicles": cubicles,
        "rooms": rooms,
    }
}

function getFriendlyCoordinates(sheet, floorCoordinates, cubicleColumnNames, column, row) {
    let rowIndex = getFriendlyRowIndex(sheet, floorCoordinates, cubicleColumnNames, row);
    let columnIndex = getFriendlyColumnIndex(floorCoordinates, cubicleColumnNames, column);

    return {
        x: columnIndex,
        y: rowIndex,
    }
}

function getFriendlyColumnIndex(floorCoordinates, cubicleColumnNames, column) {
    let currentColumn = floorCoordinates.startColumn;
    let index = 0;

    while (currentColumn !== floorCoordinates.endColumn) {
        if (currentColumn in cubicleColumnNames) {
            if (column === currentColumn) {
                return index
            }
            index++
        }
        currentColumn = incrementLetter(currentColumn)
    }
}

function getColumnNameFromIndex(columnNamesWithIndex, index) {
    for (const key of Object.keys(columnNamesWithIndex)) {
        if (columnNamesWithIndex[key] === index) {
            return key
        }
    }
}

function getMergesForCell(merges, startColumn, startRow) {
    for(const key of Object.keys(merges)) {
        if (merges[key].s.c === startColumn && merges[key].s.r === startRow) {
            return merges[key];
        }
    }
}

function getRoomMapping(sheet, floorCoordinates, roomColumnNames, cubicleColumnNames, columnNamesWithIndex) {
    let roomMapping = {};
    let merges = sheet['!merges'];

    for (const key of Object.keys(roomColumnNames)) {
        let currentRow = floorCoordinates.startRow;
        while(currentRow < floorCoordinates.endRow) {
            let cell = sheet[key + currentRow];
            if (!isEmptyCell(cell) && looksLikeARoomId(cell.v)) {
                let roomWidth = 1;
                let roomHeight = 1;
                let columnIndex = columnNamesWithIndex[key];
                let mergeObject = getMergesForCell(merges, columnIndex, currentRow);
                if (mergeObject !== undefined) {
                    let mergedColumns = [];
                    let currentMergeColumn = mergeObject.s.c;
                    while(currentMergeColumn <= mergeObject.e.c) {
                        let mergedColumnName = getColumnNameFromIndex(columnNamesWithIndex, currentMergeColumn);
                        if (mergedColumnName !== undefined) {
                            mergedColumns.push(mergedColumnName);
                        }
                    }
                    roomWidth = mergedColumns.length
                }
                let coordinates = getFriendlyCoordinates(sheet, floorCoordinates, cubicleColumnNames, key, currentRow);
                if (cell.v in roomMapping) {
                    // Make sure we always give the coordinates of the top left-most coordinate
                    if (roomMapping[cell.v].coordinates.x > coordinates.x) {
                        roomMapping[cell.v].coordinates.x = coordinates.x
                    }
                    // If we have a bigger roomWidth, trust the biggest
                    if (roomMapping[cell.v].coordinates.width < roomWidth) {
                        roomMapping[cell.v].coordinates.width = roomWidth
                    }
                    roomMapping[cell.v].coordinates.height++ // If we found another one, it's 1 more deep, merges handles width
                } else {
                    coordinates.width = roomWidth;
                    coordinates.height = roomHeight;

                    roomMapping[cell.v] = {
                        id: cell.v,
                        coordinates: coordinates
                    }
                }
            }

            currentRow++;
        }
    }

    return roomMapping
}

function getCubicleOwnerMapping(sheet, floorCoordinates, cubicleColumnNames) {
    let cubicleOwnerMapping = {};

    for (const key of Object.keys(cubicleColumnNames)) {
        let currentRow = floorCoordinates.startRow;
        let previousRowValue = "";
        while(currentRow < floorCoordinates.endRow) {
            let cell = sheet[key + currentRow];
            let coordinates = getFriendlyCoordinates(sheet, floorCoordinates, cubicleColumnNames, key, currentRow);
            coordinates.height = 1;
            coordinates.width = 1;

            if (! isEmptyCell(cell)) {
                if (previousRowValue !== "" && looksLikeACubicleId(cell.v) && !looksLikeACubicleId(previousRowValue)) {
                    cubicleOwnerMapping[cell.v] = {
                        name: previousRowValue,
                        coordinates: coordinates
                    };
                    previousRowValue = ""
                } else if (previousRowValue !== "" && ! looksLikeACubicleId(cell.v) && looksLikeACubicleId(previousRowValue)) {
                    cubicleOwnerMapping[previousRowValue] = {
                        name: cell.v,
                        coordinates: coordinates
                    };
                    previousRowValue = ""
                } else {
                    previousRowValue = cell.v
                }
            }

            if (isEmptyCell(cell) && previousRowValue !== "") {
                // Empty cubicle
                if (looksLikeACubicleId(previousRowValue)) {
                    cubicleOwnerMapping[previousRowValue] = {
                        name: "",
                        coordinates: coordinates
                    };
                    previousRowValue = ""
                } else { // Anything else we don't really know what it is (probably someones office), so let's just reset
                    previousRowValue = ""
                }
            }

            currentRow++
        }
    }

    return cubicleOwnerMapping
}

function isEmptyCell(cell) {
    return cell === undefined || cell.v === undefined
}

function getColumnNamesWithIndex(floorCoordinates) {
    let currentColumn = floorCoordinates.startColumn;
    let columnNamesWithIndex = {};
    let index = 0;

    while (currentColumn !== floorCoordinates.endColumn) {
        columnNamesWithIndex[currentColumn] = index;
        index++;
        currentColumn = incrementLetter(currentColumn)
    }

    return columnNamesWithIndex
}

function getRowsWithData(sheet, floorCoordinates, regexFunc) {
    let rowsWithData = {};
    let currentRow = floorCoordinates.startRow;

    while(currentRow < floorCoordinates.endRow) {
        let currentColumn = floorCoordinates.startColumn;

        while(currentColumn !== floorCoordinates.endColumn) {
            let cell = sheet[currentColumn + currentRow];
            if (!isEmptyCell(cell) && regexFunc(cell.v)) {
                rowsWithData[currentRow] = {}
            }

            currentColumn = incrementLetter(currentColumn);
        }

        currentRow++
    }

    return rowsWithData
}

function getColumnNamesWithData(sheet, floorCoordinates, regexFunc) {
    let columnNamesWithData = {};
    let currentRow = floorCoordinates.startRow;

    while(currentRow < floorCoordinates.endRow) {
        let currentColumn = floorCoordinates.startColumn;

        while(currentColumn !== floorCoordinates.endColumn) {
            let cell = sheet[currentColumn + currentRow];
            if (cell !== undefined && regexFunc(cell.v)) {
                columnNamesWithData[currentColumn] = {}
            }

            currentColumn = incrementLetter(currentColumn)
        }

        currentRow++
    }

    return columnNamesWithData
}

function getFloorWidth(sheet, floorCoordinates) {
    let currentColumn = floorCoordinates.startColumn;
    let width = 0;

    while(currentColumn !== floorCoordinates.endColumn) {
        let currentRow = floorCoordinates.startRow;
        let cell = sheet[currentColumn + currentRow];
        while(isEmptyCell(cell) || ! looksLikeACubicleId(cell.v)) {
            currentRow++;
            if (currentRow > floorCoordinates.endRow) {
                break
            }
            cell = sheet[currentColumn + currentRow]
        }

        if (cell !== undefined && looksLikeACubicleId(cell.v)) {
            width++
        }
        currentColumn = incrementLetter(currentColumn)
    }

    return width
}

function getFriendlyRowIndex(sheet, floorCoordinates, cubicleColumnNames, row) {
    let currentRow = floorCoordinates.startRow;
    let friendlyIndex = 0;

    while(currentRow < floorCoordinates.endRow) {
        let cell = sheet[Object.keys(cubicleColumnNames)[0] + currentRow];
        if (cell !== undefined && (looksLikeACubicleId(cell.v) || looksLikeARoomId(cell.v))) {
            friendlyIndex++
        }

        if (currentRow === row) {
            return friendlyIndex
        }
        currentRow++
    }
}

function getFloorHeight(roomRows, cubicleRows) {
    return Object.keys(roomRows).length + Object.keys(cubicleRows).length
}

function GetFloorCoordinates(sheet) {
    let ref = sheet['!ref'].split(':');
    return {
        startColumn: ref[0].match(/[a-zA-Z]+/)[0],
        startRow: ref[0].match(/\d+/)[0],
        endColumn: ref[1].match(/[a-zA-Z]+/)[0],
        endRow: ref[1].match(/\d+/)[0]
    }
}

function looksLikeACubicleId(str) {
    if (str !== undefined && typeof str === 'string') {
        let found = str.match(/^[NSEW]\d+\.[NSEW]\d+$/);
        return found !== null && found.length > 0
    }
}

function looksLikeARoomId(str) {
    if (str !== undefined && typeof str === 'string') {
        let found = str.match(/^[NSEW]\d+$/);
        return found !== null && found.length > 0
    }
}

// If given A returns B, if given AR returns AS, if given Z returns AA
function incrementLetter(c) {
    let u = c.toUpperCase();
    if (same(u,'Z')){
        let txt = '';
        let i = u.length;
        while (i--) {
            txt += 'A';
        }
        return (txt+'A');
    } else {
        let p = "";
        let q = "";
        if(u.length > 1){
            p = u.substring(0, u.length - 1);
            q = String.fromCharCode(p.slice(-1).charCodeAt(0));
        }
        let l = u.slice(-1).charCodeAt(0);
        let z = nextLetter(l);
        if(z==='A'){
            return p.slice(0,-1) + nextLetter(q.slice(-1).charCodeAt(0)) + z;
        } else {
            return p + z;
        }
    }
}

function nextLetter(l){
    if(l<90){
        return String.fromCharCode(l + 1);
    }
    else{
        return 'A';
    }
}

function same(str,char){
    let i = str.length;
    while (i--) {
        if (str[i]!==char){
            return false;
        }
    }
    return true;
}

module.exports = {
    GetFloors,
    GetRooms,
    GetCubicles
};
