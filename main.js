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
// dialog: módulo electron para ativar caixa de mensagens
  const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog} = require('electron');
  const path = require('path');
  const { conectar, desconectar, salvarCliente, Cliente } = require('./database.js');
  
  let win;
  let cadastroWindow;
  
  const createWindow = () => {
    nativeTheme.themeSource = 'light';
    win = new BrowserWindow({
      width: 1010,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
      },
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    win.loadFile(path.join(__dirname, 'src/views/main.html')); // Carrega main.html como tela inicial
  };
  
  // Função para abrir a janela de cadastro
  function openCadastroWindow() {
    if (!cadastroWindow || cadastroWindow.isDestroyed()) {
      nativeTheme.themeSource = 'light';
      cadastroWindow = new BrowserWindow({
        width: 1010,
        height: 720,
        parent: win, // Define como modal da janela principal
        modal: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
        },
      });
      cadastroWindow.loadFile(path.join(__dirname, 'src/views/index.html'));
      cadastroWindow.on('closed', () => {
        cadastroWindow = null; // Limpa a referência ao fechar
      });
    } else {
      cadastroWindow.focus(); // Foca na janela se já estiver aberta
    }
  }
  
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
          preload: path.join(__dirname, 'preload.js'),
        },
      });
      about.loadFile('./src/views/sobre.html');
    }
    ipcMain.on('about-exit', () => {
      if (about && !about.isDestroyed()) about.close();
    });
  }
  
  // Janela Notas
  let note;
  function noteWindow() {
    nativeTheme.themeSource = 'light';
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      note = new BrowserWindow({
        width: 400,
        height: 270,
        autoHideMenuBar: true,
        parent: mainWindow,
        modal: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        },
      });
      note.loadFile('./src/views/notas.html');
    }
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
        if (error.code === 11000) errorMessage = 'CPF ou e-mail já cadastrado.';
        event.reply('save-client-response', { success: false, message: errorMessage });
      }
    } else {
      event.reply('save-client-response', { success: false, message: 'Erro ao conectar ao banco de dados.' });
    }

    //Confirmação de cliente adicionado ao banco (uso do dialog)
  dialog.showMessageBox({
    // montagem da caixa de mensagem
    type: 'info',
    title: "Aviso",
    message: "Cliente adicionado com sucesso!",
    buttons: ["OK"]

  }).then((result) => {
    // se o botão ok for pressionado
    if(result.response === 0){
      //enviar um pedido para o renderizador limpar os campos (preload.js)
      event.reply('reset-form')
    }
  })
  

  //Enviar ao renderizador um pedido para limpar os campos e setaro formulário com os padrões originais (foco no texto)
  event.reply('reset-form')




  });
  
  // Conexão com o banco
  ipcMain.on('request-db-status', async (event) => {
    try {
      const conectado = await conectar();
      event.reply('db-status', conectado ? 'conectado' : 'desconectado');
    } catch (error) {
      console.error('Erro na conexão:', error);
      event.reply('db-status', 'desconectado');
    }
  });
  
  // Template do menu
  const template = [
    {
      label: 'Notas',
      submenu: [
        { label: 'Criar nota', accelerator: 'Ctrl+N', click: () => noteWindow() },
      ],
    },
    {
      label: 'Cadastro',
      submenu: [
        { label: 'Abrir Cadastro', accelerator: 'Ctrl+C', click: () => openCadastroWindow() }, // Abre o cadastro
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Alt+F4', click: () => app.quit() },
      ],
    },
    {
      label: 'Relatório',
      submenu: [
        { label: 'Clientes' },
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

  