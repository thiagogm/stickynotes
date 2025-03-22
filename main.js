//console.log("Electron - Processo principal")

// importação dos recursos do framework
// app (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
// ipcMain (permite estabelecer uma comunicação entre processos (IPC) main.js <=> renderer.js)
//const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
//const path = require('node:path')

// Importação dos métodos conectar e desconectar (módulo de conexão)
//const { conectar, desconectar } = require('./database.js')

// Janela principal
//let win
/*const createWindow = () => {
  // definindo o tema da janela claro ou ecuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Carregar o menu personalizado
  // Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // carregar o documento html na janela
  win.loadFile('./src/views/index.html')
}

// janela sobre
let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  // obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 300,
      height: 200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  about.loadFile('./src/views/sobre.html')

  //recebimento da mensagem do renderizador da tela sobre para fechar a janela usando o botão ok
  ipcMain.on('about-exit', () => {
    //validação (se existir a janela eela não estiver destruída, fechar)
    if (about && !about.isDestroyed())
    about.close()
  })
}

// janela notas
let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  // obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // validação (se existir a janela principal)
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  note.loadFile('./src/views/notas.html')

}

// inicialização da aplicação (assíncronismo)
app.whenReady().then(() => {
  createWindow()

  // Melhor local para estabelecer a conexão com o banco de dados
  // No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
  // ipcMain.on (receber mensagem)
  // db-connect (rótulo da mensagem)
  ipcMain.on('db-connect', async (event) => {
    //a linha abaixo estabelece a conexão com o banco de dados e verifica se foi conectado com sucesso (return true)
    const conectado = await conectar()
    if (conectado) {
      // enviar ao renderizador uma mensagem para trocar a imagem do ícone do status do banco de dados (criar um delay de 0.5 ou 1s para sincronização com a nuvem)
      setTimeout(() => {
        // enviar ao renderizador a mensagem "conectado"
        // db-status (IPC - comunicação entre processos - preload.js)
        event.reply('db-status', "conectado")
      }, 500) //500ms = 0.5s
    }
  })

  // só ativar a janela principal se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// se o sistem não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})

// Reduzir a verbosidade de logs não críticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

// template do menu
const template = [
  {
      label: 'Notas',
      submenu: [
          {
              label: 'Criar nota',
              accelerator: 'Ctrl+N',
              click: () => noteWindow()
          }
      ]
  },
      {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Relatório',
    submenu: [
      {
        label: 'Clientes'
        // Add click handler or additional functionality here
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
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
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
] */

  console.log("Electron - Processo principal");

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main');
const path = require('node:path');
const { conectar, desconectar, salvarCliente, Cliente } = require('./database.js');

let win;
const createWindow = () => {
  nativeTheme.themeSource = 'light';
 // Em main.js, verifique se o caminho para o preload.js está correto
win = new BrowserWindow({
  width: 1010,
  height: 720,
  webPreferences: {
    preload: path.join(__dirname, './preload.js'), // Certifique-se de que este caminho está correto
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false
  },
});
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  win.loadFile('./src/views/index.html');
};

// Janela Sobre
let about;
function aboutWindow() {
  nativeTheme.themeSource = 'light';
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    about = new BrowserWindow({
      width: 300,
      height: 200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // Ajuste para 'src/preload.js' se necessário
      },
    });
    about.loadFile('./src/views/sobre.html');
  }

  ipcMain.on('about-exit', () => {
    if (about && !about.isDestroyed()) about.close();
  });
}

// Listener para salvar cliente
ipcMain.on('save-client', async (event, data) => {
  const conectado = await conectar();
  if (conectado) {
    try {
      await salvarCliente(data);
      event.reply('save-client-response', { success: true, message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar cliente.';
      if (error.code === 11000) {
        errorMessage = 'CPF ou e-mail já cadastrado.';
      }
      event.reply('save-client-response', { success: false, message: errorMessage });
    }
  } else {
    event.reply('save-client-response', { success: false, message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Listener para remover cliente
ipcMain.on('remove-client', async (event, cpf) => {
  const conectado = await conectar();
  if (conectado) {
    try {
      const result = await Cliente.deleteOne({ cpf });
      if (result.deletedCount > 0) {
        event.reply('remove-client-response', { success: true, message: 'Cliente removido com sucesso!' });
      } else {
        event.reply('remove-client-response', { success: false, message: 'Cliente não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      event.reply('remove-client-response', { success: false, message: 'Erro ao remover cliente.' });
    }
  } else {
    event.reply('remove-client-response', { success: false, message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Listener para atualizar cliente
ipcMain.on('update-client', async (event, data) => {
  const conectado = await conectar();
  if (conectado) {
    try {
      const result = await Cliente.updateOne({ cpf: data.cpf }, data);
      if (result.modifiedCount > 0) {
        event.reply('update-client-response', { success: true, message: 'Cliente atualizado com sucesso!' });
      } else {
        event.reply('update-client-response', { success: false, message: 'Cliente não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      event.reply('update-client-response', { success: false, message: 'Erro ao atualizar cliente.' });
    }
  } else {
    event.reply('update-client-response', { success: false, message: 'Erro ao conectar ao banco de dados.' });
  }
});

// Template do menu
const template = [
  {
    label: 'Cadastro',
    submenu: [
      { label: 'Sair', accelerator: 'Alt+F4', click: () => app.quit() },
    ],
  },
  {
    label: 'Relatório',
    submenu: [
      { label: 'Clientes' }, // Pode adicionar funcionalidade futura aqui
    ],
  },
  {
    label: 'Ferramentas',
    submenu: [
      { label: 'Aplicar zoom', role: 'zoomIn' },
      { label: 'Reduzir', role: 'zoomOut' },
      { label: 'Restaurar o zoom padrão', role: 'resetZoom' },
      { type: 'separator' },
      { label: 'Recarregar', role: 'reload' },
      { label: 'DevTools', role: 'toggleDevTools' },
    ],
  },
  {
    label: 'Ajuda',
    submenu: [
      { label: 'Repositório', click: () => shell.openExternal('https://github.com/thiagogm/stickynotes') },
      { label: 'Sobre', click: () => aboutWindow() },
    ],
  },
];

// Inicialização da aplicação
app.whenReady().then(() => {
  createWindow();

  ipcMain.on('db-connect', async (event) => {
    const conectado = await conectar();
    if (conectado) {
      setTimeout(() => {
        event.reply('db-status', 'conectado');
      }, 500);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => {
  await desconectar();
});

app.commandLine.appendSwitch('log-level', '3');