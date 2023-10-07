const { dialog } = require('electron');
const Store = require('electron-store');

const store = new Store();

module.exports = function(ipcMain) {
  ipcMain.on('open-folder-dialog', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!result.canceled) {
      const selectedDirectory = result.filePaths[0];

      store.set('selectedDirectory', selectedDirectory);

      event.reply('selected-directory', selectedDirectory);
    }
  });
}