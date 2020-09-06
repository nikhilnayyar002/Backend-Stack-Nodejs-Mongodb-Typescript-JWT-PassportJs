import { globalEnvironment } from "./global.config";


// check env.
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT 
// then fetch corresponding env.'s config
const config:globalEnvironment = require('./config.json');
const envConfig = config.server[env=='development'?"dev":"prod"]
// add env. config values to process.env to be used anywhere
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);

/** if externally ort was provided set to it. */
if(port) process.env.port = port
