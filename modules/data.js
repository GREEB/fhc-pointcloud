import throttle from 'lodash.throttle'
import Position from '../models/Position.js'
import User from '../models/User.js'
import {udpclients} from '../modules/udpServer.js'
import {redisClient} from './redis.js'


// FIXME: Fix all of this user session logic, use something real like express-sessions
let ioUsers = []
let udpServerUsers = []
let users = []

const addUDPuser = async (ip) => { // FIXME: TYPO

    console.log(findUser)
    // TODO: Check if users exists
    // TODO: Create user in DB
    udpServerUsers.push(ip)

    // Check if user is on website if yes push live sockets
    const found = ioUsers.some(r=> udpServerUsers.indexOf(r.ip) >= 0)
    console.log(found)
}

const addIOuser = (id,ip) => {
    // This is basically everyone going on website
    // User only gets created if you push UDP data
    // Store IO user in array to match if we get udp data
    ioUsers.push({"ioid": id, "ip": ip})

    //Check if we have UDP
    const found = ioUsers.some(r=> udpServerUsers.indexOf(r.ip) >= 0)
    console.log(found);
}
const addUser = async (ip) =>{
    const userID = Math.round(ip.split('.').reduce((a, b) => a + b, 0) * Math.PI) 
    const findUser = await User.find({"mid": userID}).exec();
    console.log(findUser)
}
const throttledWrite = throttle(function (x, y, z, surface, flying, ip, size) {
    redisClient.set('another-key', 'another-value');
    console.log(  redisClient.get('another-key'))
    // if (flying === 0) return // Abort if flying
    // if (x === 0 && y === 0 && z === 0) return // Abort if 000 chord
    // const newPos = new Position({
    //     x: x,
    //     y: y,
    //     z: z,
    //     surface: surface
    // });
    // newPos.save(function (err) {
    //     if (err) console.log('duplicate dont send');
    //     lastSavedPos = `New Position saved x:${x} y:${y} z:${z} surface: ${surface}`

    // });
    // publisher.publish('allChannel', `{ x: ${x}, y: ${y}, z: ${z} s: ${surface}}`);
    // io.sockets.emit('chord',{ x: x, y: y, z: z, s: surface })

}, 500);

export {throttledWrite, addUDPuser, addIOuser}