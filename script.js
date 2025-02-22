/* script.js */

// Configuração do Firebase – substitua pelos dados do seu projeto
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Cadastro de usuário com dados adicionais (cliente e pet)
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nome    = document.getElementById('nome').value;
  const email   = document.getElementById('email').value;
  const senha   = document.getElementById('senha').value;
  const petNome = document.getElementById('petNome').value;
  const petTipo = document.getElementById('petTipo').value;

  auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      // Salva informações adicionais no Firestore
      return db.collection('usuarios').doc(user.uid).set({
        nome,
        email,
        pets: [{
          nome: petNome,
          tipo: petTipo
        }]
      });
    })
    .then(() => {
      alert('Cadastro realizado com sucesso!');
      registerForm.reset();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
});

// Login do usuário
const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  
  auth.signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      // Exibe a área do cliente e oculta o formulário de login
      document.getElementById('clienteArea').style.display = 'block';
      document.getElementById('loginForm').style.display = 'none';
      
      // Carrega dados do usuário
      db.collection('usuarios').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          document.getElementById('clienteNome').innerText = doc.data().nome;
        }
      });
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
});

// Logout do usuário
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      document.getElementById('clienteArea').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    });
  });
}

// Simulador de orçamento
const simuladorForm = document.getElementById('simuladorForm');
simuladorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const dias   = parseInt(document.getElementById('dias').value);
  const pacote = parseFloat(document.getElementById('pacoteEscolhido').value);
  const total  = dias * pacote;
  
  document.getElementById('resultadoSimulador').innerText = `Orçamento: R$ ${total.toFixed(2)}`;
});

// Login Administrativo (exemplo simples)
const formAdminLogin = document.getElementById('formAdminLogin');
formAdminLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('adminEmail').value;
  const senha = document.getElementById('adminSenha').value;
  
  // Aqui você pode implementar uma lógica de autenticação mais robusta para administradores.
  if(email === "admin@hotelzinopet.com" && senha === "admin123") {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('painelAdmin').style.display = 'block';
  } else {
    alert('Credenciais inválidas para administrador.');
  }
});

// Exemplo de ação para visita teste
document.getElementById('visitaTesteBtn').addEventListener('click', () => {
  alert('Agendamento de visita teste em breve!');
});

// Outros eventos e funções (edição de dados, adição de novos pets, geração de contratos, etc.)
// devem ser implementados conforme a necessidade, integrando com o Firebase e/ou backend de sua escolha.
