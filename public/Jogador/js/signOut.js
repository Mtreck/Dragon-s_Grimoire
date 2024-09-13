import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../../bd.js";

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('jogadorId');
        localStorage.removeItem('personagemId');
        window.location.href = './login.html';
    }).catch((error) => {
        console.error('Erro ao deslogar:', error);
    });
});

document.getElementById('change-character-btn').addEventListener('click', () => {
    localStorage.removeItem('personagemId');
    window.location.href = 'jogador.html';
});