import { db, collection, getDocs, doc, setDoc } from '../../bd.js';
import { checkAuth } from './auth.js';

// Executa o script apenas após a autenticação
checkAuth()
    .then(() => {
        carregarPersonagens(); // Somente carrega os personagens após a autenticação
    })
    .catch((error) => {
        console.error('Erro de autenticação:', error);
    });

async function carregarPersonagens() {
    const jogadorId = localStorage.getItem('jogadorId');
    if (!jogadorId) {
        window.location.href = 'login.html'; // Redirecionar se não houver jogadorId no localStorage
    }

    const personagensRef = collection(db, 'jogador', jogadorId, 'personagem');
    const querySnapshot = await getDocs(personagensRef);

    const characterGrid = document.getElementById('character-grid');
    characterGrid.innerHTML = ''; // Limpar a grade de personagens

    querySnapshot.forEach((doc) => {
        const personagem = doc.data();
        const personagemId = doc.id;
        
        const button = document.createElement('button');
        button.textContent = personagem.name;
        button.addEventListener('click', () => {
            localStorage.setItem('personagemId', personagemId); // Salva o personagemId no localStorage
            window.location.href = 'personagem.html'; // Redireciona para jogador.html
        });

        characterGrid.appendChild(button);
    });
}

async function criarPersonagem() {
    const jogadorId = localStorage.getItem('jogadorId');

    const personagensRef = collection(db, 'jogador', jogadorId, 'personagem');
    const novoPersonagemRef = doc(personagensRef); // Cria um novo Documento para o personagem
    const novoPersonagemData = {
        name: "Personagem Novo",
        race: " ",
        class: " ",
        level: 1,
        armorClass: 10,
        initiative: 0,
        hitPoints: 0,
        abilities: " ",
        background: " ",
        traits: " ",
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        },
        proficiencies: {
            acrobatics: false,
            animalHandling: false,
            arcana: false,
            athletics: false,
            deception: false,
            history: false,
            insight: false,
            intimidation: false,
            investigation: false,
            medicine: false,
            nature: false,
            perception: false,
            performance: false,
            persuasion: false,
            religion: false,
            sleightOfHand: false,
            stealth: false,
            survival: false,
        }
    };

    await setDoc(novoPersonagemRef, novoPersonagemData);
    localStorage.setItem('personagemId', novoPersonagemRef.id); // Salva o personagemId no localStorage
    window.location.href = 'jogador.html'; // Redireciona para jogador.html
}

document.getElementById('create-character-btn').addEventListener('click', criarPersonagem);

// document.addEventListener('DOMContentLoaded', carregarPersonagens);