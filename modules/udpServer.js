import {path, __dirname} from './defaults.js'
import dgram from 'dgram';
import { throttledWrite, addUDPuser} from './data.js';
import onChange from 'on-change';
import {redisClient} from './redis.js'
import {createUser} from './mongo.js'
import throttle from 'lodash.throttle'

const udpServer = dgram.createSocket('udp4');

let udpClients = {};
let defudpClients = {}

const addK2R = async (ip) =>{

    await redisClient.set(ip.toString(), Date.now().toString(), {
        EX: 10,
        NX: true
      });

    await publisher.publish('', 'message');

}

let index = 0;

const watchedObject = onChange(udpClients, function (path, value, previousValue, applyData) {
    if (previousValue == undefined){
        createUser(path)
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
            if (age > 20){
                delete defudpClients[ip]
                delete watchedObject[ip]
            }
        }
    }
}, 3000);

// Basically add user on first connect
const makeUDPuser = throttle(function (ip) {
    watchedObject[ip] = Date.now()
}, 3000)



udpServer.on('message', (msg, rinfo) => {
    // important to tag data by user so if we have a bad actor its ez to remove
       // addK2R(rinfo.address)
    makeUDPuser(rinfo.address)
    // console.log(udpclients);
    // Build list of clients to watch for changes
    // watchedudp[rinfo.address] = true;
    //await client.HGETALL('key');
    let flying = 1;
    let surface = 0
    // Road edgde detection build in?  WheelOnRumbleStripFl(this byte[] bytes) { return GetSingle(bytes, 116)

    // Get Dirt tele to see if not on real road
    // SurfaceRumbleRr(this byte[] bytes) { return GetSingle(bytes, 160)
    let srFL = parseFloat(msg.readFloatLE(148))
    let srFR = parseFloat(msg.readFloatLE(152))
    let srRL = parseFloat(msg.readFloatLE(156))
    let srRR = parseFloat(msg.readFloatLE(160))


    // If all 4 Wheels are in a puddle add as water point
    // public static float WheelInPuddleRr(this byte[] bytes) { return GetSingle(bytes, 144)
    let wipFL = parseInt(msg.readFloatLE(132))
    let wipFR = parseInt(msg.readFloatLE(136))
    let wipRL = parseInt(msg.readFloatLE(140))
    let wipRR = parseInt(msg.readFloatLE(144))

    // Get suspension to check if wheel in the air?
    // public static float NormSuspensionTravelRr(this byte[] bytes) { return GetSingle(bytes, 80)
    let nstFL = parseFloat(msg.readFloatLE(68)).toFixed(1)
    let nstFR = parseFloat(msg.readFloatLE(72)).toFixed(1)
    let nstRL = parseFloat(msg.readFloatLE(76)).toFixed(1)
    let nstRR = parseFloat(msg.readFloatLE(80)).toFixed(1)

    // Car XYZ
    // public static float PositionZ(this byte[] bytes) { return GetSingle(bytes, 240 + BufferOffset)
    let x = parseFloat(msg.readFloatLE(232 + 12)).toFixed(1)
    let y = parseFloat(msg.readFloatLE(236 + 12)).toFixed(1)
    let z = parseFloat(msg.readFloatLE(240 + 12)).toFixed(1)


    flying = nstFL + nstFR + nstRL + nstRR

    if (wipFL + wipFR + wipRL + wipRR == 4) {
        surface = 2
    } else if (srFL !== 0 && srFR !== 0 && srRL !== 0 && srRR) { // FIXME: Flickers to 0 this is probably how it should work
        surface = 1
    } else {
        surface = 0
    }


    // TODO: Throttle write for each client
    throttledWrite(x, y, z, surface, flying, rinfo.address, rinfo.size)


});

udpServer.on('error', (err) => {
    console.log(`udpServer error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('close', (err) => {
    console.log(`udpServer error:\n${err}`);
});
udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`udpServer listening ${address.address}:${address.port}`);
});

udpServer.bind(5300);
export {udpServer, defudpClients}