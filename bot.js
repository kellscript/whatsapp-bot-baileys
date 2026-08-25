const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const path = require("path");
const fs = require("fs");

// Logger
const logger = pino();

// Caminho para armazenar auth
const authPath = path.join(__dirname, "auth_info_multi");

async function conectarWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`🚀 Usando versão do WA: ${version.join(".")}, Latest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  // Salvar credenciais quando atualizar
  sock.ev.on("creds.update", saveCreds);

  // Conexão
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Escaneie o QR Code acima!");
    }

    if (connection === "close") {
      let shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔄 Reconectando...");
        conectarWhatsApp();
      } else {
        console.log("❌ Desconectado");
      }
    } else if (connection === "open") {
      console.log("✅ Bot conectado com sucesso!");
    }
  });

  // Mensagens recebidas
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];

    if (!msg.message) return;
    if (msg.key.fromMe) return;

    const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const sender = msg.key.remoteJid;

    console.log(`📨 Mensagem de ${sender}: ${texto}`);

    // Comandos do bot
    if (texto.toLowerCase() === "oi") {
      await sock.sendMessage(sender, { text: "Oi! 👋 Como vai?" });
    } else if (texto.toLowerCase() === "opa") {
      await sock.sendMessage(sender, { text: "Opa! Tudo certo por aqui! 🤖" });
    } else if (texto.toLowerCase() === "ajuda") {
      const menu = `📋 *MENU DE COMANDOS*\n\n• oi - Cumprimento\n• opa - Resposta casual\n• ajuda - Este menu\n• hora - Horário atual\n• ping - Teste de conexão`;
      await sock.sendMessage(sender, { text: menu });
    } else if (texto.toLowerCase() === "hora") {
      const hora = new Date().toLocaleTimeString("pt-BR");
      await sock.sendMessage(sender, { text: `🕐 Agora são ${hora}` });
    } else if (texto.toLowerCase() === "ping") {
      await sock.sendMessage(sender, { text: "Pong! ✅" });
    } else {
      await sock.sendMessage(sender, { text: "Não entendi esse comando. Digite *ajuda* para ver os comandos disponíveis!" });
    }
  });

  return sock;
}

// Iniciar bot
conectarWhatsApp().catch((err) => {
  console.error("Erro ao conectar:", err);
  process.exit(1);
});
