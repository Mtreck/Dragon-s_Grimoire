import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../../bd.js";

// Função para verificar autenticação e só continuar se o usuário estiver logado
export function checkAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Se o usuário estiver autenticado
                resolve(user); // Retorna o usuário autenticado
            } else {
                // Se não estiver autenticado, redireciona para a página de login
                window.location.href = 'login.html';
                reject('Usuário não autenticado.');
            }
        });
    });
} 