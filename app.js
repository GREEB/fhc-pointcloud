import { getInitInfo } from './modules/mongo.js';
import { udpServer } from './modules/udpServer.js' // Create UDP Server
import { httpsServer } from './modules/expresssocket.js' //Create Express and Socket server

//Get initial Info
getInitInfo();

