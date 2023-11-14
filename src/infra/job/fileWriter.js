const fs = require('fs/promises');

async function createFile(obj) {
    try {
        await fs.mkdir('filesOperation');
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }

    const filePath = `filesOperation/${obj.id}.txt`;

    try {
        await fs.writeFile(filePath, JSON.stringify(obj, null, 2));
        console.log(`Storage file: ${filePath}`);
    } catch (err) {
        console.error('Error while create file:', err);
    }
}

module.exports = { createFile }
