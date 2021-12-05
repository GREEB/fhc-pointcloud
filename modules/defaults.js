import dotenv from 'dotenv'
dotenv.config()
import path from 'path';
const __dirname = path.resolve();
export { dotenv, path, __dirname}

export const age = (obj) =>{
    return ((Date.now() - obj.__lastSeen) / 1000)
}