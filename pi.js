// pi.js
const { net } = require('electron');
const fs = require('fs');

/**
 * Downloads the latest Raspberry Pi OS image to `destinationPath`.
 * Calls `onProgress(0–1)` as data arrives.
 */
async function downloadPiOS(destinationPath, onProgress) {
    return new Promise((resolve, reject) => {
        const request = net.request('https://downloads.raspberrypi.org/raspios_lite_armhf_latest');

        request.on('response', response => {
            const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
            let receivedBytes = 0;
            const fileStream = fs.createWriteStream(destinationPath);

            response.on('data', chunk => {
                receivedBytes += chunk.length;
                if (onProgress && totalBytes) {
                    onProgress(receivedBytes / totalBytes);
                }
            });

            response.pipe(fileStream);
            fileStream.on('finish', () => resolve(destinationPath));
            fileStream.on('error', reject);
        });

        request.on('error', reject);
        request.end();
    });
}

async function installPiOS(destinationPath, onProgress) {
    return null;
}

async function setupPiOS(destinationPath, onProgress) {
    return null;
}

async function setupSensorOS(destinationPath, onProgress) {
    return null;
}

module.exports = { downloadPiOS };