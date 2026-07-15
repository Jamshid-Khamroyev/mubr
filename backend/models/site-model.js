const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const siteSchema = new Schema({
    title: {type: String, required: true},
    images: [
        {type: String, required: true }
    ],
    imagesId: [
        {type: String, required: true }
    ],
    adminPhone: {type: String, required: false},
    block: {type: Boolean, default: false},
    time: {type: Date, default: new Date()},
    notification: [
        {type: Schema.Types.ObjectId, ref: "Notification"}
    ],
    complaints: [
        {type: Schema.Types.ObjectId, ref: "Complaint"}
    ],
    tests: [
        {type: Schema.Types.ObjectId, ref: "Test"}
    ],
    teams: [
        {type: Schema.Types.ObjectId, ref: "Team"}
    ],
    localBooks: [
        {type: Schema.Types.ObjectId, ref: "OfferBook"}
    ],
    users: [
        {type: Schema.Types.ObjectId, ref: "User"}
    ],
    albums: [
        {type: Schema.Types.ObjectId, ref: "Album"}
    ]
}, {timestamps: true}) 

module.exports = mainDb.model("Site", siteSchema)