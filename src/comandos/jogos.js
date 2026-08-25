// Comandos de jogos
async function dado(sock, sender) {
  const resultado = Math.floor(Math.random() * 6) + 1;
  await sock.sendMessage(sender, { text: `🎲 Você tirou: ${resultado}` });
}

async function moeda(sock, sender) {
  const resultado = Math.random() < 0.5 ? "Cara 😊" : "Coroa 👑";
  await sock.sendMessage(sender, { text: `🪙 Resultado: ${resultado}` });
}

async function numero(sock, sender) {
  const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
  await sock.sendMessage(sender, { text: `🎯 Seu número da sorte é: ${numeroAleatorio}` });
}

module.exports = {
  dado,
  moeda,
  numero,
};
