// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponha uma API segura para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Conexão com o banco de dados
  requestDbStatus: () => ipcRenderer.send('request-db-status'),
  onDbStatus: (callback) => ipcRenderer.on('db-status', callback),
  
  // Janela Sobre
  aboutExit: () => ipcRenderer.send('about-exit'),
  
  // Operações CRUD
  saveClient: (data) => ipcRenderer.send('save-client', data),
  onSaveClientResponse: (callback) => ipcRenderer.on('save-client-response', callback),
  
  removeClient: (cpf) => ipcRenderer.send('remove-client', cpf),
  onRemoveClientResponse: (callback) => ipcRenderer.on('remove-client-response', callback),
  
  updateClient: (data) => ipcRenderer.send('update-client', data),
  onUpdateClientResponse: (callback) => ipcRenderer.on('update-client-response', callback)
});

// Solicitar status do banco ao iniciar
ipcRenderer.send('request-db-status');

//permisssões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld('api', {
  dbStatus: (message) => ipcRenderer.send('db-status', message),
  aboutExit: () => ipcRenderer.send('about-exit'),
  createNote: (stickyNote) => ipcRenderer.send('create-note', stickyNote),
  
})