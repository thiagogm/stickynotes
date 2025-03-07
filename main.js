console.log("Electron - Processo principal")

//importação dos recursos do framework
//app (aplicação)
//BrowserWindow (criação da janela)
//nativeTheme (definir tema claro ou escuro)
//Menu (carregar o menu personalizado)
// shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron/main')

//Janela principal
let win
const createWindow = () => {
  //definindo o tema da janela, clarou ou escuro

    nativeTheme.themeSource = 'light'

    win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false, 
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true
  })
  //Carregar o menu personalizado
  //Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  //carregar o documento html na janela
  win.loadFile('./src/views/index.html')
}
// janela sobre
function aboutWindow() {
  nativeTheme.themeSource = 'light'

  //obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  //validação (se existir a janela principal)
  if(mainWindow){
    about = new BrowserWindow({
      width:320,
      height: 260,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      //estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true
      
    })
  }
 
  about.loadFile('./src/views/sobre.html')
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
// Reduzir a verbosidade de logs não críticos (devtools)
app.commandLine.appendSwitch('log-level', '3')


//template do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N',
        click: () => console.log("teste")
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role:  'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      },
      {
        label: 'Copiar',
        role: 'copy'
      }
    ]
  },
  
  {
    label: 'Ajuda',
    submenu: [
      {
      label: 'Repositório',
      click: () => shell.openExternal('https://github.com/thiagogm/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
    
  }
]