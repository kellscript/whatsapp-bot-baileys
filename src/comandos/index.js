// Processar comandos
const diversao = require("./diversao");
const jogos = require("./jogos");
const utilidades = require("./utilidades");
const info = require("./info");

async function processar(sock, sender, texto) {
  const comando = texto.toLowerCase();

  // Comandos simples (sem argumentos)
  if (comando === "ajuda") return await info.ajuda(sock, sender);
  if (comando === "hora") return await utilidades.hora(sock, sender);
  if (comando === "data") return await utilidades.data(sock, sender);
  if (comando === "dado") return await jogos.dado(sock, sender);
  if (comando === "moeda") return await jogos.moeda(sock, sender);
  if (comando === "numero") return await jogos.numero(sock, sender);
  if (comando === "piada") return await diversao.piada(sock, sender);
  if (comando === "sorte") return await diversao.sorte(sock, sender);
  if (comando === "clima") return await info.clima(sock, sender);
  if (comando === "oi") return await info.oi(sock, sender);
  if (comando === "opa") return await info.opa(sock, sender);
  if (comando === "ping") return await info.ping(sock, sender);

  // Comandos com argumentos
  if (comando.startsWith("calculadora ")) {
    const operacao = texto.substring(12).trim();
    return await utilidades.calculadora(sock, sender, operacao);
  }

  if (comando.startsWith("idade ")) {
    const ano = texto.substring(6).trim();
    return await utilidades.idade(sock, sender, ano);
  }

  // Comando não reconhecido
  await sock.sendMessage(sender, { text: "Não entendi esse comando. Digite *ajuda* para ver os comandos disponíveis! 🤔" });
}

module.exports = {
  processar,
};
