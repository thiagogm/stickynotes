const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  requestDbStatus: () => ipcRenderer.send('request-db-status'),
  onDbStatus: (callback) => ipcRenderer.on('db-status', (event, message) => callback(message)),
  getImagePath: (name) => `../public/img/${name}`, // Caminho relativo fixo
  saveClient: (data) => ipcRenderer.send('save-client', data),
  onSaveClientResponse: (callback) => ipcRenderer.on('save-client-response', (event, response) => callback(response)),
  aboutExit: () => ipcRenderer.send('about-exit'),
  resetForm: (args) => ipcRenderer.on('reset-form', args)

});

// Solicitar status do banco ao iniciar
ipcRenderer.send('request-db-status');

