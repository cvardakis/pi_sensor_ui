// renderer.js
const { ipcRenderer } = require('electron');
const startBtn       = document.getElementById('startBtn');
const statusContainer = document.getElementById('statusContainer');
const statusText      = document.getElementById('statusText');

startBtn.addEventListener('click', () => {
    // 1) Show spinner + initial text
    statusContainer.classList.remove('d-none');
    statusText.innerText = 'Gathering Input...';
    statusContainer.style.display = 'flex';

    // 2) Disable the button to prevent double-clicks
    startBtn.disabled = true;

    // 3) Kick off the main-process setup routine
    ipcRenderer.send('start-setup', {
        drive: document.getElementById('driveSelect').value,
        ssid:  document.getElementById('ssid').value,
        pass:  document.getElementById('password').value,
        image: document.getElementById('imagePicker')?.value  // if you have an image picker
    });
});

// 4) Listen for progress updates
ipcRenderer.on('setup-progress', (event, message) => {
    statusText.innerText = message;
});

// 5) Handle completion
ipcRenderer.on('setup-complete', () => {
    statusText.innerText = 'All done! You can now eject your SD card.';
    statusContainer.querySelector('.spinner-border').style.display = 'none';
});

// 6) Handle errors
ipcRenderer.on('setup-error', (event, error) => {
    statusContainer.style.display = 'flex';
    statusText.innerText = `Error: ${error}`;
    statusContainer.querySelector('.spinner-border').style.display = 'none';
    startBtn.disabled = false;
});