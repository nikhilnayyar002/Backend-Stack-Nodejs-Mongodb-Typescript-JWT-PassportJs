const fs = require('fs');
var path = require('path');

// console.log(path.join(__dirname, "./src/config/config.json"))
// console.log(path.resolve(__dirname, "./src/config/config.json"))

// destination.txt will be created or overwritten by default.
fs.copyFileSync(path.join(__dirname, "src/config/config.json"),path.join(__dirname, "build/config/config.json"));
console.log('config.json was copied successfully.');
