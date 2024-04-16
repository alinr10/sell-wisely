import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: String, required: false },
  gender: { type: Object, required: false },
  address: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },


});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel; 
