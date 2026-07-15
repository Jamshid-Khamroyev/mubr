const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const localCenter = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    achive: {type: String, required: true},
    location: {type: String, required: true},
    existSubjects: {type: String},
    images: [
        {type: String, required: true}
    ]
}) 

module.exports = mainDb.model("Center", localCenter)