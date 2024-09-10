import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../../bd.js";

export function checkAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user); 
            } else {
                window.location.href = 'login.html';
                reject('Usuário não autenticado.');
            }
        });
    });
} 