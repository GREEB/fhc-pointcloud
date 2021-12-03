import {path, __dirname} from './defaults.js'

import express from 'express'
import http from 'http'
import https from 'https'
import * as fs from 'fs';
import { Server } from 'socket.io'
import session from 'express-session'
import connectRedis from 'connect-redis';

import {redisClient} from './redis.js'
import { addIOuser } from './data.js';
const RedisStore = connectRedis(session);


let io
const app = express();

const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/' + process.env.URL + '/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/' + process.env.URL + '/fullchain.pem'),
}, app);

httpsServer.listen(process.env.SSLPORT, () => {
    console.log('HTTPS Server running on port ' + process.env.SSLPORT);
});

io = new Server(httpsServer, {});

io.sockets.on('connection', function (socket) {
    // FIXME: Something better
    var clientIp = socket.handshake.headers['x-real-ip']
    addIOuser(socket.id, clientIp)
    // TODO: Create user in DB, pass user when adding pos FIXME: get a better formula for IP2ID
    // TODO: Pass to data.js and match with udpServer
    //const userID = Math.round(clientIp.split('.').reduce((a, b) => a + b, 0) * Math.PI)
    //socket.emit('chordPack',)
});

// Access the session as req.session

app.use(express.static(path.join(__dirname + '/docs')));


const httpServer = http.createServer(app);
httpServer.listen(process.env.HTTPPORT, () => {
    console.log('HTTP Server running on port ' + process.env.HTTPPORT);
});

export default httpsServer
