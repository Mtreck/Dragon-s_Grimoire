import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../../bd.js";

// Função de logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        //console.log('Usuário deslogado');
        
        // Limpar os dados armazenados no localStorage
        localStorage.removeItem('jogadorId');
        localStorage.removeItem('personagemId');

        // Redirecionar para a página de login
        window.location.href = './login.html';
    }).catch((error) => {
        console.error('Erro ao deslogar:', error);
    });
});