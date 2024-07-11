import { db, collection, getDocs } from '/bd.js';

const searchInput = document.getElementById('search-spell');
const magiasContainer = document.getElementById('spell-cards-container');

//Função para exibir as magias no HTML
function exibirMagias() {
    getDocs(collection(db, 'magias'))
        .then((querySnapshot) => {
            magiasContainer.innerHTML = ''; // Limpar o container antes de exibir novas magias
            querySnapshot.forEach((doc) => {
                const magia = doc.data();
                const spellCard = document.createElement('div');
                spellCard.classList.add('spell-card');

                spellCard.innerHTML = `
                    <h3>${magia.nome}</h3>
                    <p><strong>Nível:</strong> ${magia.nivel}</p>
                    <p><strong>Escola:</strong> ${magia.Escola}</p>
                    <p><strong>Tempo de Conjuração:</strong> ${magia.tempo_conjuracao}</p>
                    <p><strong>Alcance:</strong> ${magia.alcance} metros</p>
                    <p><strong>Componentes:</strong> ${magia.componentes}</p>
                    <p><strong>Duração:</strong> ${magia.duracao}</p>
                    <p><strong>Descrição:</strong> ${magia.descricao}</p>
                    <button onclick="addSpellToList('${magia.nome}','${magia.Escola}','${magia.nivel}')">Adicionar Magia</button>
                `;
                magiasContainer.appendChild(spellCard);
            });

            aplicarFiltrosEMagia(); // Aplicar filtros e pesquisa após carregar as magias
        })
        .catch((error) => {
            console.error('Erro ao buscar magias: ', error);
        });
}

// Função para aplicar os filtros e pesquisa
function aplicarFiltrosEMagia() {
    const searchTerm = searchInput.value.toLowerCase();
    const allSpellCards = magiasContainer.getElementsByClassName('spell-card');

    Array.from(allSpellCards).forEach(card => {
        const magiaNome = card.querySelector('h3').textContent.toLowerCase();

        let isVisible = true;

        if (searchTerm && !magiaNome.includes(searchTerm)) {
            isVisible = false;
        }

        card.style.display = isVisible ? '' : 'none';
    });
}

// Adicionar eventos de filtro e pesquisa
searchInput.addEventListener('input', aplicarFiltrosEMagia);

// Exibir todas as magias ao carregar a página
exibirMagias();
