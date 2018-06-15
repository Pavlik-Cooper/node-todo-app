var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/*
 In order to make array required
tags : {
    type     : Array,
        required : true,
        validate : {
        validator : function(array) {
            return array.every((v) => typeof v === 'string');
        }
    }
}*/
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        // minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// refactor original method
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  // token is id, access, and salt
  var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});

  // here we return user.save() since methods doesn't return anything
  return user.save().then(()=>{
      return token;
  });
};
// keyword this in static refers to User model rather than user instance
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e) {
        return Promise.reject();
    }
    // returns promise
    return User.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token,
    })

};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByCredentials = function (email,password) {
  var User = this;

   return User.findOne({email}).then((user)=>{
        if (!user) return Promise.reject();

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if (!res) reject();
                else resolve(user);
            });
        });
    });
};

// mongoose middleware gets fired before saving the model
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};