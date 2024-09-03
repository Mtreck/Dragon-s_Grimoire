import { db, doc, getDoc, deleteDoc, setDoc } from '../../bd.js';

const jogadorId = 'PTYlBypR3uej9RzN18pm'; // Substitua pelo ID real do jogador
const personagemId = 'HCIlBRPaLuogGHYYGupZ'; // Substitua pelo ID real do personagem

// Função para salvar ou atualizar o personagem no Firestore
document.getElementById('save-character').onclick = async function (event) {
    event.preventDefault();
    if (validateForm()) { //'character-form-modal' no HTML
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
            proficiencies: {
                acrobatics: document.getElementById('acrobatics-proficiency').checked,
                animalHandling: document.getElementById('animal-handling-proficiency').checked,
                arcana: document.getElementById('arcana-proficiency').checked,
                athletics: document.getElementById('athletics-proficiency').checked,
                deception: document.getElementById('deception-proficiency').checked,
                history: document.getElementById('history-proficiency').checked,
                insight: document.getElementById('insight-proficiency').checked,
                intimidation: document.getElementById('intimidation-proficiency').checked,
                investigation: document.getElementById('investigation-proficiency').checked,
                medicine: document.getElementById('medicine-proficiency').checked,
                nature: document.getElementById('nature-proficiency').checked,
                perception: document.getElementById('perception-proficiency').checked,
                performance: document.getElementById('performance-proficiency').checked,
                persuasion: document.getElementById('persuasion-proficiency').checked,
                religion: document.getElementById('religion-proficiency').checked,
                sleightOfHand: document.getElementById('sleight-of-hand-proficiency').checked,
                stealth: document.getElementById('stealth-proficiency').checked,
                survival: document.getElementById('survival-proficiency').checked,
            }
        };

        try {
            const personagemDocRef = doc(db, "jogador", jogadorId, "personagem", personagemId);
            await setDoc(personagemDocRef, character);
            console.log('Personagem Salvo com sucesso!');
            displayCharacter();
        } catch (e) {
            console.error("Erro ao salvar personagem: ", e);
            alert('Erro ao salvar personagem.');
        }
        closeModal('character-modal');
    }
};

document.getElementById('cancel-character').onclick = function (event) {
    event.preventDefault();
    closeModal('character-modal');
};

// Função para carregar os dados do personagem específico no modal
export async function loadCharacterDataToModal() {
    const personagemDocRef = doc(db, "jogador", jogadorId, "personagem", personagemId);
    const personagemSnapshot = await getDoc(personagemDocRef);

    if (personagemSnapshot.exists()) {
        const character = personagemSnapshot.data();

        if (character && character.stats && character.proficiencies) {
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

        } else {
            console.log("Ainda não foram atribuidos dados ao personagem para serem mostrados.");
            // Sai da função se os dados forem nulos ou incompletos
        }
    }
}

// Função para exibir o personagem específico na página principal
async function displayCharacter() {
    const personagemDocRef = doc(db, "jogador", jogadorId, "personagem", personagemId);
    const personagemSnapshot = await getDoc(personagemDocRef);

    if (personagemSnapshot.exists()) {
        const character = personagemSnapshot.data();

        if (!character || !character.stats || !character.proficiencies) {
            console.log("Ainda não foram atribuídos dados ao personagem para serem mostrados.");
            return; // Sai da função se os dados forem nulos ou incompletos
        }

        const bonuses = {
            strength: calculateBonus(character.stats.strength),
            dexterity: calculateBonus(character.stats.dexterity),
            constitution: calculateBonus(character.stats.constitution),
            intelligence: calculateBonus(character.stats.intelligence),
            wisdom: calculateBonus(character.stats.wisdom),
            charisma: calculateBonus(character.stats.charisma),
            proficiency: calculeteProficiency(character.level)
        };

        const proficiencyList = `
            <p><strong>Acrobacia (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, character.proficiencies.acrobatics, bonuses.proficiency)}</p>
            <p><strong>Adestrar Animais (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, character.proficiencies.animalHandling, bonuses.proficiency)}</p>
            <p><strong>Arcanismo (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, character.proficiencies.arcana, bonuses.proficiency)}</p>
            <p><strong>Atletismo (For):</strong> ${calculateProficiencyBonus(bonuses.strength, character.proficiencies.athletics, bonuses.proficiency)}</p>
            <p><strong>Enganação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, character.proficiencies.deception, bonuses.proficiency)}</p>
            <p><strong>História (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, character.proficiencies.history, bonuses.proficiency)}</p>
            <p><strong>Intuição (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, character.proficiencies.insight, bonuses.proficiency)}</p>
            <p><strong>Intimidação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, character.proficiencies.intimidation, bonuses.proficiency)}</p>
            <p><strong>Investigação (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, character.proficiencies.investigation, bonuses.proficiency)}</p>
            <p><strong>Medicina (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, character.proficiencies.medicine, bonuses.proficiency)}</p>
            <p><strong>Natureza (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, character.proficiencies.nature, bonuses.proficiency)}</p>
            <p><strong>Percepção (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, character.proficiencies.perception, bonuses.proficiency)}</p>
            <p><strong>Atuação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, character.proficiencies.performance, bonuses.proficiency)}</p>
            <p><strong>Persuasão (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, character.proficiencies.persuasion, bonuses.proficiency)}</p>
            <p><strong>Religião (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, character.proficiencies.religion, bonuses.proficiency)}</p>
            <p><strong>Prestidigitação (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, character.proficiencies.sleightOfHand, bonuses.proficiency)}</p>
            <p><strong>Furtividade (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, character.proficiencies.stealth, bonuses.proficiency)}</p>
            <p><strong>Sobrevivência (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, character.proficiencies.survival, bonuses.proficiency)}</p>
        `;


        document.getElementById('character-details').innerHTML = `
            <p><strong>Nome:</strong> ${character.name}</p>
            <p><strong>Raça:</strong> ${character.race}</p>
            <p><strong>Level:</strong> ${character.level} (Proficiência: ${bonuses.proficiency >= 1 ? '+' : ''} ${bonuses.proficiency})</p>
            <p><strong>Classe:</strong> ${character.class}</p>
            <p><strong>Classe Armadura (CA):</strong> ${character.armorClass}</p>
            <p><strong>Iniciativa:</strong> +${parseInt(character.initiative) + bonuses.dexterity}</p>
            <p><strong>Pontos de Vitalidade (PV):</strong> ${character.hitPoints}</p>
            <h3 class="mt-4 mb-2"><strong>Atributos</strong></h3>
            <p><strong>Força:</strong> ${character.stats.strength} (Bônus: ${bonuses.strength >= 0 ? '+' : ''}${bonuses.strength})</p>
            <p><strong>Destreza:</strong> ${character.stats.dexterity} (Bônus: ${bonuses.dexterity >= 0 ? '+' : ''}${bonuses.dexterity})</p>
            <p><strong>Constituição:</strong> ${character.stats.constitution} (Bônus: ${bonuses.constitution >= 0 ? '+' : ''}${bonuses.constitution})</p>
            <p><strong>Inteligência:</strong> ${character.stats.intelligence} (Bônus: ${bonuses.intelligence >= 0 ? '+' : ''}${bonuses.intelligence})</p>
            <p><strong>Sabedoria:</strong> ${character.stats.wisdom} (Bônus: ${bonuses.wisdom >= 0 ? '+' : ''}${bonuses.wisdom})</p>
            <p><strong>Carisma:</strong> ${character.stats.charisma} (Bônus: ${bonuses.charisma >= 0 ? '+' : ''}${bonuses.charisma})</p>
            <h3 class="mt-4"><strong>Proficiências:</strong></h3>
            ${proficiencyList}
            <h3 class="mt-4"><strong>Informações:</strong></h3>
            <p><strong>Habilidades:</strong> ${character.abilities.replace(/\n/g, '<br>')}</p>
            <p><strong>Background:</strong> ${character.background.replace(/\n/g, '<br>')}</p>
            <p><strong>Características:</strong> ${character.traits.replace(/\n/g, '<br>')}</p>
        `;
    }
}
// Função para deletar o personagem específico
async function deleteCharacter() {
    try {
        const personagemDocRef = doc(db, "jogador", jogadorId, "personagem", personagemId);
        await deleteDoc(personagemDocRef);
        alert('Personagem excluído com sucesso!');
        displayCharacter();
    } catch (e) {
        console.error("Erro ao excluir personagem: ", e);
        alert('Erro ao excluir personagem.');
    }
}

// Funções auxiliares para cálculos
function calculateBonus(stat) {
    return Math.floor((stat - 10) / 2);
}

function calculateProficiencyBonus(baseBonus, isProficient, proficiencyBonus) {
    return baseBonus + (isProficient ? proficiencyBonus : 0) + (isProficient ? " ★" : "");
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

function validateForm() {
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

// Carregar e exibir o personagem quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    displayCharacter();
});

window.toggleSection = toggleSection;
window.validateForm = validateForm;