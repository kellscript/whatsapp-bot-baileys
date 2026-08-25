// Comandos de diversão
const { gerarJoke } = require("../utils/helpers");

async function piada(sock, sender) {
  const piada = gerarJoke();
  await sock.sendMessage(sender, { text: `😂 ${piada}` });
}

async function sorte(sock, sender) {
  const sorteValue = Math.floor(Math.random() * 100) + 1;
  let mensagem = `🍀 Sua sorte hoje é: ${sorteValue}%\n\n`;
  if (sorteValue >= 80) mensagem += "Você terá um ótimo dia! 🌟";
  else if (sorteValue >= 50) mensagem += "Dia normal, nada de especial 😐";
  else mensagem += "Cuidado! Pode ser um dia complicado 😅";
  await sock.sendMessage(sender, { text: mensagem });
}

module.exports = {
  piada,
  sorte,
};
