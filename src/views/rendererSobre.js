/** 
 * Processo de renderização do documento sobre.html
 * Enviar uma mensagem para o processo principal para fechar a janela sobre 
 */

function fechar() {
    //executar a função aboutExit() vinculada ao peload.js, através da api do electron (ipcRenderer)
    api.aboutExit()
}
