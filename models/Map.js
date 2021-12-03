import mongoose from 'mongoose'

const MapSchema = new mongoose.Schema({
    count: 'number',
    minX: 'number',
    maxX: 'number',
    minY: 'number',
    maxY: 'number',
    minY: 'number',
    maxZ: 'number',
    minZ: 'number'
})
const mapModel = mongoose.model('Map', MapSchema);
export default mapModel