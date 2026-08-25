// Comandos de informação
async function ajuda(sock, sender) {
  const menu = `📋 *MENU DE COMANDOS*

*⏰ UTILIDADES:*
• hora - Horário atual
• data - Data de hoje
• calculadora <operação> - Ex: calculadora 2+2
• idade <ano> - Ex: idade 2000

*🎮 JOGOS:*
• dado - Joga um dado
• moeda - Cara ou coroa
• numero - Número aleatório 1-100

*😂 DIVERSÃO:*
• piada - Gera uma piada aleatória
• sorte - Sua sorte do dia

*ℹ️ INFO:*
• clima - Status do bot
• oi - Cumprimento
• opa - Resposta casual
• ping - Teste de conexão`;
  await sock.sendMessage(sender, { text: menu });
}

async function clima(sock, sender) {
  await sock.sendMessage(sender, { text: "🤖 Bot está funcionando perfeitamente! Temperatura normal: 36.5°C 😎" });
}

async function oi(sock, sender) {
  await sock.sendMessage(sender, { text: "Oi! 👋 Como vai?" });
}

async function opa(sock, sender) {
  await sock.sendMessage(sender, { text: "Opa! Tudo certo por aqui! 🤖" });
}

async function ping(sock, sender) {
  await sock.sendMessage(sender, { text: "Pong! ✅" });
}

module.exports = {
  ajuda,
  clima,
  oi,
  opa,
  ping,
};
