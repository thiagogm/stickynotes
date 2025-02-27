/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

//importção do mongoose

const mongoose = require('mongoose')

// configuração do banco de dados
//ip/link do servidor, autenticação
// ao final da url definir o nome do bancp de dados
//exemplo: /dbclientes
const url = 'mongodb+srv://admin:123Senac@cluster0.woskp.mongodb.net/dbnotes'

//validação (evitar a abertura de várias conexões)
let conectado = false


//método para conectar com o banco de dados
const conectar = async () => {
    //se não estiver conectado
    if(!conectado) {
        //conectar com o banco de dados
        try {
            await mongoose.connect(url) //conectar
            conectado = true
            console.log("MongoDB Conectado")
        } catch (error) {
            console.error(error)
        }
    }
}

//método para desconectar com o banco de dados
const desconectar = async () => {
    //se estiver conectado
    if(conectado) {
        //desconenctar
        try {
            await mongoose.disconnect(url) //desconectar
            conectado = false
            console.log("MongoDB Desconectado")
        } catch (error) {
            console.error(error)
        }
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = { conectar, desconectar}