/* Mongoose */
const path = require('path');
const mongoose = require('mongoose');


const { Schema } = mongoose;

const cookieSchemeList = {
  cid: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 250,
  },
};

const cookieScheme = new Schema(cookieSchemeList, { timestamps: true });

const modelname = path.basename(__filename, '.js');
const model = mongoose.model(modelname, cookieScheme);
module.exports = model;
