import { db, collection, getDocs } from '/bd.js';

const searchInput = document.getElementById('search-spell');
const magiasContainer = document.getElementById('spell-cards-container');

//Função para exibir as magias no HTML
async function exibirMagias() {
    try {
        const querySnapshot = await getDocs(collection(db, 'magias'));
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
                    <button type="submit">Adicionar Magia</button>
                `;
            magiasContainer.appendChild(spellCard);

            spellCard.addEventListener('submit', async (e) => {
                e.preventDefault();
                const playerId = 'TScXX3EnXxjQP7MO2Fei';
                const spellData = {
                    nome: magia.nome,
                    nivel: magia.nivel,
                    Escola: magia.Escola,
                    tempo_conjuracao: magia.tempo_conjuracao,
                    alcance: maiga.alcance,
                    componentes: magia.componentes,
                    duracao: magia.duracao,
                    descricao: magia.descricao
                };
                saveDataToSubCollection(playerId, 'magias', spellData);
            });
        });
        aplicarFiltrosEMagia(); // Aplicar filtros e pesquisa após carregar as magias
        
    } catch (error) {
        console.error('Erro ao buscar magias: ', error);
    }
}

async function saveDataToSubCollection(playerId, subCollectionName, data) {
    try {
      // Referência para o documento do jogador
      const playerDocRef = db.collection('jogador').doc(playerId);

      // Referência para a sub-coleção dentro do documento do jogador
      const subCollectionRef = playerDocRef.collection(subCollectionName);

      // Adicionar um novo documento à sub-coleção com os dados fornecidos
      const docRef = await subCollectionRef.add(data);

      console.log(`Dados salvos com sucesso na sub-coleção ${subCollectionName}:`, docRef.id);
    } catch (error) {
      console.error('Erro ao salvar dados na sub-coleção:', error);
    }
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
