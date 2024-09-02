import { db, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from '../../bd.js';
import { closeModal, openModal } from './modal.js';

const jogadorId = 'PTYlBypR3uej9RzN18pm'; // Substitua pelo ID real do jogador
const personagemId = 'HCIlBRPaLuogGHYYGupZ'; // Substitua pelo ID real do personagem

const notesList = document.getElementById('notes-list');
const notesForm = document.getElementById('notes-form');
const noteTitleInput = document.getElementById('note-title');
const addSubtopicButton = document.getElementById('add-subtopic-btn');
let currentNoteId = null;

// Função para carregar as notas do Firestore
async function loadNotes() {
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const notesCollectionRef = collection(personagemDocRef, 'anotacoes');
        const querySnapshot = await getDocs(notesCollectionRef);

        const notes = [];
        querySnapshot.forEach((docSnapshot) => {
            const note = docSnapshot.data();
            note.id = docSnapshot.id; // Captura o ID do documento
            notes.push(note);
        });

        renderNotes(notes);
    } catch (error) {
        console.error('Erro ao buscar notas: ', error);
    }
}

// Função para renderizar as notas na tela
function renderNotes(notes) {
    notesList.innerHTML = '';
    if (notes.length > 0) {
        const notesTitle = document.createElement('label');
        notesTitle.innerHTML = 'Anotações';
        notesTitle.classList.add('block', 'mb-2', 'text-lg', 'font-semibold');
        notesList.appendChild(notesTitle);
        notesList.classList.add('bordered-list');
    } else {
        notesList.classList.remove('bordered-list');
    }
    notes.forEach((note) => {
        const li = document.createElement('li');
        li.classList.add('bordered-list', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
                <span class="note-text text-box">${note.titulo}</span>
                <div class=" text-right">
                    <button class="btn-sm mb-1" onclick="openNoteModal('${note.id}')">Anotar</button>
                    <button class="btn-danger btn-sm mb-1" onclick="deleteNote('${note.id}')">Deletar</button>
                </div>
            `;
        notesList.appendChild(li);
    });
}

// Função para adicionar uma nova nota ao Firestore
async function addNote(noteTitle) {
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const notesCollectionRef = collection(personagemDocRef, 'anotacoes');

        const newNote = {
            titulo: noteTitle
        };
        const docRef = await addDoc(notesCollectionRef, newNote);
        console.log(`Nota adicionada com sucesso:`, docRef.id);
        loadNotes(); // Recarregar as notas após adicionar
    } catch (error) {
        console.error('Erro ao adicionar nota: ', error);
    }
}

// Função para deletar uma nota do Firestore
async function deleteNote(noteId) {
    try {
        const noteDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId);

        await deleteDoc(noteDocRef);
        console.log('Nota excluída com sucesso:', noteId);
        loadNotes(); // Recarregar as notas após deletar
    } catch (error) {
        console.error('Erro ao excluir nota:', error);
    }
}

// Função para abrir o modal de edição de nota
async function openNoteModal(noteId) {
    currentNoteId = noteId;
    const noteDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId);

    try {
        const noteSnapshot = await getDoc(noteDocRef); // Buscar o documento específico
        if (noteSnapshot.exists()) {
            const note = noteSnapshot.data();
            document.getElementById('edit-note-title').value = note.titulo;
            await loadSubtopics(noteId);
            openModal('note-modal');
            document.getElementById('close-note').onclick = function () {
                closeModal('note-modal');
            };
        } else {
            console.error('A nota não foi encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar a nota:', error);
    }
}

// Função para carregar os subtópicos do Firestore
async function loadSubtopics(noteId) {
    const subtopicsCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId, 'topicos');
    const querySnapshot = await getDocs(subtopicsCollectionRef);

    const subtopics = [];
    querySnapshot.forEach((docSnapshot) => {
        const subtopic = docSnapshot.data();
        subtopic.id = docSnapshot.id; // Captura o ID do documento
        subtopics.push(subtopic);
    });

    renderSubtopics(subtopics);
}

// Função para renderizar os subtópicos na tela
function renderSubtopics(subtopics) {
    const subtopicsList = document.getElementById('subtopics-list');
    subtopicsList.innerHTML = '';
    subtopics.forEach((subtopic) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td class="subtopic">${subtopic.descricao}</td>
                <td class="text-right">
                    <button class="btn-danger btn-sm mb-1" onclick="deleteSubtopic('${subtopic.id}')">Excluir</button>
                </td>
            `;
        subtopicsList.appendChild(tr);
    });
}

// Função para adicionar um subtópico ao Firestore
async function addSubtopic() {
    const subtopicInput = document.getElementById('subtopic');
    const description = subtopicInput.value;
    if (!currentNoteId) return;
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const subtopicsCollectionRef = collection(personagemDocRef, 'anotacoes', currentNoteId, 'topicos');

        const newSubtopic = {
            descricao: description
        };
        await addDoc(subtopicsCollectionRef, newSubtopic);
        console.log('Subtópico adicionado com sucesso!');
        loadSubtopics(currentNoteId); // Recarregar os subtópicos após adicionar
        subtopicInput.value = ''; // Limpar o campo de entrada
    } catch (error) {
        console.error('Erro ao adicionar subtópico: ', error);
    }
}

// Função para deletar um subtópico do Firestore
async function deleteSubtopic(subtopicId) {
    if (!currentNoteId) return;
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const subtopicDocRef = doc(personagemDocRef, 'anotacoes', currentNoteId, 'topicos', subtopicId);

        await deleteDoc(subtopicDocRef);
        console.log('Subtópico excluído com sucesso:', subtopicId);
        loadSubtopics(currentNoteId); // Recarregar os subtópicos após deletar
    } catch (error) {
        console.error('Erro ao excluir subtópico:', error);
    }
}

// Lidar com a submissão do formulário de notas
notesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteTitle = noteTitleInput.value;
    addNote(noteTitle);
    noteTitleInput.value = ''; // Limpar o campo de entrada
});

// Adicionar event listener para o botão "Adicionar Subtópico"
addSubtopicButton.addEventListener('click', addSubtopic);

// Carregar as notas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});
// Tornar as funções acessíveis globalmente
window.openNoteModal = openNoteModal;
window.deleteNote = deleteNote;
window.deleteSubtopic = deleteSubtopic;
