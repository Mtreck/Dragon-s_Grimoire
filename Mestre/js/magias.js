import { db, collection, addDoc, getDocs, deleteDoc, doc } from '/bd.js';
// Selecionando elementos do DOM
const searchInput = document.getElementById('search');
const classFilter = document.getElementById('class-filter');
const levelFilter = document.getElementById('level-filter');
const addSpellButton = document.getElementById('add-spell-button');
const magiasContainer = document.getElementById('conteiner_magias');

//Função para carregar e adicionar magias do JSON ao Firebase
// async function carregarMagiasDoJSON() {
//     try {
//         const response = await fetch('../spells-final.json');
//         const data = await response.json();

//         // Acessando o array de magias
//         const magias = data.magias;

//        // Referência à coleção 'magias' no Firestore
//        const magiasCollectionRef = collection(db, 'magias');

//        // Itera sobre as magias e as adiciona ao Firestore
//        magias.forEach(async (magia) => {
//            try {
//                const docRef = await addDoc(magiasCollectionRef, magia);
//                console.log(`Magia ${magia.nome} adicionada com sucesso com ID: ${docRef.id}`);
//            } catch (error) {
//                console.error("Erro ao adicionar magia ao Firestore:", error);
//            }
//        });
//    } catch (error) {
//        console.error("Erro ao carregar magias do JSON:", error);
//    }
// }
// carregarMagiasDoJSON();

// Função para criar o modal de cadastro de magia
function createModal() {
    // Criando elementos do modal
    const modal = document.createElement('div');
    modal.id = 'add-spell-modal';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Adicionar Nova Magia';

    const addSpellForm = document.createElement('form');
    addSpellForm.id = 'add-spell-form';

    // Campos do formulário
    addSpellForm.innerHTML = `
        <label for="spell-name">Nome da Magia:</label>
        <input type="text" id="spell-name" name="spell-name" required>

        <label for="spell-level">Nível:</label>
        <select id="spell-level" name="spell-level" required>
            <option value="">Selecione o nível</option>
            <option value="Truque">Truque</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
        </select>
         <label for="spell-school">Tipo de Magia:</label>
        <select id="spell-school" name="spell-school" required>
            <option value="">Selecione o tipo de magia</option>
            <option value="Abjuração">Abjuração</option>
            <option value="Adivinhação">Adivinhação</option>
            <option value="Conjuração">Conjuração</option>
            <option value="Encantamento">Encantamento</option>
            <option value="Evocação">Evocação</option>
            <option value="Ilusão">Ilusão</option>
            <option value="Necromancia">Necromancia</option>
            <option value="Transmutação">Transmutação</option>
        </select>

        <label for="spell-casting-time">Tempo de Conjuração:</label>
        <input type="text" id="spell-casting-time" name="spell-casting-time" required>

        <label for="spell-range">Alcance (em metros):</label>
        <input type="text" id="spell-range" name="spell-range" required>

        <label for="spell-components">Componentes:</label>
        <input type="text" id="spell-components" name="spell-components" required>

        <label for="spell-duration">Duração:</label>
        <input type="text" id="spell-duration" name="spell-duration" required>

        <label for="spell-description">Descrição:</label>
        <textarea  id="spell-description" name="spell-description" rows="10" required></textarea>

        <button type="submit">Adicionar Magia</button>
    `;

    // Adicionando elementos ao modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(addSpellForm);
    modal.appendChild(modalContent);

    // Eventos de fechar o modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Evento de submissão do formulário
    addSpellForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const spellName = addSpellForm['spell-name'].value;
        const spellLevel = parseInt(addSpellForm['spell-level'].value);
        const spellSchool = (addSpellForm['spell-school'].value);
        const spellCastingTime = addSpellForm['spell-casting-time'].value;
        const spellRange = (addSpellForm['spell-range'].value);
        const spellComponents = addSpellForm['spell-components'].value;
        const spellDuration = addSpellForm['spell-duration'].value;
        const spellDescription = addSpellForm['spell-description'].value;

        try {
            // Adicionando magia ao Firestore
            const docRef = await addDoc(collection(db, 'magias'), {
                nome: spellName,
                nivel: spellLevel,
                Escola:spellSchool,
                tempo_conjuracao: spellCastingTime,
                alcance: spellRange,
                componentes: spellComponents,
                duracao: spellDuration,
                descricao: spellDescription
            });

            console.log('Documento adicionado com ID: ', docRef.id);

            // Limpar o formulário após adicionar a magia
            addSpellForm.reset();
            modal.style.display = 'none'; // Fechar o modal após adicionar

            // Atualizar a lista de magias após adicionar uma nova
            exibirMagias();

        } catch (error) {
            console.error('Erro ao adicionar documento: ', error);
        }
    });

    return modal;
}

// Função para buscar e exibir todas as magias no container
async function exibirMagias() {
    try {
        const querySnapshot = await getDocs(collection(db, 'magias'));
        magiasContainer.innerHTML = ''; // Limpar o container antes de exibir novas magias
        querySnapshot.forEach((doc) => {
            const magia = doc.data();
            const spellCard = document.createElement('div');
            spellCard.classList.add('spell-card');

            // Limitar descrição a 3 linhas e adicionar botão "Detalhes"
            const descricaoResumida = limitarLinhasDescricao(magia.descricao, 3);
            spellCard.innerHTML = `
                <h3>${magia.nome}</h3>
                <p><strong>Nível:</strong> ${magia.nivel}</p>
                <p><strong>Escola:</strong> ${magia.Escola}</p>
                <p><strong>Alcance:</strong> ${magia.alcance} metros</p>
                <p><strong>Componentes:</strong> ${magia.componentes}</p>
                <p><strong>Duração:</strong> ${magia.duracao}</p>
                <p><strong>Descrição:</strong> ${descricaoResumida}</p>
                <button class="details-button" data-descricao="${magia.descricao}">Detalhes</button>
            `;
            magiasContainer.appendChild(spellCard);

            // Adicionar evento para abrir modal com descrição completa
            const detailsButton = spellCard.querySelector('.details-button');
            detailsButton.addEventListener('click', () => {
                const fullDescription = detailsButton.getAttribute('data-descricao');
                abrirModalDescricao(fullDescription);
            });
        });

        aplicarFiltrosEMagia(); // Aplicar filtros e pesquisa após carregar as magias
    } catch (error) {
        console.error('Erro ao buscar magias: ', error);
    }
}

// Função para limitar a descrição a um número específico de linhas
function limitarLinhasDescricao(descricao, numLinhas) {
    const linhas = descricao.split('\n');
    const descricaoLimitada = linhas.slice(1, numLinhas).join('\n');
    return descricaoLimitada;
}

// Função para abrir modal com descrição completa
function abrirModalDescricao(descricaoCompleta) {
    const modal = document.createElement('div');
    modal.id = 'descricao-modal';
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Descrição</h2>
            <p class="modeal_crescicao" >${descricaoCompleta}</p>
        </div>
    `;

    // Fechar modal ao clicar no botão de fechar ou fora do modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Adicionar modal ao corpo da página
    document.body.appendChild(modal);
    modal.style.display = 'block';
}


// Função para aplicar os filtros e pesquisa
function aplicarFiltrosEMagia() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClass = classFilter.value;
    const selectedLevel = levelFilter.value;

    const allSpellCards = magiasContainer.getElementsByClassName('spell-card');

    Array.from(allSpellCards).forEach(card => {
        const magiaNome = card.querySelector('h3').textContent.toLowerCase();
        const magiaEscola = card.querySelector('p:nth-child(3)').textContent.toLowerCase();
        const magiaNivel = card.querySelector('p:nth-child(2)').textContent.replace('Nível: ', '');

        let isVisible = true;

        if (searchTerm && !magiaNome.includes(searchTerm)) {
            isVisible = false;
        }

        if (selectedClass && !magiaEscola.includes(selectedClass.toLowerCase())) {
            isVisible = false;
        }

        if (selectedLevel && magiaNivel !== selectedLevel) {
            isVisible = false;
        }

        card.style.display = isVisible ? '' : 'none';
    });
}

// Adicionar eventos de filtro e pesquisa
searchInput.addEventListener('input', aplicarFiltrosEMagia);
classFilter.addEventListener('change', aplicarFiltrosEMagia);
levelFilter.addEventListener('change', aplicarFiltrosEMagia);


// Abrir o modal quando clicar em "Adicionar"
addSpellButton.addEventListener('click', () => {
    document.body.appendChild(createModal());
    document.getElementById('add-spell-modal').style.display = 'block';
});

// Exibir todas as magias ao carregar a página
exibirMagias();
