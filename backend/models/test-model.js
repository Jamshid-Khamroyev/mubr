const { model, Schema } = require("mongoose");
const { mainDb } = require("../db-config");

const testSchema = new Schema({
  forClass: {type: String, required: true},
  testType: { type: String, required: true },
  questions: [
    {
      name: { type: String, required: true },
      answers: [
        {
          name: { type: String, required: true },
          okay: { type: Boolean, required: true }
        }
      ]
    }
  ]

}, { timestamps: true });

module.exports = mainDb.model("Test", testSchema);
