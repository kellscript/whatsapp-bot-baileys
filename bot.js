const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const path = require("path");
const fs = require("fs");

// Logger
const logger = pino();

// Caminho para armazenar auth
const authPath = path.join(__dirname, "auth_info_multi");

// Função para gerar jokes
function gerarJoke() {
  const jokes = [
    "Por que o livro de matemática se suicidou? Porque tinha muitos problemas! 📚",
    "O que o Windows disse para o Linux? Você não é windows!",
    "Por que o programador saiu de casa? Porque ele perdeu a conexão! 🔌",
    "Como um programador sai do chuveiro? Vê a instrução no frasco e tenta aplicar: while(notClean) { wash(); }",
    "Qual é o objeto mais honesto da casa? O espelho, porque ele nunca mente! 🪞",
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Função para gerar dados aleatórios
function gerarDadosAleatorios() {
  const numero = Math.floor(Math.random() * 100) + 1;
  const escolhas = ["Pedra 🪨", "Papel 📄", "Tesoura ✂️"];
  const escolha = escolhas[Math.floor(Math.random() * escolhas.length)];
  return { numero, escolha };
}

// Função para calcular idade
function calcularIdade(ano) {
  const anoAtual = new Date().getFullYear();
  return anoAtual - ano;
}

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
    } 
    else if (texto.toLowerCase() === "opa") {
      await sock.sendMessage(sender, { text: "Opa! Tudo certo por aqui! 🤖" });
    } 
    else if (texto.toLowerCase() === "ajuda") {
      const menu = `📋 *MENU DE COMANDOS*\n\n• oi - Cumprimento\n• opa - Resposta casual\n• ajuda - Este menu\n• hora - Horário atual\n• data - Data de hoje\n• ping - Teste de conexão\n• dado - Joga um dado\n• moeda - Cara ou coroa\n• piada - Gera uma piada aleatória\n• calculadora <operação> - Ex: calculadora 2+2\n• idade <ano> - Calcula sua idade\n• clima - Status do bot\n• sorte - Sua sorte do dia\n• numero - Número aleatório 1-100`;
      await sock.sendMessage(sender, { text: menu });
    } 
    else if (texto.toLowerCase() === "hora") {
      const hora = new Date().toLocaleTimeString("pt-BR");
      await sock.sendMessage(sender, { text: `🕐 Agora são ${hora}` });
    } 
    else if (texto.toLowerCase() === "data") {
      const data = new Date().toLocaleDateString("pt-BR");
      await sock.sendMessage(sender, { text: `📅 Hoje é ${data}` });
    } 
    else if (texto.toLowerCase() === "ping") {
      await sock.sendMessage(sender, { text: "Pong! ✅" });
    } 
    else if (texto.toLowerCase() === "dado") {
      const resultado = Math.floor(Math.random() * 6) + 1;
      await sock.sendMessage(sender, { text: `🎲 Você tirou: ${resultado}` });
    } 
    else if (texto.toLowerCase() === "moeda") {
      const resultado = Math.random() < 0.5 ? "Cara 😊" : "Coroa 👑";
      await sock.sendMessage(sender, { text: `🪙 Resultado: ${resultado}` });
    } 
    else if (texto.toLowerCase() === "piada") {
      const piada = gerarJoke();
      await sock.sendMessage(sender, { text: `😂 ${piada}` });
    } 
    else if (texto.toLowerCase().startsWith("calculadora ")) {
      const operacao = texto.substring(12).trim();
      try {
        // Validação básica para segurança
        if (/^[0-9+\-*/.() ]+$/.test(operacao)) {
          const resultado = eval(operacao);
          await sock.sendMessage(sender, { text: `🧮 ${operacao} = ${resultado}` });
        } else {
          await sock.sendMessage(sender, { text: "❌ Operação inválida! Use apenas números e operadores (+, -, *, /)" });
        }
      } catch (e) {
        await sock.sendMessage(sender, { text: "❌ Erro na operação! Verifique a sintaxe." });
      }
    } 
    else if (texto.toLowerCase().startsWith("idade ")) {
      const ano = parseInt(texto.substring(6).trim());
      if (!isNaN(ano)) {
        const idade = calcularIdade(ano);
        if (idade >= 0 && idade <= 150) {
          await sock.sendMessage(sender, { text: `🎂 Você tem ${idade} anos!` });
        } else {
          await sock.sendMessage(sender, { text: "❌ Ano inválido!" });
        }
      } else {
        await sock.sendMessage(sender, { text: "❌ Formato inválido! Use: idade <ano>" });
      }
    } 
    else if (texto.toLowerCase() === "clima") {
      await sock.sendMessage(sender, { text: "🤖 Bot está funcionando perfeitamente! Temperatura normal: 36.5°C 😎" });
    } 
    else if (texto.toLowerCase() === "sorte") {
      const sorte = Math.floor(Math.random() * 100) + 1;
      let mensagem = `🍀 Sua sorte hoje é: ${sorte}%\n\n`;
      if (sorte >= 80) mensagem += "Você terá um ótimo dia! 🌟";
      else if (sorte >= 50) mensagem += "Dia normal, nada de especial 😐";
      else mensagem += "Cuidado! Pode ser um dia complicado 😅";
      await sock.sendMessage(sender, { text: mensagem });
    } 
    else if (texto.toLowerCase() === "numero") {
      const numero = Math.floor(Math.random() * 100) + 1;
      await sock.sendMessage(sender, { text: `🎯 Seu número da sorte é: ${numero}` });
    } 
    else {
      await sock.sendMessage(sender, { text: "Não entendi esse comando. Digite *ajuda* para ver os comandos disponíveis! 🤔" });
    }
  });

  return sock;
}

// Iniciar bot
conectarWhatsApp().catch((err) => {
  console.error("Erro ao conectar:", err);
  process.exit(1);
});
