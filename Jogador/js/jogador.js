//FUNÇÕES DE SUBMIT
document.getElementById('save-character').onclick = function () {
    if (validateForm('character-form-modal')) {
        const character = {
            name: document.getElementById('name-modal').value,
            race: document.getElementById('race-modal').value,
            class: document.getElementById('class-modal').value,
            level: document.getElementById('level-modal').value,
            armorClass: document.getElementById('armor-class-modal').value,
            initiative: document.getElementById('initiative-modal').value,
            hitPoints: document.getElementById('hit-points-modal').value,
            abilities: document.getElementById('abilities-modal').value,
            background: document.getElementById('background-modal').value,
            traits: document.getElementById('traits-modal').value,
            stats: {
                strength: document.getElementById('strength-modal').value,
                dexterity: document.getElementById('dexterity-modal').value,
                constitution: document.getElementById('constitution-modal').value,
                intelligence: document.getElementById('intelligence-modal').value,
                wisdom: document.getElementById('wisdom-modal').value,
                charisma: document.getElementById('charisma-modal').value,
            },
        };
        localStorage.setItem('character', JSON.stringify(character));
        alert('Personagem Salvo!');
        displayCharacter();
        closeModal('character-modal');
    }
};

document.getElementById('cancel-character').onclick = function () {
    closeModal('character-modal');
};

document.getElementById('items-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const quantity = document.getElementById('quantity').value;
    const category = document.getElementById('category').value;
    let items = JSON.parse(localStorage.getItem('items')) || [];
    items.push({ item, quantity, category });
    localStorage.setItem('items', JSON.stringify(items));
    renderItems();
});

document.getElementById('spells-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const spell = document.getElementById('spell').value;
    const level = document.getElementById('spell-level').value;
    const type = document.getElementById('spell-type').value;
    let spells = JSON.parse(localStorage.getItem('spells')) || [];
    spells.push({ spell, level, type });
    localStorage.setItem('spells', JSON.stringify(spells));
    renderSpells();
});

document.getElementById('notes-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const noteTitle = document.getElementById('note-title').value;
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title: noteTitle, subtopics: [] });
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    document.getElementById('note-title').value = ''; // Clear the input
});

//FUNÇÕES DE RENDER
function renderItems() {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('items')) || [];
    if (items.length > 0) {
        const itemTitle = document.createElement('label');
        itemTitle.innerHTML = 'Itens';
        itemTitle.classList.add('block', 'mb-2', 'text-lg', 'font-semibold');
        itemsList.appendChild(itemTitle);
        itemsList.classList.add('bordered-list');
    } else {
        itemsList.classList.remove('bordered-list');
    }
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.item} (x${item.quantity}, ${item.category})
        <div class="text-right">
            <button class="btn-sm mb-1" onclick="editItem(${index})"> Editar</button> 
            <button class="btn-danger btn-sm mb-1" onclick="deleteItem(${index})"> Deletar</button>
        </div>
        `;
        li.classList.add('bordered-list');
        itemsList.appendChild(li);
    });
}

function renderSpells() {
    const spellsList = document.getElementById('spells-list');
    spellsList.innerHTML = '';
    const spells = JSON.parse(localStorage.getItem('spells')) || [];
    if (spells.length > 0) {
        const spellTitle = document.createElement('label');
        spellTitle.innerHTML = 'Magias';
        spellTitle.classList.add('block', 'mb-2', 'text-lg', 'font-semibold');
        spellsList.appendChild(spellTitle);
        spellsList.classList.add('bordered-list');
    } else {
        spellsList.classList.remove('bordered-list');
    }
    spells.forEach((spell, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${spell.spell} (Level ${spell.level}, ${spell.type}) 
            <div class="text-right">
                <button class="btn-sm mb-1" onclick="editSpell(${index})"> Editar</button> 
                <button class="btn-danger btn-sm mb-1" onclick="deleteSpell(${index})"> Deletar</button>
            </div>
            `;
        li.classList.add('bordered-list');
        spellsList.appendChild(li);
    });
}

function renderNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (notes.length > 0) {
        const notesTitle = document.createElement('label');
        notesTitle.innerHTML = 'Anotações';
        notesTitle.classList.add('block', 'mb-2', 'text-lg', 'font-semibold');
        notesList.appendChild(notesTitle);
        notesList.classList.add('bordered-list');
    } else {
        notesList.classList.remove('bordered-list');
    }
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.add('bordered-list', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
            <span class="note-text text-box">${note.title}</span>
            <div class=" text-right">
                <button class="btn-sm mb-1" onclick="openNoteModal(${index})">Editar</button>
                <button class="btn-danger btn-sm mb-1" onclick="deleteNote(${index})">Deletar</button>
            </div>
        `;
        notesList.appendChild(li);
    });
}
function renderSubtopics(subtopics) {
    const subtopicsList = document.getElementById('subtopics-list');
    subtopicsList.innerHTML = '';
    subtopics.forEach((subtopic, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="subtopic">${subtopic.replace(/\n/g, '<br>')}</td>
            <td class="text-right"><button class="btn-danger btn-sm mb-1 text-right" onclick="deleteSubtopic(${index})">Delete</button></td>
        `;
        subtopicsList.appendChild(tr);
    });
}

//FUNÇÕES MODAL
function openModal(modalId) {
    if (modalId === 'character-modal') {
        loadCharacterDataToModal();
    }
    document.getElementById(modalId).classList.add('show');
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = '';
}

function loadCharacterDataToModal() {
    const character = JSON.parse(localStorage.getItem('character'));
    if (character) {
        document.getElementById('name-modal').value = character.name;
        document.getElementById('race-modal').value = character.race;
        document.getElementById('class-modal').value = character.class;
        document.getElementById('level-modal').value = character.level;
        document.getElementById('armor-class-modal').value = character.armorClass;
        document.getElementById('initiative-modal').value = character.initiative;
        document.getElementById('hit-points-modal').value = character.hitPoints;
        document.getElementById('strength-modal').value = character.stats.strength;
        document.getElementById('dexterity-modal').value = character.stats.dexterity;
        document.getElementById('constitution-modal').value = character.stats.constitution;
        document.getElementById('intelligence-modal').value = character.stats.intelligence;
        document.getElementById('wisdom-modal').value = character.stats.wisdom;
        document.getElementById('charisma-modal').value = character.stats.charisma;
        document.getElementById('abilities-modal').value = character.abilities;
        document.getElementById('background-modal').value = character.background;
        document.getElementById('traits-modal').value = character.traits;
    }
}

function showItemModal(index) {
    const items = JSON.parse(localStorage.getItem('items'));
    const item = items[index];
    document.getElementById('edit-item').value = item.item;
    document.getElementById('edit-quantity').value = item.quantity;
    document.getElementById('edit-category').value = item.category;
    openModal('item-modal');

    document.getElementById('save-item').onclick = function () {
        items[index].item = document.getElementById('edit-item').value;
        items[index].quantity = document.getElementById('edit-quantity').value;
        items[index].category = document.getElementById('edit-category').value;
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
        closeModal('item-modal');
    };
    document.getElementById('cancel-item').onclick = function () {
        closeModal('item-modal');
    };
}

function showSpellModal(index) {
    const spells = JSON.parse(localStorage.getItem('spells'));
    const spell = spells[index];
    document.getElementById('edit-spell').value = spell.spell;
    document.getElementById('edit-spell-level').value = spell.level;
    document.getElementById('edit-spell-type').value = spell.type;
    openModal('spell-modal');

    document.getElementById('save-spell').onclick = function () {
        spells[index].spell = document.getElementById('edit-spell').value;
        spells[index].level = document.getElementById('edit-spell-level').value;
        spells[index].type = document.getElementById('edit-spell-type').value;
        localStorage.setItem('spells', JSON.stringify(spells));
        renderSpells();
        closeModal('spell-modal');
    };
    document.getElementById('cancel-spell').onclick = function () {
        closeModal('spell-modal');
    };
}

function openNoteModal(index) {
    currentNoteIndex = index;
    const notes = JSON.parse(localStorage.getItem('notes'));
    const note = notes[index];
    document.getElementById('edit-note-title').value = note.title;
    renderSubtopics(note.subtopics);
    openModal('note-modal');

    document.getElementById('close-note').onclick = function () {
        closeModal('note-modal');
    };
}

//OUTRAS FUNÇÕES

let currentNoteIndex = null;

function addSubtopic() {
    const subtopicText = document.getElementById('subtopic').value;
    if (subtopicText.trim() === '') return;
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (currentNoteIndex !== null && notes[currentNoteIndex]) {
        notes[currentNoteIndex].subtopics.push(subtopicText);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderSubtopics(notes[currentNoteIndex].subtopics);
        document.getElementById('subtopic').value = '';
    } else {
        console.error('Erro: currentNoteIndex ou notes[currentNoteIndex] não definido.');
    }
}

function editItem(index) {
    showItemModal(index);
}

function editSpell(index) {
    showSpellModal(index);
}

function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('items'));
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    renderItems();
}

function deleteSpell(index) {
    const spells = JSON.parse(localStorage.getItem('spells'));
    spells.splice(index, 1);
    localStorage.setItem('spells', JSON.stringify(spells));
    renderSpells();
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function deleteSubtopic(index) {
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes[currentNoteIndex].subtopics.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderSubtopics(notes[currentNoteIndex].subtopics);
}

// EXPORTAÇÃO E IMPORTAÇÃO
function exportCharacter() {
    const character = localStorage.getItem('character');
    const blob = new Blob([character], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ficha de Personagem.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importCharacter(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const character = JSON.parse(e.target.result);
        localStorage.setItem('character', JSON.stringify(character));
        alert('Personagem Importado!');
        displayCharacter();
    };
    reader.readAsText(file);
}
//FIM EXPORTAÇÃO E IMPORTAÇÃO

//DISPLAY, CALCULOS E VALIDAÇÃO
function displayCharacter() {
    const character = JSON.parse(localStorage.getItem('character'));
    if (character) {
        const bonuses = {
            strength: calculateBonus(character.stats.strength),
            dexterity: calculateBonus(character.stats.dexterity),
            constitution: calculateBonus(character.stats.constitution),
            intelligence: calculateBonus(character.stats.intelligence),
            wisdom: calculateBonus(character.stats.wisdom),
            charisma: calculateBonus(character.stats.charisma),
            proficiency: calculeteProficiency(character.level)
        };
        document.getElementById('character-details').innerHTML = `
            <p><strong>Nome:</strong> ${character.name}</p>
            <p><strong>Raça:</strong> ${character.race}</p>
            <p><strong>Level:</strong> ${character.level} (Proficiência: ${bonuses.proficiency >= 1 ? '+' : ''} ${bonuses.proficiency})</p> 
            <p><strong>Classe:</strong> ${character.class}</p>
            <p><strong>Classe Armadura (CA):</strong> ${character.armorClass}</p>
            <p><strong>Iniciativa:</strong> +${parseInt(character.initiative) + bonuses.dexterity}</p>
            <p><strong>Pontos de Vitalidade (PV):</strong> ${character.hitPoints}</p> 
            <p><strong>Força:</strong> ${character.stats.strength} (Bônus: ${bonuses.strength >= 0 ? '+' : ''}${bonuses.strength})</p>
            <p><strong>Destreza:</strong> ${character.stats.dexterity} (Bônus: ${bonuses.dexterity >= 0 ? '+' : ''}${bonuses.dexterity})</p>
            <p><strong>Constituição:</strong> ${character.stats.constitution} (Bônus: ${bonuses.constitution >= 0 ? '+' : ''}${bonuses.constitution})</p>
            <p><strong>Inteligência:</strong> ${character.stats.intelligence} (Bônus: ${bonuses.intelligence >= 0 ? '+' : ''}${bonuses.intelligence})</p>
            <p><strong>Sabedoria:</strong> ${character.stats.wisdom} (Bônus: ${bonuses.wisdom >= 0 ? '+' : ''}${bonuses.wisdom})</p>
            <p><strong>Carisma:</strong> ${character.stats.charisma} (Bônus: ${bonuses.charisma >= 0 ? '+' : ''}${bonuses.charisma})</p>
            <p><strong>Habilidades:</strong> ${character.abilities.replace(/\n/g, '<br>')}</p>
            <p><strong>Background:</strong> ${character.background.replace(/\n/g, '<br>')}</p>
            <p><strong>Características:</strong> ${character.traits.replace(/\n/g, '<br>')}</p>
        `;
    }
}

function calculateBonus(stat) {
    return Math.floor((stat - 10) / 2);
}

function calculeteProficiency(levelProficiency) {
    let bonusProficiency = 0;

    if (levelProficiency >= 1 && levelProficiency <= 4) { bonusProficiency = 2; }
    else if (levelProficiency >= 5 && levelProficiency <= 8) { bonusProficiency = 3; }
    else if (levelProficiency >= 9 && levelProficiency <= 12) { bonusProficiency = 4; }
    else if (levelProficiency >= 13 && levelProficiency <= 16) { bonusProficiency = 5; }
    else if (levelProficiency >= 17 && levelProficiency <= 20) { bonusProficiency = 6; }
    else { bonusProficiency = 0; }
    return bonusProficiency;
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return; //Se não existir sessão fecha a função. 
    const contents = section.querySelectorAll('div, form, ul, li');
    const button = section.querySelector('button');

    if (contents.length > 0) {
        contents.forEach(content => {
            if (content.style.display === 'none') {
                content.style.display = '';
            } else {
                content.style.display = 'none';
            }
        });
        button.textContent = contents[0].style.display === 'none' ? '+' : '-';
    } else {
        console.warn(`No toggleable content found in section: ${sectionId}`);
    }

}

function validateForm(formId) {
    const name = document.getElementById('name-modal').value;
    const level = document.getElementById('level-modal').value;
    const stats = ['strength-modal', 'dexterity-modal', 'constitution-modal', 'intelligence-modal', 'wisdom-modal', 'charisma-modal'];
    let valid = true;

    if (name.trim() === '') {
        alert('Nome é obrigatório.');
        valid = false;
    }

    if (isNaN(level) || level <= 0 || level > 20) {
        alert('Level tem que ser entre 1 à 20.');
        valid = false;
    }

    stats.forEach(stat => {
        const value = document.getElementById(stat).value;
        if (isNaN(value) || value < 0) {
            alert(`${stat.replace('-modal', '')} não pode ser um valor negativo.`);
            valid = false;
        }
    });

    return valid;
}


// Initial render
renderItems();
renderSpells();
renderNotes();
displayCharacter();