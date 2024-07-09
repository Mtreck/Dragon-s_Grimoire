import { db, collection, getDocs } from '../../bd.js';

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
    if (container) {
        container.innerHTML = '';
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                <h3>${item.Nome}</h3>
                <p><strong>Descrição:</strong> ${item.Descrição}</p>
                <p><strong>PO:</strong> ${item.Po}</p>
                <p><strong>Qualidade:</strong> ${item.Qualidade}</p>
                <p><strong>Tipo:</strong> ${item.Tipo}</p>
                <p><strong>Origem:</strong> ${item.Origem}</p>
            `;
            container.appendChild(itemCard);
        });
    }
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
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filteredItems = filterItems(items, e.target.value);
            displayItems(filteredItems);
        });
    }
});