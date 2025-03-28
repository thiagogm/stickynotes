/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização");

// Verificar se a API está disponível
if (typeof window.api === 'undefined') {
  console.error("API não está definida. Verifique se o preload.js está carregando corretamente.");
}

/* Inserção da data no rodapé
function obterData() {
  const data = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return data.toLocaleDateString('pt-BR', options);
}*/

document.getElementById('dataAtual').innerHTML = obterData();

// Troca do ícone do banco de dados (status da conexão)
if (window.api) {
  window.api.dbStatus((event, message) => {
    console.log(message);
    document.getElementById('iconeDB').src = message === "conectado" ? "../public/img/dbon.png" : "../public/img/dboff.png";
  });
}

// População dinâmica do combo box de cidades
const cidadesPorEstado = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Sorocaba'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Cabo Frio'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Ouro Preto'],
  // Adicione mais estados e cidades conforme necessário
};

const estadoSelect = document.getElementById('estado');
const cidadeSelect = document.getElementById('cidade');

estadoSelect.addEventListener('change', (e) => {
  const estado = e.target.value;
  cidadeSelect.innerHTML = '<option value="">Selecione</option>'; // Resetar opções
  if (cidadesPorEstado[estado]) {
    cidadesPorEstado[estado].forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade;
      option.textContent = cidade; // Use textContent para garantir visibilidade
      cidadeSelect.appendChild(option);
    });
  }
});

// Validação Bootstrap
(() => {
  'use strict';
  const form = document.getElementById('cadastroForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
    } else if (window.api) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      window.api.saveClient(data);
    } else {
      console.error("API não disponível para salvar cliente");
    }
  }, false);
})();

// Resposta do salvamento
if (window.api) {
  window.api.saveClientResponse((event, response) => {
    console.log('Resposta do salvamento:', response);
    const form = document.getElementById('cadastroForm');
    if (response.success) {
      alert(response.message);
      form.reset();
      form.classList.remove('was-validated');
      cidadeSelect.innerHTML = '<option value="">Selecione</option>';
    } else {
      alert(response.message);
    }
  });
}

// Botão Limpar
document.getElementById('btnLimpar').addEventListener('click', () => {
  const form = document.getElementById('cadastroForm');
  form.reset();
  form.classList.remove('was-validated');
  cidadeSelect.innerHTML = '<option value="">Selecione</option>';
});

// Botão Remover
document.getElementById('btnRemover').addEventListener('click', () => {
  const cpf = document.getElementById('cpfRemover').value;
  if (!cpf || !cpf.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/)) {
    alert('Por favor, insira um CPF válido para remover.');
    return;
  }
  if (window.api) {
    window.api.removeClient(cpf);
  } else {
    console.error("API não disponível para remover cliente");
  }
});

// Receber resposta da remoção
if (window.api) {
  window.api.removeClientResponse((event, response) => {
    console.log('Resposta da remoção:', response);
    alert(response.message);
    if (response.success) {
      document.getElementById('cpfRemover').value = '';
    }
  });
}

// Botão Salvar
if (document.getElementById('btnSalvar')) {
  document.getElementById('btnSalvar').addEventListener('click', () => {
    const form = document.getElementById('cadastroForm');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (!data.cpf || !data.cpf.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/)) {
      alert('CPF inválido. Impossível atualizar o cliente.');
      return;
    }
    
    if (window.api) {
      window.api.updateClient(data);
    } else {
      console.error("API não disponível para atualizar cliente");
    }
  });
}

// Receber resposta da atualização
if (window.api) {
  window.api.updateClientResponse((event, response) => {
    console.log('Resposta da atualização:', response);
    alert(response.message);
    if (response.success) {
      const form = document.getElementById('cadastroForm');
      form.reset();
      form.classList.remove('was-validated');
      cidadeSelect.innerHTML = '<option value="">Selecione</option>';
    }
  });

  document.addEventListener('DOMContentLoaded', (event) => {
    const cpfInput = document.getElementById('cpf');
  
    cpfInput.addEventListener('input', () => {
      const cpf = cpfInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  
      // Valida o formato do CPF
      if (cpf.length === 11) {
        if (!validarCPF(cpf)) {
          cpfInput.setCustomValidity('CPF inválido.');
        } else {
          cpfInput.setCustomValidity('');
        }
      } else {
        cpfInput.setCustomValidity('CPF deve ter 11 dígitos.');
      }
      cpfInput.reportValidity();
    });
  
    // Função para validar CPF
    function validarCPF(cpf) {
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica se todos os dígitos são iguais
  
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.charAt(9))) return false;
  
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.charAt(10))) return false;
  
      return true;
    }
  });


  document.addEventListener('DOMContentLoaded', (event) => {
    const cepInput = document.getElementById('cep');
  
    cepInput.addEventListener('input', async () => {
      const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
  
          if (data.erro) {
            alert('CEP não encontrado.');
            return;
          }
  
          // Preenche os campos automaticamente
          document.getElementById('logradouro').value = data.logradouro;
          document.getElementById('bairro').value = data.bairro;
          document.getElementById('estado').value = data.uf;
  
          // Preenche o campo cidade (combobox)
          const cidadeSelect = document.getElementById('cidade');
          cidadeSelect.innerHTML = `<option value="${data.localidade}">${data.localidade}</option>`;
          cidadeSelect.value = data.localidade;
  
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          alert('Erro ao buscar CEP. Tente novamente.');
        }
      }
    });
  });
};

