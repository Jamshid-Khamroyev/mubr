const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const notificationSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    description: {type: String, required: true},
}, {timestamps: true}) 

module.exports = mainDb.model("Notification", notificationSchema)