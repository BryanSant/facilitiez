const parser = require('../service/xlsx.data.parser');

module.exports = class ExampleController {
    constructor() {

    }

    get(request, response) {
        return response.json(parser.GetFloors())
    }
};

