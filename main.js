console.log("Electron - Processo principal")

//importação dos recursos do framework
//app (aplicação)
//BrowserWindow (criação da janela)
const { app, BrowserWindow } = require('electron/main')

//Janela principal
let win
const createWindow = () => {
    win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false, 
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true
  })
  //carregar o documento html na janela
  win.loadFile('./src/views/index.html')
}

//inicialização da aplicação (assíncronismo)
app.whenReady().then(() => {
  createWindow()

  // só ativar a janela principal se nehuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//Se o sistema não for Apple, encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})