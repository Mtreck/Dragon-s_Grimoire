import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db, doc, setDoc, query, where, collection, getDocs } from "../../bd.js";

let loginRedirected = false;

localStorage.removeItem('jogadorId');
localStorage.removeItem('personagemId');


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const jogadorId = await buscarOuCriarJogador(userCredential.user.email);
        localStorage.setItem('jogadorId', jogadorId);
        alert("Jogador autenticado com sucesso.");

        if (!loginRedirected && window.location.pathname !== '/jogador.html') {
            loginRedirected = true;
            window.location.href = './jogador.html';
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('login-error').textContent = 'E-mail ou senha inválidos. Tente novamente.';
    }
});

async function buscarOuCriarJogador(email) {
    const jogadoresRef = collection(db, 'jogador');
    const q = query(jogadoresRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const jogadorDoc = querySnapshot.docs[0];
        return jogadorDoc.id;
    } else {
        const novoJogadorRef = doc(collection(db, 'jogador'));
        const novoJogadorData = { email };
        await setDoc(novoJogadorRef, novoJogadorData);
        return novoJogadorRef.id;
    }
}