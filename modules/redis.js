import {path, __dirname} from './defaults.js'

import { createClient } from 'redis';


  
// Servers 8080 and 5300
let redisClient

// Redis
redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

export {redisClient}