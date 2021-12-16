const fsUtils = require('./src/filesystem-utils');
const path = require('path');

const outDir = path.join(__dirname, 'scratch/incomingmail');
// const outDir = path.join(__dirname, 'raul');

fsUtils.createDirIfNotExists(outDir)
    .then(dirName => {
        console.log(`dirName: ${dirName}`);
    })
    .catch(e => {
        console.log(`e: ${e}`);
    });