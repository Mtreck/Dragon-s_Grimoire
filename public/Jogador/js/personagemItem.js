import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from '../../bd.js';

const itemsContainer = document.getElementById('item-cards-container');
const buscarItensBtn = document.getElementById('buscar-itens-btn');
const searchInput = document.getElementById('search');
const jogadorId = localStorage.getItem('jogadorId');
const personagemId = localStorage.getItem('personagemId');

let itemsCarregados = false; 
let cachedItems = []; 
let currentItemId = null;

async function loadPersonagemItems() {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'item');
        const querySnapshot = await getDocs(subCollectionRef);

        querySnapshot.forEach((docSnapshot) => {
            const item = docSnapshot.data();
            item.id = docSnapshot.id; 
            displayPersonagemItem(item);
        });
    } catch (error) {
        console.error('Erro ao buscar itens registrados: ', error);
    }
}

async function fetchGlobalItems() {
    if (itemsCarregados) {
        return cachedItems;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        cachedItems = [];

        querySnapshot.forEach((docSnapshot) => {
            cachedItems.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });

        itemsCarregados = true;
        return cachedItems;
    } catch (error) {
        console.error('Erro ao buscar itens globais:', error);
        return [];
    }
}

function displayGlobalItems(items) {
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                <h3>${item.Nome}</h3>
                <p><strong>Tipo:</strong> ${item.Tipo}</p>
                <p><strong>Qualidade:</strong> ${item.Qualidade}</p>
                <p><strong>Descrição:</strong> ${item.Descrição}</p>
                <button type="button" class="add-item-btn">Adicionar Item</button>
            `;

            const addItemButton = itemCard.querySelector('.add-item-btn');
            addItemButton.addEventListener('click', async () => {
                await saveItemToPersonagem(item); 
                loadPersonagemItems();
            });

            itemsContainer.appendChild(itemCard);
        });
    }
}

function filterItems(query) {
    const filteredItems = cachedItems.filter(item =>
        item.Nome.toLowerCase().includes(query.toLowerCase()) ||
        item.Descrição.toLowerCase().includes(query.toLowerCase())
    );
    displayGlobalItems(filteredItems); 
}

async function saveItemToPersonagem(item) {
    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'item');

        const q = query(subCollectionRef, where('Nome', '==', item.Nome));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert('O item já existe no personagem.');
            return; 
        }

        const newItem = {
            Nome: item.Nome,
            Descrição: item.Descrição,
            Quantidade: 1, 
            Po: item.Po || 0, 
        };
        await addDoc(subCollectionRef, newItem);
        alert('Item adicionado ao personagem com sucesso.');
    } catch (error) {
        console.error('Erro ao adicionar item ao personagem:', error);
    }
}

function displayPersonagemItem(item) {
    const itemsList = document.getElementById('items-list');
    const listItem = document.createElement('div');
    listItem.classList.add('item-list-card');

    listItem.innerHTML = `
        <h4>${item.Nome}</h4>
        <div class="item-qnt-po">
            <p><strong>Quantidade:</strong> ${item.Quantidade}</p>
            <p><strong>Ouro (po):</strong> ${item.Po || 0}</p>
        </div>
        <p><strong>Descrição:</strong> ${item.Descrição}</p>
        
        <div class="text-right mt-2">
            <button type="button" class="edit-item-btn px-2">Editar</button>
            <button type="button" class="delete-item-btn btn-danger px-2">Excluir</button>
        </div>
    `;

    const editItemButton = listItem.querySelector('.edit-item-btn');
    editItemButton.addEventListener('click', () => {
        currentItemId = item.id; 
        openEditModal(item);
    });
    const deleteItemButton = listItem.querySelector('.delete-item-btn');
    deleteItemButton.addEventListener('click', async () => {
        await deleteItemFromPersonagem(item.id);
        loadPersonagemItems();
    });
    itemsList.appendChild(listItem);
}

function openEditModal(item) {
    document.getElementById('edit-item-nome').value = item.Nome;
    document.getElementById('edit-item-quantidade').value = item.Quantidade || 0;
    document.getElementById('edit-item-descricao').value = item.Descrição;
    document.getElementById('edit-item-po').value = item.Po || 0; 
    openModal('edit-item-modal');
}

document.getElementById('edit-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemId = currentItemId;
    const updatedItem = {
        Nome: document.getElementById('edit-item-nome').value,
        Quantidade: document.getElementById('edit-item-quantidade').value,
        Descrição: document.getElementById('edit-item-descricao').value,
        Po: document.getElementById('edit-item-po').value,
    };

    try {
        const itemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'item', itemId);
        await updateDoc(itemDocRef, updatedItem);
        alert('Item atualizado com sucesso!');
        loadPersonagemItems(); 
        closeModal('edit-item-modal'); 
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
    }
});

async function deleteItemFromPersonagem(itemId) {
    try {
        const itemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'item', itemId);
        await deleteDoc(itemDocRef);
        alert('Item excluído com sucesso.');
    } catch (error) {
        console.error('Erro ao excluir item:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPersonagemItems();
});

buscarItensBtn.addEventListener('click', async () => {
    const globalItems = await fetchGlobalItems();
    displayGlobalItems(globalItems);
});

searchInput.addEventListener('input', (e) => {
    const searchQuery = e.target.value;
    filterItems(searchQuery); 
});
