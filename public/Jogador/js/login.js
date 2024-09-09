import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db, doc, setDoc, query, where, collection, getDocs } from "../../bd.js";

let loginRedirected = false;
// Limpar os dados armazenados no localStorage caso o usuário saia de forma inesperada
localStorage.removeItem('jogadorId');
localStorage.removeItem('personagemId');

// Função de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //console.log('Login bem-sucedido:', userCredential.user);

        const jogadorId = await buscarOuCriarJogador(userCredential.user.email);
        localStorage.setItem('jogadorId', jogadorId);
        alert("Bem vindo ", userCredential.user.email)
        //redirect
        if (!loginRedirected && window.location.pathname !== '/jogador.html') {
            loginRedirected = true;
            window.location.href = './jogador.html';
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('login-error').textContent = 'E-mail ou senha inválidos. Tente novamente.';
    }
});

// Verificar se o usuário está autenticado
// onAuthStateChanged(auth, async (user) => {
//     if (userCredential) {
        
//         if (!loginRedirected && jogadorId) {
//             loginRedirected = true; // Impede múltiplos redirecionamentos
//             window.location.href = './personagem.html'; // Redirecionar após login
//         }

//         // Verificar se já foi redirecionado para evitar loop
        
//         // } else if (!redirectionOccurred) {
//         //     exibirModalSelecaoPersonagem(); // Exibir modal apenas uma vez se já estiver na página
//         // }
//     } else {
//         // Redirecionar para login se o usuário não estiver autenticado
//         if (window.location.pathname !== '/login.html') {
//             window.location.href = 'login.html';
//         }
//     }
// });

// Função para buscar ou criar jogador
async function buscarOuCriarJogador(email) {
    const jogadoresRef = collection(db, 'jogador');
    const q = query(jogadoresRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Se o jogador já existir, retornar o jogadorId
        const jogadorDoc = querySnapshot.docs[0];
        //console.log('Jogador encontrado:', jogadorDoc.data(), '\nID:', jogadorDoc.id);
        return jogadorDoc.id;
    } else {
        // Se não encontrar jogador, criar um novo
        const novoJogadorRef = doc(collection(db, 'jogador'));
        const novoJogadorData = { email };
        await setDoc(novoJogadorRef, novoJogadorData);
        //console.log('Novo jogador criado:', novoJogadorRef.id);
        return novoJogadorRef.id;
    }
}