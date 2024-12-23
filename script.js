const API_URL = 'http://localhost:3000/api/animals';

// Função para cadastrar um novo animal
async function cadastrarAnimal(event) {
    event.preventDefault();

    // Obter dados do formulário
    const numero = document.getElementById('numero').value;
    const raca = document.getElementById('raca').value;
    const data = document.getElementById('data').value;
    const sexo = document.getElementById('sexo').value;

    const animal = { numero, raca, data, sexo };

    try {
        // Enviar dados para o servidor
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animal)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar o animal.');
        }

        alert('Animal cadastrado com sucesso!');
        document.getElementById('animalForm').reset();
        buscarAnimais(); // Atualiza a tabela após o cadastro
    } catch (error) {
        console.error(error);
        alert('Erro ao cadastrar o animal. Verifique os dados e tente novamente.');
    }
}

// Função para buscar todos os animais do back-end
async function buscarAnimais() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar os animais.');
        }

        const animais = await response.json();
        atualizarTabela(animais);
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar os animais.');
    }
}

// Função para excluir um animal
async function excluirAnimal(id) {
    if (!confirm('Tem certeza de que deseja excluir este animal?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir o animal.');
        }

        alert('Animal excluído com sucesso!');
        buscarAnimais(); // Atualiza a tabela após a exclusão
    } catch (error) {
        console.error(error);
        alert('Erro ao excluir o animal.');
    }
}


// Função para buscar animais com filtros
async function buscarAnimaisComFiltros(event) {
    event.preventDefault();

    // Coleta os valores dos filtros
    const numero = document.getElementById('filterNumero').value;
    const raca = document.getElementById('filterRaca').value;
    const data = document.getElementById('filterData').value;
    const sexo = document.getElementById('filterSexo').value;

    // Monta os parâmetros da URL
    const params = new URLSearchParams();
    if (numero) params.append('numero', numero);
    if (raca) params.append('raca', raca);
    if (data) params.append('data', data);
    if (sexo) params.append('sexo', sexo);

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os animais.');
        }

        const animais = await response.json();
        atualizarTabela(animais);
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar os animais.');
    }
}
// Função para atualizar a tabela com os animais
function atualizarTabela(animais) {
    const tableBody = document.getElementById('animalTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpa a tabela

    if (animais.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Nenhum animal encontrado.</td></tr>';
        return;
    }

    animais.forEach(animal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${animal.numero}</td>
            <td>${animal.raca}</td>
            <td>${animal.data}</td>
            <td>${animal.sexo}</td>
            <td>
                <button onclick="excluirAnimal(${animal.id})" class="btn-excluir">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Adicionar evento ao formulário de filtros
document.getElementById('filterForm').addEventListener('submit', buscarAnimaisComFiltros);

// Buscar todos os animais ao carregar a página
document.addEventListener('DOMContentLoaded', buscarAnimais);
