// Funções auxiliares
function gerarJoke() {
  const jokes = [
    "Por que o livro de matemática se suicidou? Porque tinha muitos problemas! 📚",
    "O que o Windows disse para o Linux? Você não é windows!",
    "Por que o programador saiu de casa? Porque ele perdeu a conexão! 🔌",
    "Como um programador sai do chuveiro? Vê a instrução no frasco e tenta aplicar: while(notClean) { wash(); }",
    "Qual é o objeto mais honesto da casa? O espelho, porque ele nunca mente! 🪞",
    "Um byte entra em um bar e pede uma bebida. O bartender pergunta: Qual é seu tipo? 🍺",
    "Por que o JS é tão versátil? Porque ele consegue fazer tudo, mas ninguém entende como! 😂",
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function calcularIdade(ano) {
  const anoAtual = new Date().getFullYear();
  return anoAtual - ano;
}

function validarOperacao(operacao) {
  return /^[0-9+\-*/.() ]+$/.test(operacao);
}

module.exports = {
  gerarJoke,
  calcularIdade,
  validarOperacao,
};
