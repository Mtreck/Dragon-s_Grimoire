import {loadCharacterDataToModal} from './jogadorFicha.js'

export async function openModal(modalId) {
    if (modalId == 'character-modal'){
        await loadCharacterDataToModal();
    }
    document.getElementById(modalId).classList.add('show');
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = '';
}

window.openModal = openModal;
window.closeModal = closeModal;