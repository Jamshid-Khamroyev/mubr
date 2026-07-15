const { model, Schema } = require("mongoose")
const { publicDb } = require("../db-config")

const newSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true}
}, {timestamps: true}) 

module.exports = publicDb.model("New", newSchema)