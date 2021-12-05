import throttle from 'lodash.throttle'
import Position from '../models/Position.js'
import User from '../models/User.js'
import {defudpClients} from '../modules/udpServer.js'
import {redisClient} from './redis.js'

// FIXME: Fix all of this user session logic, use something real like express-sessions
let ioUsers = []
let udpServerUsers = []


const addUDPuser = async (ip) => { // FIXME: TYPO
    console.log(`adding user with ip: ${ip}`);
    createUser(ip)
    // console.log(findUser)
    // // TODO: Check if users exists
    // // TODO: Create user in DB
    // udpServerUsers.push(ip)

    // // Check if user is on website if yes push live sockets
    // const found = ioUsers.some(r=> udpServerUsers.indexOf(r.ip) >= 0)
    // console.log(found)
}


const createUser = throttle(function (ip) {

}, 3000)

const writeData = async (x, y, z, surface, flying, ip, size) =>{
    // Check local users list
    // createUser(ip) // every x seconds check if user already exists
    // write data
}
const throttledWrite = throttle(function (x, y, z, surface, flying, ip, size) {

    // Throttle per user
    //ip:unix
    // if older than xms resend 
    
    // Create user if not yet a user

    // Check if user is on website
        // If yes guid to a view for user
        // If not just log

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

export {throttledWrite, addUDPuser}