const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const complaintSchema = new Schema({
    sender: {type: Schema.Types.ObjectId, ref: "User"},
    test: {type: Schema.Types.ObjectId, ref: "Test"},
    description: {type: String, required: true}
}, {timestamps: true}) 

module.exports = mainDb.model("Complaint", complaintSchema)