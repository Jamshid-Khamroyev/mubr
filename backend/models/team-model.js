const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const teamSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    capitan: {type: String, required: true},
    users: [
        {type: Schema.Types.ObjectId, ref: "User"}
    ],
    balls: {type: Number, default: 0} ,
    image: {type: String, required: true}
}, {timestamps: true}) 

module.exports = mainDb.model("Team", teamSchema)