describe('Cadastro de Tarefas', () => {
  it('Deve adicionar uma nova tarefa', () => {
    cy.visit('http://localhost:3000');
    // Preencher a descrição e marcar como concluída
    cy.get('input[placeholder="Descrição"]').type('Estudar Cypress');
    cy.get('input[type="checkbox"]').check();
    // Adicionar a tarefa
    cy.get('button').contains('Adicionar Tarefa').click();
    // Verificar se a tarefa aparece na lista
    cy.contains('Estudar Cypress - Concluída').should('be.visible');
    // Verificar se a tarefa concluída tem a classe 'completed' e o estilo de cor correto
    cy.contains('Estudar Cypress - Concluída')
      .should('have.class', 'completed')
      .and('have.css', 'color', 'rgb(40, 167, 69)'); // Cor verde para tarefa concluída
  });

  it('Deve listar tarefas corretamente', () => {
    cy.visit('http://localhost:3000');
    cy.get('h3').contains('Lista de Tarefas').should('be.visible');
  });

  it('Deve aplicar estilos corretamente ao adicionar uma tarefa pendente', () => {
    cy.visit('http://localhost:3000');
    // Adicionando tarefa pendente
    cy.get('input[placeholder="Descrição"]').type('Tarefa Pendente');
    cy.get('button').contains('Adicionar Tarefa').click();
    // Verifica se a tarefa pendente possui a classe 'pending' e o estilo de cor correto
    cy.contains('Tarefa Pendente - Pendente')
      .should('have.class', 'pending')
      .and('have.css', 'color', 'rgb(220, 53, 69)'); // Cor vermelha para tarefa pendente
  });
});

describe('Editar Tarefas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Adiciona uma tarefa para garantir que o teste seja reproduzível
    cy.request('POST', 'http://localhost:3001/tarefas', {
      descricao: 'Tarefa Pendente',
      concluida: false,
    });
    cy.reload(); // Recarrega a página para exibir a tarefa
  });

  it('Deve editar uma tarefa existente', () => {
    // Clica no botão de editar para abrir os campos de edição
    cy.contains('Tarefa Pendente').parent().within(() => {
      cy.contains('Editar').click();
    });

    // Aguarda o campo de edição aparecer e insere um novo valor
    cy.get('#editardescriacao', { timeout: 10000 })
      .should('be.visible') // Garante que o campo está visível
      .clear() // Limpa o valor atual
      .type('Tarefa Editada com ID'); // Insere o novo valor

    // Marca o checkbox como concluída
    cy.get('input[type="checkbox"]').check();

    // Salva a tarefa editada
    cy.contains('Salvar').click();

    // Verifica se a tarefa foi editada corretamente
    cy.contains('Tarefa Editada com ID - Concluída').should('be.visible');
  });
});

describe('Excluir Tarefas', () => {
  beforeEach(() => {
    // Garante que a aplicação seja carregada antes de cada teste
    cy.visit('http://localhost:3000');
  });

  it('Deve excluir uma tarefa ao clicar no botão "Excluir"', () => {
    // Adiciona uma tarefa para garantir que o teste seja reproduzível
    cy.request('POST', 'http://localhost:3001/tarefas', {
      descricao: 'Tarefa para Excluir',
      concluida: false,
    });

    // Recarrega a página para ver a tarefa criada
    cy.reload();

    // Intercepta a requisição de exclusão
    cy.intercept('DELETE', '/tarefas/*').as('excluirTarefa');

    // Localiza a tarefa adicionada e clica no botão "Excluir"
    cy.contains('Tarefa para Excluir')
      .parent() // Encontra o elemento pai (li)
      .within(() => {
        cy.get('.delete-task').click(); // Clica no botão de exclusão
      });

    // Aguarda a requisição de exclusão ser concluída
    cy.wait('@excluirTarefa');

    // Verifica que a tarefa foi removida da lista
    cy.reload(); // Garante que o DOM está atualizado
    cy.contains('Tarefa para Excluir').should('not.exist');
  });
});

