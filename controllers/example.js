module.exports = class ExampleController {
    constructor() {

    }

    get(request, response) {
        return response.json({"foo": "bar"})
    }
}
