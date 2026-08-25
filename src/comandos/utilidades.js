// Comandos de utilidades
const { calcularIdade, validarOperacao } = require("../utils/helpers");

async function hora(sock, sender) {
  const horaAtual = new Date().toLocaleTimeString("pt-BR");
  await sock.sendMessage(sender, { text: `🕐 Agora são ${horaAtual}` });
}

async function data(sock, sender) {
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  await sock.sendMessage(sender, { text: `📅 Hoje é ${dataAtual}` });
}

async function calculadora(sock, sender, operacao) {
  try {
    if (validarOperacao(operacao)) {
      const resultado = eval(operacao);
      await sock.sendMessage(sender, { text: `🧮 ${operacao} = ${resultado}` });
    } else {
      await sock.sendMessage(sender, { text: "❌ Operação inválida! Use apenas números e operadores (+, -, *, /)" });
    }
  } catch (e) {
    await sock.sendMessage(sender, { text: "❌ Erro na operação! Verifique a sintaxe." });
  }
}

async function idade(sock, sender, anoStr) {
  const ano = parseInt(anoStr.trim());
  if (!isNaN(ano)) {
    const idadeCalc = calcularIdade(ano);
    if (idadeCalc >= 0 && idadeCalc <= 150) {
      await sock.sendMessage(sender, { text: `🎂 Você tem ${idadeCalc} anos!` });
    } else {
      await sock.sendMessage(sender, { text: "❌ Ano inválido!" });
    }
  } else {
    await sock.sendMessage(sender, { text: "❌ Formato inválido! Use: idade <ano>" });
  }
}

module.exports = {
  hora,
  data,
  calculadora,
  idade,
};
