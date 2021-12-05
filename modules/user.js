import onChange from 'on-change';
import throttle from 'lodash.throttle'


let users = {}
let udpClients = {};
let defudpClients = {};
export const addUDPuser = async (ip) =>{
    console.log(ip);
    users[ip].id = 123
    // const userID = Math.round(ip.split('.').reduce((a, b) => a + b, 0) * Math.PI) 
    // const findUser = await User.find({"mid": userID}).exec();
    // if (findUser == [] ){
    //     // create new user
    //     const newUser = new User({
    //         mid:ip
    //     })

    // }else{
    //     // add user id to users
        
    // }

    // Look socket io user
    console.log(users)
    // const newUser = new User({
    //     mid: userID
    // })
    // const createUser = await newUser.save()
    // console.log(createUser)
    
}
export const addIOuser = async (id,ip) => {

    // This is basically everyone going on website
    // User only gets created if you push UDP data
    // Store IO user in array to match if we get udp data
    ioUsers.push({"ioid": id, "ip": ip})

    //Check if we have UDP
    const checkCache = await client.hGetAll(ip);
    console.log(checkCache)
}


let index = 0;

const watchedObject = onChange(udpClients, function (path, value, previousValue, applyData) {
    if (previousValue == undefined){
        console.log(`${path} connected`);
        // createUser(path)
    }
    // if previousValue != undefined && value === unix then update
    //if (value != undefined)
    defudpClients[path] = value

});

// Looks for ips that have not send data in a while and delete them
setInterval(() => {
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

// Basically add user on first connect
export const makeUDPuser = throttle(function (ip) {
    watchedObject[ip] = Date.now()
}, 3000)
