import onChange from 'on-change';
import throttle from 'lodash.throttle'
import User from '../models/User.js'
import { age } from './defaults.js';

export let users = {} // Main user obj to look at 

let maxClientTimeout = 10 // UDP client "timeout" in seconds
let udpClients, defudpClients // Helper OBJ for dumb UDP session logic
udpClients = defudpClients = {}

// FIXME: Dumbass loop, Looks for ips that have not send data in a while and delete them
setInterval(() => {
    for (const id in users){
        if (age(users[id]) > maxClientTimeout)
        delete users[id]
    }
}, 3000);


export const lastSeen = (obj) =>{
    obj.__lastSeen = Date.now()
}
export const addUDPuser = async (ip, userID) =>{
    let findUser = await User.find({"mid": userID}).exec();
    let createUser;
    if(!(userID in users)) users[userID] = {};
    if (findUser.length === 0){
        // create new user
        const newUser = new User({ mid: userID })
        createUser = await newUser.save()
    }else{
        createUser = findUser[0]
        // add user id to users
    }
    users[userID].mongodb_mid = createUser.mid
    users[userID].mongodb_id = createUser._id
    users[userID].ip = ip
    users[userID].__firstSeen = Date.now()
}
export const addIOuser = async (socket, ip, userID) => {
    // Check if we have a udp user with id
    if(!(userID in users)) users[userID] = {};
    users[userID].socketID = socket.id

    // This is basically everyone going on website
    // User only gets created if you push UDP data
    // Store IO user in array to match if we get udp data
    // ioUsers.push({"ioid": id, "ip": ip})

    // Check if we have UDP
    // const checkCache = await client.hGetAll(ip);
    // console.log(checkCache)
}


const watchedObject = onChange(udpClients, function (path, value, previousValue, applyData) {
    if (previousValue == undefined){
        console.log(`${path} connected to UDP`);
        addUDPuser(path, value)
    }
    // if previousValue != undefined && value === unix then update
    //if (value != undefined)
    //defudpClients[path] = value

});

// Basically add user on first connect
export const makeUDPuser = throttle(function (ip, userID) {
    watchedObject[ip] = userID
}, 3000)
