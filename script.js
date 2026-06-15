// Configuração do Firebase
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

// Funções corrigidas e dinâmicas para controle do menu mobile
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  if (sidenav) {
    sidenav.style.width = "280px"; /* Ajustado o tamanho ideal */
  }
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  if (sidenav) {
    sidenav.style.width = "0";
  }
}

// Fechar menu automaticamente ao clicar fora dele (Melhoria de Usabilidade)
document.addEventListener("click", function(event) {
  const sidenav = document.getElementById("mySidenav");
  const menuIcon = document.querySelector(".menu-icon");
  if (sidenav && sidenav.style.width === "280px") {
    if (!sidenav.contains(event.target) && !menuIcon.contains(event.target)) {
      closeNav();
    }
  }
});

// Alternar exibição de campos de senha
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.type = (field.type === "password") ? "text" : "password";
  }
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Login realizado com sucesso! Bem-vindo(a) de volta 🐾");
        window.location.href = "perfil.html";
      })
      .catch((error) => {
        alert("Erro no login: " + error.message);
      });
  });
}

// Cadastro Geral
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
        return db.collection("usuarios").doc(userCredential.user.uid).set({
          nome: nome,
          cpf: cpf,
          idade: idade,
          email: email
        });
      })
      .then(() => {
        alert("Cadastro realizado com sucesso! Vamos cadastrar seu pet? 🐶");
        window.location.href = "cadastroCachorro.html"; /* Sugestão de fluxo direto para o pet */
      })
      .catch((error) => {
        alert("Erro no cadastro: " + error.message);
      });
  });
}

// Atualização de Perfil
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
      alert("Informações atualizadas com sucesso! ✨");
    })
    .catch((error) => {
      alert("Erro ao atualizar informações: " + error.message);
    });
  });
}

// Cadastro do Cachorro
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
        alert("Doguinho cadastrado com sucesso! Já pode planejar a sua viagem ✈️🐾");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Erro ao cadastrar cachorro: " + error.message);
      });
    } else {
      alert("Por favor, faça login para cadastrar um cachorro.");
    }
  });
}

// Comentários do Blog
const comentarioForm = document.getElementById("comentarioForm");
if (comentarioForm) {
  comentarioForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const comentario = document.getElementById("comentario").value;
    db.collection("comentarios").add({
      comentario: comentario,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert("Obrigado pelo seu comentário! Ele já foi publicado. 💬");
      document.getElementById("comentario").value = "";
    })
    .catch((error) => {
      alert("Erro ao enviar comentário: " + error.message);
    });
  });
}

// Função placeholder para Login/Cadastro Google
function googleSignIn() {
  alert("Integração do Google Sign-In em andamento...");
  // Insira sua lógica de provedor Google (firebase.auth.GoogleAuthProvider) aqui futuramente.
}
