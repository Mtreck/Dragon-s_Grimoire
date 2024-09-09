import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from '../../bd.js';

const itemsContainer = document.getElementById('item-cards-container');
const buscarItensBtn = document.getElementById('buscar-itens-btn');
const searchInput = document.getElementById('search');
const jogadorId = localStorage.getItem('jogadorId');
const personagemId = localStorage.getItem('personagemId');

let itemsCarregados = false; // Controle de carregamento de itens globais
let cachedItems = []; // Armazenar os itens carregados globalmente
let currentItemId = null; // Declarar currentItemId globalmente

// Função para carregar os itens registrados no personagemId ao carregar a página
async function loadPersonagemItems() {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = ''; // Limpa a lista antes de exibir os itens do personagem

    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'item');
        const querySnapshot = await getDocs(subCollectionRef);

        querySnapshot.forEach((docSnapshot) => {
            const item = docSnapshot.data();
            item.id = docSnapshot.id; // Captura o ID do documento do jogador (não o global)
            displayPersonagemItem(item); // Exibe o item no DOM
        });
    } catch (error) {
        console.error('Erro ao buscar itens registrados: ', error);
    }
}

// Função para buscar os itens globais (apenas uma vez)
async function fetchGlobalItems() {
    if (itemsCarregados) {
        return cachedItems;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        cachedItems = []; // Limpa o cache para armazenar os itens

        querySnapshot.forEach((docSnapshot) => {
            cachedItems.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });

        itemsCarregados = true; // Marcar como carregado
        return cachedItems;
    } catch (error) {
        console.error('Erro ao buscar itens globais:', error);
        return [];
    }
}

// Função para exibir os itens globais ao clicar no botão de buscar
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

            // Adicionar o evento de adicionar item ao personagem
            const addItemButton = itemCard.querySelector('.add-item-btn');
            addItemButton.addEventListener('click', async () => {
                await saveItemToPersonagem(item); // Salvar apenas os campos essenciais
                loadPersonagemItems(); // Atualizar a lista de itens do personagem
            });

            itemsContainer.appendChild(itemCard);
        });
    }
}

// Função para filtrar os itens enquanto o usuário digita
function filterItems(query) {
    const filteredItems = cachedItems.filter(item =>
        item.Nome.toLowerCase().includes(query.toLowerCase()) ||
        item.Descrição.toLowerCase().includes(query.toLowerCase())
    );
    displayGlobalItems(filteredItems); // Atualiza a exibição dos itens
}

// Função para salvar o item ao personagem (apenas nome, descrição, quantidade e po)
async function saveItemToPersonagem(item) {
    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'item');

        // Verifica se o item já existe no personagem
        const q = query(subCollectionRef, where('Nome', '==', item.Nome));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert('O item já existe no personagem.');
            return; // Não adiciona duplicado
        }

        // Adicionar o item à sub-coleção do personagem (somente os campos essenciais)
        const newItem = {
            Nome: item.Nome,
            Descrição: item.Descrição,
            Quantidade: 1, // Quantidade inicial como 1
            Po: item.Po || 0, // Se o item não tiver valor de Po, define como 0
        };
        await addDoc(subCollectionRef, newItem);
        alert('Item adicionado ao personagem com sucesso.');
    } catch (error) {
        console.error('Erro ao adicionar item ao personagem:', error);
    }
}

// Função para exibir um item do personagem no DOM
function displayPersonagemItem(item) {
    const itemsList = document.getElementById('items-list');
    const listItem = document.createElement('div');
    listItem.classList.add('item-list-card');

    listItem.innerHTML = `
        <h4>${item.Nome}</h4>
        <p><strong>Descrição:</strong> ${item.Descrição}</p>
        <p><strong>Quantidade:</strong> ${item.Quantidade}</p>
        <p><strong>Ouro (po):</strong> ${item.Po || 0}</p>
        <div class="text-right">
            <button type="button" class="edit-item-btn px-2">Editar</button>
            <button type="button" class="delete-item-btn btn-danger px-2">Excluir</button>
        </div>
    `;

    // Evento de edição
    const editItemButton = listItem.querySelector('.edit-item-btn');
    editItemButton.addEventListener('click', () => {
        currentItemId = item.id; // Armazena o ID do item atual para uso na edição
        openEditModal(item);
    });

    // Evento de exclusão
    const deleteItemButton = listItem.querySelector('.delete-item-btn');
    deleteItemButton.addEventListener('click', async () => {
        await deleteItemFromPersonagem(item.id);
        loadPersonagemItems(); // Atualiza a lista após exclusão
    });

    itemsList.appendChild(listItem);
}

// Função para abrir o modal de edição e preencher com os dados do item
function openEditModal(item) {
    document.getElementById('edit-item-nome').value = item.Nome;
    document.getElementById('edit-item-quantidade').value = item.Quantidade || 0;
    document.getElementById('edit-item-descricao').value = item.Descrição;
    document.getElementById('edit-item-po').value = item.Po || 0; // Preenche o campo "po", ou 0 se não existir

    openModal('edit-item-modal'); // Abre o modal de edição
}

// Função para salvar as alterações feitas no item
document.getElementById('edit-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemId = currentItemId; // Armazena o ID do item atualmente sendo editado
    const updatedItem = {
        Nome: document.getElementById('edit-item-nome').value,
        Quantidade: document.getElementById('edit-item-quantidade').value,
        Descrição: document.getElementById('edit-item-descricao').value,
        Po: document.getElementById('edit-item-po').value, // Salva a quantidade de ouro
    };

    try {
        const itemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'item', itemId);
        await updateDoc(itemDocRef, updatedItem);
        alert('Item atualizado com sucesso!');
        loadPersonagemItems(); // Atualiza a lista de itens após a edição
        closeModal('edit-item-modal'); // Fecha o modal após salvar
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
    }
});

// Função para deletar um item do personagem
async function deleteItemFromPersonagem(itemId) {
    try {
        const itemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId, 'item', itemId);
        await deleteDoc(itemDocRef);
        alert('Item excluído com sucesso.');
    } catch (error) {
        console.error('Erro ao excluir item:', error);
    }
}

// Carregar os itens registrados no personagem ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadPersonagemItems();
});

// Carregar itens globais ao clicar no botão de buscar (uma vez)
buscarItensBtn.addEventListener('click', async () => {
    const globalItems = await fetchGlobalItems();
    displayGlobalItems(globalItems);
});

// Escuta o evento de digitação no campo de pesquisa
searchInput.addEventListener('input', (e) => {
    const searchQuery = e.target.value;
    filterItems(searchQuery); // Filtra os itens com base na pesquisa
});
