const SMTPServer = require('smtp-server').SMTPServer;
const fs = require('fs');
const path = require('path');
const fileSystemUtils = require('./filesystem-utils');
const moment = require('moment');

const argv = require('yargs')
    .default('outDir', path.join(__dirname, 'scratch/incomingmail'))
    .default('port', 2525)
    .describe('outDir', 'Directory where eMails will be saved.')
    .help()
    .alias('help', 'h')
    .argv;

const outDir = argv.outDir;
const port = argv.port;

const options = {
    authOptional: true,
    maxClients: 1,

    onConnect(session, callback) {
        console.log(`Going to accept connection from ${session.remoteAddress}.`);
        return callback();
    },
    onClose(session) {
        console.log(`Connection from ${session.remoteAddress} closed.`);
    },
    onAuth(auth, session, callback) {
        if (auth.username !== 'abc' || auth.password !== 'def') {
            return callback(new Error('Invalid username or password'));
        }
        callback(null, { user: 123 }); // where 123 is the user id or similar property
    },
    onData(stream, session, callback) {
        const recptString = session.envelope.rcptTo.map(rcpt => {
            return rcpt.address;
        }).join();
        const timestamp = moment().format('DDMMYY-HHmmss');
        const fileName = `mail-${timestamp}-from-${session.envelope.mailFrom.address}-to-${recptString}.txt`;
        const pathName = path.join(outDir, fileName);
        const writeStream = fs.createWriteStream(pathName);
        console.log(`${timestamp}: email from ${session.envelope.mailFrom.address} to ${recptString} `);
        stream.pipe(writeStream); // print message to console
        stream.on('end', () => {
            writeStream.end();
            return callback();
        });
    }
};

return fileSystemUtils.createDirIfNotExists(outDir)
    .then(() => {
        const server = new SMTPServer(options);

        server.on('error', err => {
            console.log('Error %s', err.message);
        });
        console.log(`Going to start listening on port ${port}`);
        server.listen(port);
    });

