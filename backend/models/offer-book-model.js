const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const offerBookSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    goal: {type: String, required: true},
    image: {type: String, required: true},
    imageId: {type: String, required: true},
    rating: {type: Number, default: 0}
}, {timestamps: true}) 

module.exports = mainDb.model("OfferBook", offerBookSchema)