const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: isEmail,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  //encrypt password
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to login user
userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email })
    if (user) {
      const auth = await bcrypt.compare(password, user.password)
      if (auth) {
        return user
      }
      throw Error('incorrect password')
    }
    throw Error('incorrect email')
  } catch (error) {
    let errors = ''
    console.log('User.login', error.message)

    if (error.message.includes('data and hash arguments required.')) {
      errors = 'Please enter password'
    } else {
      errors = error
    }
    throw Error(errors)
  }
}

const User = mongoose.model('User', userSchema)
module.exports = User
