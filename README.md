# 🤖 WhatsApp Bot com Baileys

Um bot WhatsApp simples e divertido criado com **Baileys** e **Node.js**!

## 📋 Requisitos

- Node.js 14+
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/kellscript/whatsapp-bot-baileys.git
cd whatsapp-bot-baileys
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o bot:**
```bash
npm start
```

4. **Escaneie o QR Code** que aparecer no terminal com seu WhatsApp

## 📱 Comandos Disponíveis

| Comando | Resposta |
|---------|----------|
| `oi` | Cumprimento |
| `opa` | Resposta casual |
| `ajuda` | Menu de comandos |
| `hora` | Horário atual |
| `ping` | Teste de conexão |

## 📚 Como Funciona

- O bot se conecta ao WhatsApp usando **Baileys**
- Escuta mensagens recebidas
- Responde automaticamente com base nos comandos
- As credenciais são armazenadas em `auth_info_multi/`

## 🛠️ Desenvolvimento

Para modo de desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📝 Customização

Edite o arquivo `bot.js` para adicionar novos comandos:

```javascript
} else if (texto.toLowerCase() === "seu_comando") {
  await sock.sendMessage(sender, { text: "Sua resposta aqui!" });
}
```

## ⚠️ Aviso Legal

- Use responsavelmente e respeitando os termos de serviço do WhatsApp
- Este bot é apenas para fins educacionais e de diversão

## 📄 Licença

MIT

---

Feito com ❤️ por kellscript
