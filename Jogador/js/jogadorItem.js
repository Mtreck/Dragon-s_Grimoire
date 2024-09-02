import { db, collection, getDocs, updateDoc, deleteDoc, addDoc, doc, query, where } from '../../bd.js';


const searchInput = document.getElementById('search');
const itemsContainer = document.getElementById('item-cards-container');
const jogadorId = 'PTYlBypR3uej9RzN18pm'; // Substitua pelo ID real do jogador
const personagemId = 'HCIlBRPaLuogGHYYGupZ'; // Substitua pelo ID real do personagem

// Referências ao modal de edição e seus elementos
const editModal = document.getElementById('edit-item-modal');
const editForm = document.getElementById('edit-item-form');
const closeModalButton = editModal.querySelector('.close-button');
let currentItemId;

// Função para abrir o modal de edição
function openEditModal(item) {
    currentItemId = item.id;
    editForm['nome'].value = item.nome;
    editForm['quantidade'].value = item.quantidade;
    editForm['descricao'].value = item.descricao;
    editModal.style.display = 'flex';
}
// Função para fechar o modal de edição
function closeEditModal() {
    editModal.style.display = 'none';
}
// Fechar modal quando clicar no botão de fechar
closeModalButton.addEventListener('click', closeEditModal);

// Função para buscar itens do Firestore
async function fetchItems() {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const items = [];
    querySnapshot.forEach((docSnapshot) => {
        items.push({ id: docSnapshot.id, ...docSnapshot.data() });
    });
    return items;
}

// Função para exibir e adicionar os itens do modal
function displayItems(items) {
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        items.forEach(items => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                    <h3>${items.Nome}</h3>
                    <p><strong>Tipo:</strong> ${items.Tipo}</p>
                    <p><strong>Qualidade:</strong> ${items.Qualidade}</p>
                    <p><strong>Origem:</strong> ${items.Origem}</p>
                    <p><strong>PO:</strong> ${items.Po}</p>
                    <p><strong>Descrição:</strong> ${items.Descrição}</p>                  
                    <div class="text-right"><button type="button" class="add-item-btn">Adicionar Item</button><\div>
                `;
            itemsContainer.appendChild(itemCard);

            // Adicionar event listener para o botão "Adicionar Item"
            const addItemButton = itemCard.querySelector('.add-item-btn');
            addItemButton.addEventListener('click', async () => {
                const itemData = {
                    nome: items.Nome,
                    descricao: items.Descrição,
                    po: items.Po,
                    qualidade: items.Qualidade,
                    tipo: items.Tipo,
                    origem: items.Origem,
                    quantidade: 1
                };
                await saveItemToSubCollection(itemData);
                renderItems();
            });
        });
    }
}

async function saveItemToSubCollection(data) {
    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId,'personagem', personagemId, 'item');

        // Verificar se o item já existe
        const q = query(subCollectionRef, where('nome', '==', data.nome));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log('O item já existe na sub-coleção.');
            return; // Item já existe, não adicionar novamente
        }

        // Adicionar um novo documento à sub-coleção com os dados fornecidos
        const docRef = await addDoc(subCollectionRef, data);
        console.log(`Dados salvos com sucesso na sub-coleção de itens:`, docRef.id);
        alert('Item adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados na sub-coleção:', error);
    }
}

// Função para filtrar itens com base na pesquisa
function filterItems(items, searchText) {
    return items.filter(item =>
        item.Nome.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Descrição.toLowerCase().includes(searchText.toLowerCase())
    );
}

// Função para editar um item
async function editItem(itemId, updatedData) {
    try {
        const jogadorDocRef = doc(db, 'jogador', jogadorId);
        const personagemDocRef = doc(jogadorDocRef, 'personagem', personagemId);
        const itemDocRef = doc(personagemDocRef, 'item', itemId);

        await updateDoc(itemDocRef, {
            nome: updatedData.nome,
            quantidade: parseInt(updatedData.quantidade), // Certifique-se de que é um número
            descricao: updatedData.descricao
        });
        console.log('Item atualizado com sucesso:', itemId);
        closeEditModal();
        renderItems(); // Atualizar a lista de itens após a edição
    } catch (error) {
        console.error('Erro ao atualizar o item:', error);
    }
}

// Função para excluir um item
async function deleteItem(itemId) {
    try {
        const jogadorDocRef = doc(db, 'jogador', jogadorId);
        const personagemDocRef = doc(jogadorDocRef, 'personagem', personagemId);
        const itemDocRef = doc(personagemDocRef, 'item', itemId);

        await deleteDoc(itemDocRef);
        console.log('Item excluído com sucesso:', itemId);
        renderItems(); // Atualizar a lista de itens após a exclusão
    } catch (error) {
        console.error('Erro ao excluir o item:', error);
    }
}

async function renderItems() {
    const itemsList = document.getElementById('items-list');
    try {
        const jogadorDocRef = doc(db, 'jogador', jogadorId);
        const personagemDocRef = doc(jogadorDocRef, 'personagem', personagemId);
        const subCollectionRef = collection(personagemDocRef, 'item');

        const querySnapshot = await getDocs(subCollectionRef);
        itemsList.innerHTML = ''; // Limpar a lista antes de exibir os itens

        querySnapshot.forEach((docSnapshot) => {
            const item = docSnapshot.data();
            item.id = docSnapshot.id; // Capturar o ID do documento corretamente
            const listItem = document.createElement('div');
            listItem.classList.add('item-list-card');

            listItem.innerHTML = `
                    <h4>${item.nome}</h4>
                    <div><strong>Quantidade:</strong> ${item.quantidade} </div>
                    <div><strong>Descrição:</strong> ${item.descricao}</div>
                    <div><strong>PO:</strong> ${item.po}</div>
                    <div class="text-right">
                    <button type="button" class="px-3 py-1 rounded edit-item-btn">Editar</button>
                    <button type="button" class="btn-danger px-3 py-1 rounded delete-item-btn">Excluir</button>
                    </div>
                `;
            itemsList.appendChild(listItem);

            // Adicionar event listener para o botão "Editar"
            const editItemButton = listItem.querySelector('.edit-item-btn');
            editItemButton.addEventListener('click', () => {
                openEditModal(item);
            });

            // Adicionar event listener para o botão "Excluir"
            const deleteItemButton = listItem.querySelector('.delete-item-btn');
            deleteItemButton.addEventListener('click', () => {
                deleteItem(docSnapshot.id);
            });
        });
    } catch (error) {
        console.error('Erro ao buscar itens salvos: ', error);
    }
}

// Lidar com a submissão do formulário de edição
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
        nome: editForm['nome'].value,
        quantidade: editForm['quantidade'].value,
        descricao: editForm['descricao'].value,
    };
    editItem(currentItemId, updatedData);
});


document.addEventListener('DOMContentLoaded', () => {
    fetchItems().then(items => {
        displayItems(items);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const filteredItems = filterItems(items, e.target.value);
                displayItems(filteredItems);
            });
        }
    }).catch(error => {
        console.error('Erro ao buscar itens: ', error);
    });
    
    // Carregar itens salvos ao carregar a página
    renderItems();
});