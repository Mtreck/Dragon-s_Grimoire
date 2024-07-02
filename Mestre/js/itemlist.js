import { db, collection, addDoc, getDocs, deleteDoc, doc } from '/bd.js';


// Função para buscar itens do Firestore
async function fetchItems() {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const items = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
    });
    return items;
}

// Função para exibir itens no HTML
function displayItems(items) {
    const container = document.getElementById('item-cards-container');
    container.innerHTML = '';
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.innerHTML = `
            <h3>${item.Nome}</h3>
            <p> <strong> Descrição:</strong> ${item.Descrição}</p>  <strong> </strong>
            <p> <strong>Dano:</strong> ${item.Dano}</p>
            <p> <strong>Tipo de Dano:</strong> ${item.Tipo_de_Dano}</p>
            <p> <strong>CA:</strong> ${item.Ac}</p>
            <p> <strong>PO:</strong> ${item.Po}</p>
            <p> <strong>Qualidade:</strong> ${item.Qualidade}</p>
            <p> <strong>Tipo:</strong> ${item.Tipo}</p>
            <p> <strong>Origem:</strong> ${item.Origem}</p>
            <button class="delete-button" data-id="${item.id}">Excluir</button>
        `;
        container.appendChild(itemCard);
    });

    // Adicionar listeners para botões de exclusão
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const itemId = e.target.getAttribute('data-id');
            try {
                await deleteDoc(doc(db, 'items', itemId));
                alert('Item excluído com sucesso!');
                // Remover o item do DOM
                e.target.parentElement.remove();
            } catch (error) {
                console.error('Erro ao excluir item: ', error);
                alert('Erro ao excluir item. Tente novamente.');
            }
        });
    });
}

// Função para filtrar itens com base na pesquisa
function filterItems(items, searchText) {
    return items.filter(item => 
        item.Nome.toLowerCase().includes(searchText.toLowerCase()) 
    );
}

// Esperar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', async () => {
    const items = await fetchItems();
    displayItems(items);

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const filteredItems = filterItems(items, e.target.value);
        displayItems(filteredItems);
    });
});
