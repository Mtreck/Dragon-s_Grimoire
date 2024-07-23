import { db, collection, getDocs, addDoc, doc, query, where } from '../../bd.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-spell');
  const magiasContainer = document.getElementById('spell-cards-container');
  const playerId = 'TScXX3EnXxjQP7MO2Fei'; //personagemID (trocado quando tiver autenticação)

  // Função para exibir as magias no HTML (Modal de magias)
  async function exibirMagias() {
    try {
      const querySnapshot = await getDocs(collection(db, 'magias'));
      magiasContainer.innerHTML = ''; // Limpar o container antes de exibir novas magias

      querySnapshot.forEach((docSnapshot) => {
        const magia = docSnapshot.data();
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
            <button type="button" class="add-spell-btn">Adicionar Magia</button>
          `;
        magiasContainer.appendChild(spellCard);

        // Adicionar event listener para o botão "Adicionar Magia"
        const addSpellButton = spellCard.querySelector('.add-spell-btn');
        addSpellButton.addEventListener('click', async () => {
          const spellData = {
            nome: magia.nome,
            nivel: magia.nivel,
            escola: magia.Escola,
            tempo_conjuracao: magia.tempo_conjuracao,
            alcance: magia.alcance,
            componentes: magia.componentes,
            duracao: magia.duracao,
            descricao: magia.descricao
          };
          await saveDataToSubCollection('magias', spellData);
        });
      });

      aplicarFiltrosEMagia(); // Aplicar filtros e pesquisa após carregar as magias
    } catch (error) {
      console.error('Erro ao buscar magias: ', error);
    }
  }

  async function saveDataToSubCollection(subCollectionName, data) {
    try {
      const playerDocRef = doc(db, 'personagem', playerId);
      const subCollectionRef = collection(playerDocRef, subCollectionName);

      // Verificar se a magia já existe
      const q = query(subCollectionRef, where('nome', '==', data.nome));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('A magia já existe na sub-coleção.');
        return; // Magia já existe, não adicionar novamente
      }
      const docRef = await addDoc(subCollectionRef, data);

      console.log(`Dados salvos com sucesso na sub-coleção ${subCollectionName}:`, docRef.id);
    } catch (error) {
      console.error('Erro ao salvar dados na sub-coleção:', error);
    }
  }

  async function renderSpells() {
    const spellsList = document.getElementById('spells-list');
    try {
      const playerDocRef = doc(db, 'personagem', playerId);
      const subCollectionRef = collection(playerDocRef, 'magias');
      const querySnapshot = await getDocs(subCollectionRef);
      spellsList.innerHTML = ''; // Limpar a lista antes de exibir as magias

      querySnapshot.forEach((docSnapshot) => {
        const magia = docSnapshot.data();
        const listItem = document.createElement('div');
        listItem.classList.add('spell-list-card');

        listItem.innerHTML = `
              <h4>${magia.nome}</h4>
              <p><strong>Magia de ${magia.escola} do ${magia.nivel}º circulo </strong></p>
              <p><strong>Descrição:</strong> ${magia.descricao}</p>
            `;
        spellsList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Erro ao buscar magias salvas: ', error);
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
  renderSpells();
});