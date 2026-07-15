const { model, Schema} = require("mongoose")
const { mainDb } = require("../db-config")

const albumSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    image: {type: String, required: true},
    imageId: {type: String, required: true}
}, {timestamps: true})

module.exports = mainDb.model("Album", albumSchema)