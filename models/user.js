const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config = require('../config/config').get(process.env.NODE_ENV);
const salt=10;

var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength: 8
    },
    role:{
        type: String,
        default: 'user',
        enum: ['user','manager','admin']
    },
    accessToken:{
        type: String
    }
});



module.exports = mongoose.model('User',userSchema);