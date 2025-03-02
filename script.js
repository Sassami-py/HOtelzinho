/*
  script.js
  Arquivo compartilhado para gerenciar funcionalidades do site Hotelzinho da Luisa.
  Inclua-o em cada página, por exemplo:
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
  <script src="script.js"></script>
*/

// Configuração do Firebase – substitua os placeholders pelos dados do seu projeto
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funções para o menu mobile/hamburger (se presente em todas as páginas)
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  if (sidenav) {
    sidenav.style.width = "250px";
  }
}
function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  if (sidenav) {
    sidenav.style.width = "0";
  }
}

// Função para alternar a exibição da senha
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.type = (field.type === "password") ? "text" : "password";
  }
}

// Processamento do formulário de login (ex.: login.html)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Login realizado com sucesso!");
        // Redireciona para a página de perfil ou outra página desejada
        window.location.href = "perfil.html";
      })
      .catch((error) => {
        alert("Erro no login: " + error.message);
      });
  });
}

// Processamento do formulário de cadastro de cliente (ex.: cadastro.html)
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const idade = document.getElementById("idade").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;

    if (senha !== confirmaSenha) {
      alert("As senhas não conferem!");
      return;
    }

    auth.createUserWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        // Salva dados adicionais do usuário no Firestore
        return db.collection("usuarios").doc(userCredential.user.uid).set({
          nome: nome,
          cpf: cpf,
          idade: idade,
          email: email
        });
      })
      .then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "perfil.html";
      })
      .catch((error) => {
        alert("Erro no cadastro: " + error.message);
      });
  });
}

// Processamento do formulário de atualização de perfil (ex.: perfil.html)
const perfilForm = document.getElementById("perfilForm");
if (perfilForm) {
  perfilForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }
    const nome = document.getElementById("nomePerfil").value;
    const cpf = document.getElementById("cpfPerfil").value;
    const idade = document.getElementById("idadePerfil").value;
    const email = document.getElementById("emailPerfil").value;

    db.collection("usuarios").doc(user.uid).update({
      nome: nome,
      cpf: cpf,
      idade: idade,
      email: email
    })
    .then(() => {
      alert("Informações atualizadas com sucesso!");
    })
    .catch((error) => {
      alert("Erro ao atualizar informações: " + error.message);
    });
  });
}

// Processamento do formulário de cadastro de cachorro (ex.: cadastroCachorro.html)
const cadastroCachorroForm = document.getElementById("cadastroCachorroForm");
if (cadastroCachorroForm) {
  cadastroCachorroForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const idadeCachorro = document.getElementById("idadeCachorro").value;
    const sexoCachorro = document.getElementById("sexoCachorro").value;
    const porteCachorro = document.getElementById("porteCachorro").value;
    const racaCachorro = document.getElementById("racaCachorro").value;

    const user = auth.currentUser;
    if (user) {
      db.collection("usuarios").doc(user.uid).collection("cachorros").add({
        idade: idadeCachorro,
        sexo: sexoCachorro,
        porte: porteCachorro,
        raca: racaCachorro
      })
      .then(() => {
        alert("Cachorro cadastrado com sucesso!");
        // Redirecione para outra página, se necessário
      })
      .catch((error) => {
        alert("Erro ao cadastrar cachorro: " + error.message);
      });
    } else {
      alert("Por favor, faça login para cadastrar um cachorro.");
    }
  });
}

// Processamento do formulário de comentário no blog (ex.: blog.html)
const comentarioForm = document.getElementById("comentarioForm");
if (comentarioForm) {
  comentarioForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const comentario = document.getElementById("comentario").value;
    db.collection("comentarios").add({
      comentario: comentario,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
      // Se necessário, inclua informações adicionais, como ID do usuário
    })
    .then(() => {
      alert("Comentário enviado com sucesso!");
      document.getElementById("comentario").value = "";
    })
    .catch((error) => {
      alert("Erro ao enviar comentário: " + error.message);
    });
  });
}