import { db, doc, getDoc, deleteDoc, setDoc } from '../../bd.js';

const jogadorId = localStorage.getItem('jogadorId');
const personagemId = localStorage.getItem('personagemId'); 

let characterData = {};

export async function loadCharacterData() {
    try {
        const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
        const personagemSnapshot = await getDoc(personagemDocRef);
        
        if (personagemSnapshot.exists()) {
            characterData = personagemSnapshot.data();
            //console.log('Dados do personagem carregados:', characterData);
            displayCharacter();
        } else {
            console.log('Nenhum personagem encontrado.');
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do personagem:', error);
    }
}

document.getElementById('save-character').onclick = async function (event) {
    event.preventDefault();
    if (validateForm()) {
        characterData = {
            name: document.getElementById('name-modal').value,
            race: document.getElementById('race-modal').value,
            antecedent: document.getElementById('antecedent-modal').value,
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
            const personagemDocRef = doc(db, 'jogador', jogadorId, 'personagem', personagemId);
            await setDoc(personagemDocRef, characterData);
            alert('Personagem salvo com sucesso.');
        } catch (error) {
            console.error('Erro ao salvar personagem:', error);
        }
        closeModal('character-modal');
        displayCharacter();
    }
};

document.getElementById('cancel-character').onclick = function (event) {
    event.preventDefault();
    closeModal('character-modal');
};

export function loadCharacterDataToModal() {
    if (characterData && characterData.stats && characterData.proficiencies) {
        document.getElementById('name-modal').value = characterData.name;
        document.getElementById('race-modal').value = characterData.race;
        document.getElementById('antecedent-modal').value = characterData.antecedent || null;
        document.getElementById('class-modal').value = characterData.class;
        document.getElementById('level-modal').value = characterData.level;
        document.getElementById('armor-class-modal').value = characterData.armorClass;
        document.getElementById('initiative-modal').value = characterData.initiative;
        document.getElementById('hit-points-modal').value = characterData.hitPoints;
        document.getElementById('strength-modal').value = characterData.stats.strength;
        document.getElementById('dexterity-modal').value = characterData.stats.dexterity;
        document.getElementById('constitution-modal').value = characterData.stats.constitution;
        document.getElementById('intelligence-modal').value = characterData.stats.intelligence;
        document.getElementById('wisdom-modal').value = characterData.stats.wisdom;
        document.getElementById('charisma-modal').value = characterData.stats.charisma;
        document.getElementById('abilities-modal').value = characterData.abilities;
        document.getElementById('background-modal').value = characterData.background;
        document.getElementById('traits-modal').value = characterData.traits;
        document.getElementById('acrobatics-proficiency').checked = characterData.proficiencies.acrobatics;
        document.getElementById('animal-handling-proficiency').checked = characterData.proficiencies.animalHandling;
        document.getElementById('arcana-proficiency').checked = characterData.proficiencies.arcana;
        document.getElementById('athletics-proficiency').checked = characterData.proficiencies.athletics;
        document.getElementById('deception-proficiency').checked = characterData.proficiencies.deception;
        document.getElementById('history-proficiency').checked = characterData.proficiencies.history;
        document.getElementById('insight-proficiency').checked = characterData.proficiencies.insight;
        document.getElementById('intimidation-proficiency').checked = characterData.proficiencies.intimidation;
        document.getElementById('investigation-proficiency').checked = characterData.proficiencies.investigation;
        document.getElementById('medicine-proficiency').checked = characterData.proficiencies.medicine;
        document.getElementById('nature-proficiency').checked = characterData.proficiencies.nature;
        document.getElementById('perception-proficiency').checked = characterData.proficiencies.perception;
        document.getElementById('performance-proficiency').checked = characterData.proficiencies.performance;
        document.getElementById('persuasion-proficiency').checked = characterData.proficiencies.persuasion;
        document.getElementById('religion-proficiency').checked = characterData.proficiencies.religion;
        document.getElementById('sleight-of-hand-proficiency').checked = characterData.proficiencies.sleightOfHand;
        document.getElementById('stealth-proficiency').checked = characterData.proficiencies.stealth;
        document.getElementById('survival-proficiency').checked = characterData.proficiencies.survival;

    } else {
        console.log("Ainda não foram atribuidos dados ao personagem para serem mostrados.");

    }
}

function displayCharacter() {
    if (!characterData || !characterData.stats || !characterData.proficiencies) {
        console.log("Ainda não foram atribuídos dados ao personagem para serem mostrados.");
        return; 
    }

    const bonuses = {
        strength: calculateBonus(characterData.stats.strength),
        dexterity: calculateBonus(characterData.stats.dexterity),
        constitution: calculateBonus(characterData.stats.constitution),
        intelligence: calculateBonus(characterData.stats.intelligence),
        wisdom: calculateBonus(characterData.stats.wisdom),
        charisma: calculateBonus(characterData.stats.charisma),
        proficiency: calculeteProficiency(characterData.level)
    };

    const proficiencyList = `
        <div class="inner-section">
        <h2  class="mt-4"><strong>Proficiências</strong></h2>
        <button class="btn-min-max" onclick="toggleSection('section-proficiency')">-</button>
        </div>

        <div id="section-proficiency">
        <h4><strong>Força:</strong></h4>
        <p><strong>Atletismo (For):</strong> ${calculateProficiencyBonus(bonuses.strength, characterData.proficiencies.athletics, bonuses.proficiency)}</p>
        
        <h4><strong>Destreza:</strong></h4>
        <p><strong>Acrobacia (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, characterData.proficiencies.acrobatics, bonuses.proficiency)}</p>
        <p><strong>Prestidigitação (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, characterData.proficiencies.sleightOfHand, bonuses.proficiency)}</p>
        <p><strong>Furtividade (Des):</strong> ${calculateProficiencyBonus(bonuses.dexterity, characterData.proficiencies.stealth, bonuses.proficiency)}</p>

        <h4><strong>Inteligência:</strong></h4>
        <p><strong>Arcanismo (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, characterData.proficiencies.arcana, bonuses.proficiency)}</p>
        <p><strong>História (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, characterData.proficiencies.history, bonuses.proficiency)}</p>
        <p><strong>Investigação (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, characterData.proficiencies.investigation, bonuses.proficiency)}</p>
        <p><strong>Natureza (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, characterData.proficiencies.nature, bonuses.proficiency)}</p>
        <p><strong>Religião (Int):</strong> ${calculateProficiencyBonus(bonuses.intelligence, characterData.proficiencies.religion, bonuses.proficiency)}</p>
        
        <h4><strong>Sabedoria:</strong></h5>
        <p><strong>Adestrar Animais (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, characterData.proficiencies.animalHandling, bonuses.proficiency)}</p>
        <p><strong>Intuição (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, characterData.proficiencies.insight, bonuses.proficiency)}</p>
        <p><strong>Medicina (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, characterData.proficiencies.medicine, bonuses.proficiency)}</p>
        <p><strong>Percepção (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, characterData.proficiencies.perception, bonuses.proficiency)}</p>
        <p><strong>Sobrevivência (Sab):</strong> ${calculateProficiencyBonus(bonuses.wisdom, characterData.proficiencies.survival, bonuses.proficiency)}</p>

        <h4><strong>Carisma:</strong></h4>
        <p><strong>Enganação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, characterData.proficiencies.deception, bonuses.proficiency)}</p>
        <p><strong>Intimidação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, characterData.proficiencies.intimidation, bonuses.proficiency)}</p>
        <p><strong>Atuação (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, characterData.proficiencies.performance, bonuses.proficiency)}</p>  
        <p><strong>Persuasão (Car):</strong> ${calculateProficiencyBonus(bonuses.charisma, characterData.proficiencies.persuasion, bonuses.proficiency)}</p>        
        </div>
    `;

    document.getElementById('character-details').innerHTML = `
        <h2><strong>Detalhes do Personagem</strong></h2>
        <p><strong>Nome:</strong> ${characterData.name}</p>
        <p><strong>Raça:</strong> ${characterData.race}</p>
        <p><strong>Antecedente:</strong> ${characterData.antecedent}</p>
        <p><strong>Level:</strong> ${characterData.level} (Proficiência: ${bonuses.proficiency >= 1 ? '+' : ''} ${bonuses.proficiency})</p>
        <p><strong>Classe:</strong> ${characterData.class}</p>
        <p><strong>Classe Armadura (CA):</strong> ${characterData.armorClass}</p>
        <p><strong>Iniciativa:</strong> +${parseInt(characterData.initiative) + bonuses.dexterity}</p>
        <p><strong>Pontos de Vitalidade (PV):</strong> ${characterData.hitPoints}</p>
        <h2 class="mt-4 mb-2"><strong>Atributos</strong></h2>
        <p><strong>Força:</strong> ${characterData.stats.strength} (Bônus: ${bonuses.strength >= 0 ? '+' : ''}${bonuses.strength})</p>
        <p><strong>Destreza:</strong> ${characterData.stats.dexterity} (Bônus: ${bonuses.dexterity >= 0 ? '+' : ''}${bonuses.dexterity})</p>
        <p><strong>Constituição:</strong> ${characterData.stats.constitution} (Bônus: ${bonuses.constitution >= 0 ? '+' : ''}${bonuses.constitution})</p>
        <p><strong>Inteligência:</strong> ${characterData.stats.intelligence} (Bônus: ${bonuses.intelligence >= 0 ? '+' : ''}${bonuses.intelligence})</p>
        <p><strong>Sabedoria:</strong> ${characterData.stats.wisdom} (Bônus: ${bonuses.wisdom >= 0 ? '+' : ''}${bonuses.wisdom})</p>
        <p><strong>Carisma:</strong> ${characterData.stats.charisma} (Bônus: ${bonuses.charisma >= 0 ? '+' : ''}${bonuses.charisma})</p>
        ${proficiencyList}
        <div class="inner-section" >
        <h2 class="mt-4"><strong>Informações</strong></h2>
        <button class="btn-min-max" onclick="toggleSection('section-info')">+</button>
        </div>
        <div id="section-info">
        <p style="display: none;"><strong>Habilidades:</strong> ${characterData.abilities.replace(/\n/g, '<br>')}</p>
        <p style="display: none;"><strong>Background:</strong> ${characterData.background.replace(/\n/g, '<br>')}</p>
        <p style="display: none;"><strong>Características:</strong> ${characterData.traits.replace(/\n/g, '<br>')}</p>
        </div>
    `;

}

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
    if (!section) return;
    const contents = section.querySelectorAll('div, form, ul, li, p, h4');
    const button = document.querySelector(`button[onclick="toggleSection('${sectionId}')"]`);

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

document.addEventListener('DOMContentLoaded', loadCharacterData);

window.toggleSection = toggleSection;
window.validateForm = validateForm;