const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const path = require("path");
const fs = require("fs");
const comandos = require("./src/comandos");

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

    // Processar comando
    await comandos.processar(sock, sender, texto);
  });

  return sock;
}

// Iniciar bot
conectarWhatsApp().catch((err) => {
  console.error("Erro ao conectar:", err);
  process.exit(1);
});
