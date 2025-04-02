// importação dos recursos do framework
// app (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
// ipcMain (permite estabelecer uma comunicação entre processos (IPC) main.js <=> renderer.js)

// dialog: módulo electron para ativar caixa de mensagens

  console.log("Electron - Processo principal")
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
            if (error.code === 11000) {
                errorMessage = 'CPF já cadastrado.';
                // Exibe mensagem de erro ao usuário
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Erro',
                    message: errorMessage,
                    buttons: ['OK']
                });
            }
            event.reply('save-client-response', { success: false, message: errorMessage });
        }
    } else {
        event.reply('save-client-response', { success: false, message: 'Erro ao conectar ao banco de dados.' });
    }
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

  // ===============================================
  // ================ CRUD CREATE ==================
  
  // Recebimento do objeto que contem os dados da nota
  ipcMain.on('create-note', async (event, stickyNote) => {
    // IMPORTANTE ! Teste de recebimento do objeto - Passo 2
    console.log(stickyNote)
    // Uso do try-catch para tratamento de exceções 
    try {
      
    // Criar uma nova estrutra de dados para salvar no banco
    // Atenção! Os atributos da estrutura precisam ser idênticos ao modelo e os valores são obtidos através do objeto stickyNote
    //const newNote = noteModel ({
    //  texto: stickyNote.textNote,
    //  cor: stickyNote.colorNote
    //})
  
    // Salvar a nota no banco de dados (Passo 3: fluxo)
    //newNote.save()
  
    } catch (error) {
      //tratamento da excessão "CPF duplicado"
      if(error.code === 11000) {
        dialog.showMessageBox({
          type: 'error',
          title: "Atenção",
          message: "CPF já cadastrado. \nVerifique o número digitado",
          buttons: ['OK']
        }).then((result) =>{
          // se o botão OK for pressionado
          if(result.response ===0){
            //Limpar o campo CPF, foco no campo CPF
          }
        })
      } else {
      console.log(error)
    }
  
  }
  });
  // ============== FIM CRUD CREATE ================
  // ===============================================

  
