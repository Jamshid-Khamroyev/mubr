const { model, Schema } = require("mongoose")
const { mainDb } = require("../db-config")

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    surname: {type: String, required: true},
    siteId: {type: Schema.Types.ObjectId, required: true, ref: "Site"},
    usertype: {type: String, required: false, default: "User"},
    userClassNumber: {type: Number},
    userClassName: {type: String},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    lastTests: [
        {type: Schema.Types.ObjectId, ref: "Test"}
    ],
    userTeam: {type: Schema.Types.ObjectId, ref: "Team", default: null},
    balls: {type: Number, required: false, default: 0},
    key: {type: String},
    block: {type: Boolean, default: false},
    bio: {type: String, default: ""},
    sertificate: {type: Number, default: 0},
    lastLogin: {type: Date},
    userTest: [
        {type: Schema.Types.ObjectId}
    ]
}, {timestamps: true})

module.exports = mainDb.model("User", userSchema)