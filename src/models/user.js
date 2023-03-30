const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if(value.toLowerCase().includes('password')) throw Error('Password must not contain "password".')
    }
  },
  tokens: [
    { 
      token: {
        type: String,
        required: true
      } 
    }
  ]
})

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  // get the user
  const user = await User.findOne({ email })
  // check if user exist - if not throw an error
  if(!user) throw Error('Unable to login.')
  // else compare passwords - if not the same throw an error
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) throw Error('Unable to login.')

  return user
}

// middleware to be executed before user is saved to the database (hash plain text password)
userSchema.pre('save', async function (next) {
  const user = this

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User