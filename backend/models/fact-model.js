const { model, Schema } = require("mongoose")
const { publicDb } = require("../db-config")

const factModel = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
}) 

module.exports = publicDb.model("Fact", factModel)