// app.js

// --- Funções de Navegação ---
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

// --- Função para Alternar Exibição de Senha ---
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.type = field.type === "password" ? "text" : "password";
  }
}

// --- Função para Login com Google ---
function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      alert("Login com Google realizado com sucesso!");
      window.location.href = "perfil.html";
    })
    .catch((error) => {
      alert("Erro no login com Google: " + error.message);
    });
}

// --- Processamento do Formulário de Login ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Login realizado com sucesso!");
        window.location.href = "perfil.html";
      })
      .catch((error) => {
        alert("Erro no login: " + error.message);
      });
  });
}

// --- Processamento do Formulário de Cadastro de Cliente ---
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
        // Envia email de verificação
        userCredential.user.sendEmailVerification()
          .then(() => {
            alert("Verificação de email enviada. Por favor, confira sua caixa de entrada.");
          })
          .catch((error) => {
            alert("Erro ao enviar verificação de email: " + error.message);
          });
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

// --- Processamento do Formulário de Atualização de Perfil ---
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

// --- Processamento do Formulário de Cadastro de Cachorro ---
const cadastroCachorroForm = document.getElementById("cadastroCachorroForm");
if (cadastroCachorroForm) {
  cadastroCachorroForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const idadeCachorro = document.getElementById("idadeCachorro").value;
    const sexoCachorro = document.getElementById("sexoCachorro").value;
    const porteCachorro = document.getElementById("porteCachorro").value;
    const racaCachorro = document.getElementById("racaCachorro").value;

    // Se o cachorro for macho, exibe um pop-up para confirmar se é castrado
    if (sexoCachorro === "M") {
      const isCastrated = confirm("Apenas aceitamos machos castrados. O cachorro é castrado?");
      if (!isCastrated) {
        alert("Por favor, cadastre um cachorro macho castrado ou selecione outra opção.");
        return;
      }
    }

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
      })
      .catch((error) => {
        alert("Erro ao cadastrar cachorro: " + error.message);
      });
    } else {
      alert("Por favor, faça login para cadastrar um cachorro.");
    }
  });
}

// --- Processamento do Formulário de Comentário no Blog ---
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
      alert("Comentário enviado com sucesso!");
      document.getElementById("comentario").value = "";
    })
    .catch((error) => {
      alert("Erro ao enviar comentário: " + error.message);
    });
  });
}
