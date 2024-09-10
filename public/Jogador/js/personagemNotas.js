import { db, collection, doc, getDocs, getDoc, addDoc, deleteDoc } from '../../bd.js';

const jogadorId = localStorage.getItem('jogadorId'); 
const personagemId = localStorage.getItem('personagemId'); 

const notesList = document.getElementById('notes-list');
const notesForm = document.getElementById('notes-form');
const noteTitleInput = document.getElementById('note-title');
const addSubtopicButton = document.getElementById('add-subtopic-btn');
let currentNoteId = null;

async function loadNotes() {
    try {
        const notesCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes');
        const querySnapshot = await getDocs(notesCollectionRef);

        const notes = [];
        querySnapshot.forEach((docSnapshot) => {
            const note = docSnapshot.data();
            note.id = docSnapshot.id;
            notes.push(note);
        });
        notes.sort((a, b) => a.order.seconds - b.order.seconds);
        renderNotes(notes);
    } catch (error) {
        console.error('Erro ao buscar notas: ', error);
    }
}

export function renderNotes(notes) {
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
                    <button class="btn-sm mb-1 px-2" onclick="openNoteModal('${note.id}')">Anotar</button>
                    <button class="btn-danger btn-sm mb-1 px-3" onclick="deleteNote('${note.id}')">×</button>
                </div>
            `;
        notesList.appendChild(li);
    });
}

async function addNote(noteTitle) {
    try {
        const notesCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes');

        const newNote = {
            titulo: noteTitle,
            order: new Date()
        };
        const docRef = await addDoc(notesCollectionRef, newNote);
        alert(`Nota adicionada com sucesso:`, docRef.id);
        loadNotes();
    } catch (error) {
        console.error('Erro ao adicionar nota: ', error);
    }
}

async function deleteNote(noteId) {
    try {
        const subtopicsCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId, 'topicos');
        
        const querySnapshot = await getDocs(subtopicsCollectionRef);
        const deleteSubtopicsPromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deleteSubtopicsPromises);
        
        const noteDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId);
        await deleteDoc(noteDocRef);
        
        alert('Nota excluída com sucesso:', noteId);
        loadNotes();
    } catch (error) {
        console.error('Erro ao excluir nota:', error);
    }
}

async function openNoteModal(noteId) {
    currentNoteId = noteId;
    const noteDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId);

    try {
        const noteSnapshot = await getDoc(noteDocRef);
        if (noteSnapshot.exists()) {
            const note = noteSnapshot.data();
            document.getElementById('edit-note-title').value = note.titulo;
            await loadSubtopics(noteId);
            openModal('note-modal');
            document.getElementById('close-note').onclick = function () {
                closeModal('note-modal');
                document.innerHTML = '';
            };
        } else {
            console.error('A nota não foi encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar a nota:', error);
    }
}

async function loadSubtopics(noteId) {
    const subtopicsCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', noteId, 'topicos');
    const querySnapshot = await getDocs(subtopicsCollectionRef);
    const subtopics = [];
    querySnapshot.forEach((docSnapshot) => {
        const subtopic = docSnapshot.data();
        subtopic.id = docSnapshot.id; 
        subtopics.push(subtopic);
    });
    subtopics.sort((a, b) => a.order.seconds - b.order.seconds);
    renderSubtopics(subtopics);
}

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

async function addSubtopic() {
    const subtopicInput = document.getElementById('subtopic');
    const description = subtopicInput.value;
    if (!currentNoteId) return;
    try {
        const subtopicsCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'anotacoes', currentNoteId, 'topicos');

        const newSubtopic = {
            descricao: description,
            order: new Date()
        };
        await addDoc(subtopicsCollectionRef, newSubtopic);
        alert('Subtópico adicionado com sucesso!');
        loadSubtopics(currentNoteId); 
        subtopicInput.value = '';
    } catch (error) {
        console.error('Erro ao adicionar subtópico: ', error);
    }
}

async function deleteSubtopic(subtopicId) {
    if (!currentNoteId) return;
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const subtopicDocRef = doc(personagemDocRef, 'anotacoes', currentNoteId, 'topicos', subtopicId);

        await deleteDoc(subtopicDocRef);
        alert('Subtópico excluído com sucesso:', subtopicId);
        loadSubtopics(currentNoteId);
    } catch (error) {
        console.error('Erro ao excluir subtópico:', error);
    }
}

notesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteTitle = noteTitleInput.value;
    addNote(noteTitle);
    noteTitleInput.value = '';
});

addSubtopicButton.addEventListener('click', addSubtopic);

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

window.openNoteModal = openNoteModal;
window.deleteNote = deleteNote;
window.deleteSubtopic = deleteSubtopic;
