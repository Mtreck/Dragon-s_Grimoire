import { db, collection, addDoc, getDocs, deleteDoc, doc } from '/bd.js';


document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemDamage = document.getElementById('item-damage').value;
    const itemDamageType = document.getElementById('damage-type').value;
    const itemAc = parseInt(document.getElementById('item-ac').value, 10);
    const itemPo = parseInt(document.getElementById('item-po').value, 10);
    const itemQuality = document.getElementById('item-quality').value;
    const itemType = document.getElementById('item-type').value;
    const itemOrigin = document.getElementById('Origem').value;

    const newItem = {
        Nome: itemName,
        Descrição: itemDescription,
        Dano: itemDamage,
        Tipo_de_Dano: itemDamageType,
        Ac: itemAc,
        Po: itemPo,
        Qualidade: itemQuality,
        Tipo: itemType,
        Origem: itemOrigin
    };

    try {
        await addDoc(collection(db, 'items'), newItem);
        alert('Item adicionado com sucesso!');
        // Limpar o formulário após o envio
        document.getElementById('item-form').reset();
    } catch (e) {
        console.error('Erro ao adicionar documento: ', e);
        alert('Erro ao adicionar item. Tente novamente.');
    }
});