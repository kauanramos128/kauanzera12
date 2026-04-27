// app.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

document.getElementById('btn-login').addEventListener('click', async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    loadDashboard(userCredential.user.uid);
  } catch (e) {
    alert('Erro ao logar: ' + e.message);
  }
});

document.getElementById('btn-register').addEventListener('click', async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    // cria dados iniciais no Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      saldo: 1518.38,
      fatura: 16.44,
      limite: 983.56
    });
    loadDashboard(userCredential.user.uid);
  } catch (e) {
    alert('Erro ao cadastrar: ' + e.message);
  }
});

async function loadDashboard(uid) {
  loginContainer.style.display = 'none';
  dashboard.style.display = 'block';

  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    document.getElementById('saldo').innerText = `R$ ${data.saldo.toFixed(2)}`;
    document.getElementById('cartao').querySelector('p').innerText = `Fatura atual: R$ ${data.fatura.toFixed(2)}`;
    document.getElementById('cartao').querySelectorAll('p')[1].innerText = `Limite disponível: R$ ${data.limite.toFixed(2)}`;
  }
}

window.acao = function(nome) {
  alert(`Botão clicado: ${nome}`);
  // Aqui você poderia chamar uma função real de Pix ou API
}