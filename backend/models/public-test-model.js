const { model, Schema } = require("mongoose")
const { publicDb } = require("../db-config")

const publicTest = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    ownerSite: {type: Schema.Types.ObjectId, ref: "Site", required: true},
    question: {type: String, required: true},
    see: { type: Number, default: 0 },
    answers: [
        {
            name: {type: String, required: true},
            ok: {type: Boolean, required: true}
        }
    ]
}, {timestamps: true}) 

module.exports = publicDb.model("PublicTest", publicTest)