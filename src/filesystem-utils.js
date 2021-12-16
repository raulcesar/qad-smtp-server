const fs = require('fs/promises');
const createDirIfNotExists = function (dirName) {
    return fs.stat(dirName)
        .then(stats => {
            return stats;
        })
        .catch(e => {
            if (e.code === 'ENOENT') {
                return { nodir: true };
            }
            throw e;
        })
        .then(ret => {
            if (ret.nodir) {
                return fs.mkdir(dirName, { recursive: true });
            }

            if (!ret.isDirectory()) {
                // This isn't a directory!
                throw new Error('File with name exists... not directory');
            }
            return dirName;
        })
        .then(() => {
            return dirName;
        });
};

module.exports = {
    createDirIfNotExists
}