import {path, __dirname} from './defaults.js'

import express from 'express'
import http from 'http'
import https from 'https'
import * as fs from 'fs';
import { Server } from 'socket.io'
import session from 'express-session'
import connectRedis from 'connect-redis';

import {redisClient} from './redis.js'
import { addIOuser } from './user.js';
const RedisStore = connectRedis(session);


let io
const app = express();

const httpsServer = https.createServer({
    key: fs.readFileSync('./keys/privkey.pem'),
    cert: fs.readFileSync('./keys/fullchain.pem'),
}, app);

httpsServer.listen(process.env.SSLPORT, () => {
    console.log('HTTPS Server running on port ' + process.env.SSLPORT);
});

const httpServer = http.createServer(app);
httpServer.listen(process.env.HTTPPORT, () => {
    console.log('HTTP Server running on port ' + process.env.HTTPPORT);
});

io = new Server(httpServer, {});

io.sockets.on('connection', function (socket) {
    // FIXME: Something better
    var clientIp = socket.handshake.address.split(':').pop().toString()
    if ('x-real-ip' in socket.handshake.headers){
        var clientIp = socket.handshake.headers['x-real-ip']
    }
    
    addIOuser(socket, clientIp)
    // TODO: Create user in DB, pass user when adding pos FIXME: get a better formula for IP2ID
    // TODO: Pass to data.js and match with udpServer
    //const userID = Math.round(clientIp.split('.').reduce((a, b) => a + b, 0) * Math.PI)
    //socket.emit('chordPack',)
});

// Access the session as req.session

app.use(express.static(path.join(__dirname + '/docs')));




export default httpsServer
