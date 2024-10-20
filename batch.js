const fs = require('fs');
const path = require('path');

async function processFilesInDirectory(srcFolder, cbfn) {
    try {
        const fileList = await fs.promises.readdir(srcFolder);

        for(const filename of fileList) {
            const fromPath = path.join(srcFolder, filename);

            cbfn(fromPath);
        }
    } catch (e) {
        // ignore
    }

}

module.exports.processFilesInDirectory = processFilesInDirectory;
