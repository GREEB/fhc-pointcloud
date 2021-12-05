import onChange from 'on-change';
import throttle from 'lodash.throttle'
import User from '../models/User.js'

let users = {} // Main user obj to look at 

let udpClients, defudpClients // Helper OBJ for dumb UDP session logic
udpClients = defudpClients = {}

// FIXME: Dumbass loop, Looks for ips that have not send data in a while and delete them
// TODO: Does not effect main users object atm
setInterval(() => {
    console.log(users)

    for (const ip in defudpClients) {
        if (Object.hasOwnProperty.call(defudpClients, ip)) {
            const element = defudpClients[ip];
            let age = (Date.now() - element) / 1000
            if (age > 6){
                console.log(`${ip} disconnected`);
                delete defudpClients[ip]
                delete watchedObject[ip]
            }
        }
    }
}, 3000);

export const addUDPuser = async (ip) =>{

    const userID = Math.round(ip.split('.').reduce((a, b) => a + b, 0) * Math.PI)
    const findUser = await User.find({"mid": userID}).exec();
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
}
export const addIOuser = async (socket, ip) => {
    // Check if we have a udp user with id
    const userID = Math.round(ip.split('.').reduce((a, b) => a + b, 0) * Math.PI)
    if(!(userID in users)) users[userID] = {};
    users[userID].socketID = socket.id
    users[userID].ip = ip

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
        console.log(`${path} connected`);
        addUDPuser(path)
    }
    // if previousValue != undefined && value === unix then update
    //if (value != undefined)
    defudpClients[path] = value

});

// Basically add user on first connect
export const makeUDPuser = throttle(function (ip) {
    watchedObject[ip] = Date.now()
}, 3000)
