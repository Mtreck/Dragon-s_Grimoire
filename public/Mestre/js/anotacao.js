import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../../../bd.js';


const conteinerAnotacao = document.getElementById('conteiner_anotacao');
const btn = document.getElementById('add-anotacao');



function anotar () {
    const divAnotacao = document.createElement('div');
    const anotacao = document.getElementById('anotacao').value;
    
    if(anotacao !== '' ){
    const novaAnotacao = document.createElement('h2');
    novaAnotacao.textContent = anotacao;

    const btnExcluirNota = document.createElement('button')
    btnExcluirNota.classList.add('btn-anotacao')
    btnExcluirNota.textContent = 'Exluir';


    const btnEditarNota = document.createElement('button')
    btnEditarNota.classList.add('btn-anotacao')
    btnEditarNota.textContent = 'Editar';

    const btnAddNota = document.createElement('button')
    btnAddNota.classList.add('btn-anotacao')
    btnAddNota.textContent = 'Adicionar anotação';

    divAnotacao.appendChild(novaAnotacao);
    divAnotacao.appendChild(btnExcluirNota);
    divAnotacao.appendChild(btnEditarNota);
    divAnotacao.appendChild(btnAddNota);
    conteinerAnotacao.appendChild(divAnotacao);
        
    document.getElementById('anotacao').value = '';

    btnExcluirNota.addEventListener('click', function() {
        exluir(divAnotacao);
    });
    btnAddNota.addEventListener('click', function() {
        adicionar(divAnotacao);
    });
    } else{
        alert('Nota Vazia')
    }

    

}

btn.addEventListener('click', anotar)


function exluir(divAnotacao){
    
    divAnotacao.remove();
    

}


function adicionar(divAnotacao) {
    const modal = document.createElement('div');
    modal.classList.add('modal-add');

    const tituloAnotacao = document.createElement('h2');
    tituloAnotacao.innerText = 'Nova Anotação'


    const inputAdd = document.createElement('input');
    
    modal.style.display = 'block';

    const fechar = document.createElement('button');
    fechar.textContent = 'Fechar';
    
    const salvar = document.createElement('button');
    salvar.textContent = 'Salvar';
    modal.appendChild(tituloAnotacao)
    modal.appendChild(inputAdd);
    modal.appendChild(fechar);
    modal.appendChild(salvar);
    conteinerAnotacao.appendChild(modal);

    fechar.addEventListener('click', () => {
        modal.remove();
    });

    salvar.addEventListener('click', () => {
        const paragrafoAnotacao = document.createElement('p');
        const novaAnotacao = inputAdd.value;
        paragrafoAnotacao.textContent = novaAnotacao;
        divAnotacao.appendChild(paragrafoAnotacao);

        const bntAnotacaoExcluir = document.createElement('button');
        bntAnotacaoExcluir.classList.add('btn-anotacao-excluir');
        bntAnotacaoExcluir.textContent = 'Excluir';
        
        const bntAnotacaoEditar = document.createElement('button');
        bntAnotacaoEditar.classList.add('btn-anotacao-editar');
        bntAnotacaoEditar.textContent = 'Editar';

        paragrafoAnotacao.appendChild(bntAnotacaoExcluir);
        paragrafoAnotacao.appendChild(bntAnotacaoEditar);

        modal.remove();

        // Excluir anotação
        bntAnotacaoExcluir.addEventListener('click', () => {
            paragrafoAnotacao.remove();
        });

        // Editar anotação
        bntAnotacaoEditar.addEventListener('click', () => {
            const modalEditar = document.createElement('div');
            modalEditar.classList.add('modal-add');

            const AlterarAnotacao = document.createElement('h2');
            AlterarAnotacao.innerText = 'Alterando a Nota'
            
            const inputEdit = document.createElement('input');
            inputEdit.value = novaAnotacao;  // Pré-preenche com o valor atual

            modalEditar.style.display = 'block';

            const fecharEditar = document.createElement('button');
            fecharEditar.textContent = 'Fechar';

            const salvarEditar = document.createElement('button');
            salvarEditar.textContent = 'Salvar';

            modalEditar.appendChild(AlterarAnotacao)
            modalEditar.appendChild(inputEdit);
            modalEditar.appendChild(fecharEditar);
            modalEditar.appendChild(salvarEditar);
            conteinerAnotacao.appendChild(modalEditar);

            fecharEditar.addEventListener('click', () => {
                modalEditar.remove();
            });

            salvarEditar.addEventListener('click', () => {
                paragrafoAnotacao.textContent = inputEdit.value; // Atualiza o texto da anotação

                // Reaplica os botões após editar
                paragrafoAnotacao.appendChild(bntAnotacaoExcluir);
                paragrafoAnotacao.appendChild(bntAnotacaoEditar);

                modalEditar.remove();
            });
        });
    });
}

