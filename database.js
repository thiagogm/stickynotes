/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

const mongoose = require('mongoose');

// Configuração do banco de dados
const url = 'mongodb+srv://admin:123Senac@cluster0.woskp.mongodb.net/dbnotes';
let conectado = false;

// Schema para o cliente
const clienteSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  nomePreferencial: { type: String },
  dataNascimento: { type: Date, required: true },
  genero: { type: String, enum: ['masculino', 'feminino', 'outro', ''], default: '' },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  telefoneCelular: { type: String, required: true },
  telefoneFixo: { type: String },
  cep: { type: String, required: true },
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
}, { timestamps: true });

// Model para o cliente
const Cliente = mongoose.model('Cliente', clienteSchema);

// Método para conectar com o banco de dados
const conectar = async () => {
  if (!conectado) {
    try {
      await mongoose.connect(url);
      conectado = true;
      console.log("MongoDB conectado");
      return true;
    } catch (error) {
      console.log("Erro ao conectar:", error);
      return false;
    }
  }
  return true; // Já conectado
};

// Método para desconectar do banco de dados
const desconectar = async () => {
  if (conectado) {
    try {
      await mongoose.disconnect();
      conectado = false;
      console.log("MongoDB desconectado");
      return true;
    } catch (error) {
      console.log("Erro ao desconectar:", error);
      return false;
    }
  }
};

// Método para salvar cliente
const salvarCliente = async (clienteData) => {
  try {
    const cliente = new Cliente(clienteData);
    await cliente.save();
    console.log("Cliente salvo com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error; // Propaga o erro para tratamento no main.js
  }
};

// Exportar métodos e model
module.exports = { conectar, desconectar, salvarCliente, Cliente };