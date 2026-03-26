const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('c:/Users/hamil/Dropbox/Sites/Mapa T3 experience/stand-manager/public/Mapa T3 Experience Original.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error){
    console.error(error);
});
