import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String, 
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
		avatar: {
			type: String,
			required: true,
		},
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  const user = this;
	if (!user.isModified('password')) {
		return next();
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(user.password, salt);
	user.password = hash;
	next();
})

const User = mongoose.model('User', userSchema)

export default User
