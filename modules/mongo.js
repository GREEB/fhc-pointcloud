// Mongodb stuff
import { __dirname } from './defaults.js'
import mongoose from 'mongoose'
mongoose.connect(process.env.MONGOURL);
import Position from '../models/Position.js' // Position
import mapModel from '../models/Map.js' // Map
import User from '../models/User.js'

let mapBounds = {
    points: 0,
    x: {},
    y: {},
    z: {}
}


export const getInitInfo = async () => {
    // totalCached = await redisClient.get('all'); // Look if we have any points
    const all = await Position.find();
    const count = await Position.count().exec();
    mapBounds.points = count

    if (count === 0) return;

    // If we do have points find MIN MAX
    const minX = await Position.find({}).sort({
        x: 1
    }).limit(1).exec();
    mapBounds.x.min = minX[0].x
    const maxX = await Position.find({}).sort({
        x: -1
    }).limit(1).exec();
    mapBounds.x.max = maxX[0].x
    const minY = await Position.find({}).sort({
        y: 1
    }).limit(1).exec();
    mapBounds.y.min = minY[0].y
    const maxY = await Position.find({}).sort({
        y: -1
    }).limit(1).exec();
    mapBounds.y.max = maxY[0].y
    const minZ = await Position.find({}).sort({
        z: 1
    }).limit(1).exec();
    mapBounds.z.min = minZ[0].z
    const maxZ = await Position.find({}).sort({
        z: -1
    }).limit(1).exec();
    mapBounds.z.max = maxZ[0].z

    // Look if we have a map
    const mapCount = await mapModel.count().exec()

    // If no Map create and save one
    if (mapCount == 0) {
        const newMap = new mapModel({
            count: count,
            minX: mapBounds.x.min,
            maxX: mapBounds.x.max,
            minY: mapBounds.y.min,
            maxY: mapBounds.y.max,
            minZ: mapBounds.z.min,
            maxZ: mapBounds.z.max
        })
        newMap.save(function (err) {
            if (err) console.log(err);
        }); // FIXME: Throws errors on duplicates.
    } else {
        // If we have a map update it
        const mapUpdate = await mapModel.findOne();
        mapUpdate.minX = mapBounds.x.min;
        mapUpdate.maxX = mapBounds.x.max;
        mapUpdate.minY = mapBounds.y.min;
        mapUpdate.maxY = mapBounds.y.max;
        mapUpdate.minZ = mapBounds.z.min;
        mapUpdate.maxZ = mapBounds.z.max;
        await mapUpdate.save();
    }
}