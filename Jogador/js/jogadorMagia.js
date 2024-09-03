import { db, collection, getDocs, deleteDoc, addDoc, doc, query, where } from '../../bd.js';


const searchInput = document.getElementById('search-spell');
const magiasContainer = document.getElementById('spell-cards-container');
const jogadorId = 'PTYlBypR3uej9RzN18pm'; // Substitua pelo ID real do jogador
const personagemId = 'HCIlBRPaLuogGHYYGupZ'; // Substitua pelo ID real do personagem

// Função para exibir as magias no HTML (Modal de magias)
async function displayMagias() {
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
                    <p><strong>Escola:</strong> ${magia.escola}</p>
                    <p><strong>Tempo de Conjuração:</strong> ${magia.tempo_conjuracao}</p>
                    <p><strong>Alcance:</strong> ${magia.alcance} metros</p>
                    <p><strong>Componentes:</strong> ${magia.componentes}</p>
                    <p><strong>Duração:</strong> ${magia.duracao}</p>
                    <p><strong>Descrição:</strong> ${magia.descricao}</p>
                    <div class="text-right"><button type="button" class="add-spell-btn">Adicionar Magia</button></div>
          `;
            magiasContainer.appendChild(spellCard);

            // Adicionar event listener para o botão "Adicionar Magia"
            const addSpellButton = spellCard.querySelector('.add-spell-btn');
            addSpellButton.addEventListener('click', async () => {
                const spellData = {
                    nome: magia.nome,
                    nivel: magia.nivel,
                    escola: magia.escola,
                    tempo_conjuracao: magia.tempo_conjuracao,
                    alcance: magia.alcance,
                    componentes: magia.componentes,
                    duracao: magia.duracao,
                    descricao: magia.descricao
                };
                await saveDataToSubCollection(spellData);
            });
        });

        aplicarFiltrosEMagia(); // Aplicar filtros e pesquisa após carregar as magias
    } catch (error) {
        console.error('Erro ao buscar magias: ', error);
    }
}

async function saveDataToSubCollection(data) {
    try {
        const subCollectionRef = collection(db, 'jogador', jogadorId, 'personagem', personagemId, 'magias');

        // Verificar se a magia já existe
        const q = query(subCollectionRef, where('nome', '==', data.nome));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log('A magia já existe na sub-coleção.');
            return; // Magia já existe, não adicionar novamente
        }
        const docRef = await addDoc(subCollectionRef, data);

        console.log(`Dados salvos com sucesso na sub-coleção ${subCollectionRef}:`, docRef.id);
        renderSpells();
    } catch (error) {
        console.error('Erro ao salvar dados na sub-coleção:', error);
    }
}

//Carrega as magias na pagina inicial do HTML
async function renderSpells() {
    const spellsList = document.getElementById('spells-list');
    try {
        const jogadorDocRef = doc(db, 'jogador', jogadorId);
        const personagemDocRef = doc(jogadorDocRef, 'personagem', personagemId);
        const subCollectionRef = collection(personagemDocRef, 'magias');
        const querySnapshot = await getDocs(subCollectionRef);
        spellsList.innerHTML = ''; // Limpar a lista antes de exibir as magias

        const magias = [];
        querySnapshot.forEach((docSnapshot) => {
            const magia = docSnapshot.data();
            magia.id = docSnapshot.id; // Capturar o ID do documento
            magias.push(magia);
        });

        // Ordenar as magias por nível de forma decrescente
        magias.sort((a, b) => b.nivel - a.nivel);

        magias.forEach((magia) => {
            const listItem = document.createElement('div');
            listItem.classList.add('spell-list-card');
            listItem.innerHTML = `
                <h4>${magia.nome}</h4>
                <p><strong>Magia de ${magia.escola} do ${magia.nivel}º círculo</strong></p>
                <div class="text-right">
                    <button type="button" class="rounded px-2 py- 1 view-spell-btn text-right">Ver Detalhes</button>
                    <button type="button" class="btn-danger px-2 py-1 rounded delete-spell-btn">Excluir</button>
                <\div>
            `;
            spellsList.appendChild(listItem);

            // Adicionar event listener para o botão "Ver Detalhes"
            const viewSpellButton = listItem.querySelector('.view-spell-btn');
            viewSpellButton.addEventListener('click', () => {
                openSpellModal(magia);
            });
            // Adicionar event listener para o botão "Excluir"
            const deleteSpellButton = listItem.querySelector('.delete-spell-btn');
            deleteSpellButton.addEventListener('click', () => {
                deleteSpell(magia.id);
            });
        });
    } catch (error) {
        console.error('Erro ao buscar magias salvas: ', error);
    }
}

function openSpellModal(magia) {
    const spellModal = document.getElementById('all-spell-modal');
    const spellListInfo = document.getElementById('spell-list-info');

    spellListInfo.innerHTML = `
            <div class="container mb-3">
                <h1>${magia.nome}</h1>
                <button class="btn-danger px-3 py-1 rounded close-spell-modal-btn">&times;</button>
            </div>            
            <div><strong>Nível de conjuração:</strong> ${magia.nivel}</div>
            <div><strong>Escola:</strong> ${magia.escola}</div>
            <div><strong>Tempo de Conjuração:</strong> ${magia.tempo_conjuracao}</div>
            <div><strong>Alcance:</strong> ${magia.alcance}</div>
            <div><strong>Componentes:</strong> ${magia.componentes}</div>
            <div><strong>Duração:</strong> ${magia.duracao}</div>
            <div class="mb-4"><strong>Descrição:</strong> ${magia.descricao}</div>
            <div class="text-right"><button class="btn-danger px-3 py-1 rounded close-spell-modal-btn">&times;</button></div>
        `;

    // Mostrar o modal
    spellModal.style.display = 'flex';

    // Adicionar event listener para o botão "Fechar"
    const closeSpellModalButtons = spellListInfo.querySelectorAll('.close-spell-modal-btn');
    closeSpellModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            spellModal.style.display = 'none';
        });
    });
}
// Função para apagar a magia
async function deleteSpell(spellId) {
    try {
        const jogadorDocRef = doc(db, 'jogador', jogadorId);
        const personagemDocRef = doc(jogadorDocRef, 'personagem', personagemId);
        const spellDocRef = doc(personagemDocRef, 'magias', spellId);

        await deleteDoc(spellDocRef);
        console.log('Magia excluída com sucesso:', spellId);
        renderSpells(); // Atualizar a lista de magias após a exclusão
    } catch (error) {
        console.error('Erro ao excluir a magia:', error);
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
document.addEventListener('DOMContentLoaded', () => {
    // Exibir todas as magias ao carregar a página
    displayMagias();
    renderSpells();
});