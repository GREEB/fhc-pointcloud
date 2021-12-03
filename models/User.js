import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    mid: 'number',
})

const User = mongoose.model('User', UserSchema);
export default User