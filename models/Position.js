import mongoose from 'mongoose'
import User from './User.js'
const posSchema = new mongoose.Schema({
    x: 'number',
    y: 'number',
    z: 'number',
    surface: 'number',
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}); // 0=asphalt 1=dirt 2=water
posSchema.index({
    x: 1,
    y: 1,
    z: 1
}, {
    unique: true
});
const Position = mongoose.model('Position', posSchema);
export default Position
