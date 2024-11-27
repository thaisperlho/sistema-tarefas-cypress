describe('Cadastro de Tarefas', () => {
  it('Deve adicionar uma nova tarefa', () => {
    cy.visit('http://localhost:3000');

    // Preencher a descrição e marcar como concluída
    cy.get('input[placeholder="Descrição"]').type('Estudar Cypress');
    cy.get('input[type="checkbox"]').check();

    // Captura de tela do formulário preenchido
    cy.screenshot('formulario-preenchido');

    // Adicionar a tarefa
    cy.get('button').contains('Adicionar Tarefa').click();

    // Captura de tela após adicionar a tarefa
    cy.screenshot('tarefa-adicionada');

    // Verificar se a tarefa aparece na lista
    cy.contains('Estudar Cypress - Concluída').should('be.visible');
  });

  it('Deve listar tarefas corretamente', () => {
    cy.visit('http://localhost:3000');
    cy.get('h3').contains('Lista de Tarefas').should('be.visible');

    // Captura de tela da lista de tarefas
    cy.screenshot('lista-de-tarefas');
  });

  it('Deve aplicar estilos corretamente ao adicionar uma tarefa pendente', () => {
    cy.visit('http://localhost:3000');

    // Adicionando tarefa pendente
    cy.get('input[placeholder="Descrição"]').type('Tarefa Pendente');
    cy.get('button').contains('Adicionar Tarefa').click();

    // Captura de tela após adicionar a tarefa pendente
    cy.screenshot('tarefa-pendente-adicionada');

    // Verifica se a tarefa pendente possui a classe 'pending' e o estilo de cor correto
    cy.contains('Tarefa Pendente - Pendente')
      .should('have.class', 'pending')
      .and('have.css', 'color', 'rgb(220, 53, 69)');
  });
});

describe('Editar Tarefas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.request('POST', 'http://localhost:3001/tarefas', {
      descricao: 'Tarefa Pendente',
      concluida: false,
    });
    cy.reload();
  });

  it('Deve editar uma tarefa existente', () => {
    // Clica no botão de editar
    cy.contains('Tarefa Pendente').parent().within(() => {
      cy.contains('Editar').click();
    });

    // Captura de tela do modo de edição aberto
    cy.screenshot('edicao-aberta');

    // Edita o campo e marca como concluída
    cy.get('#editardescriacao').clear().type('Tarefa Editada com ID');
    cy.get('input[type="checkbox"]').check();

    // Captura de tela com os campos preenchidos
    cy.screenshot('edicao-preenchida');

    // Salva a tarefa editada
    cy.contains('Salvar').click();

    // Captura de tela após salvar
    cy.screenshot('tarefa-editada');

    // Verifica se a tarefa foi editada corretamente
    cy.contains('Tarefa Editada com ID - Concluída').should('be.visible');
  });
});

describe('Excluir Tarefas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Deve excluir uma tarefa ao clicar no botão "Excluir"', () => {
    cy.request('POST', 'http://localhost:3001/tarefas', {
      descricao: 'Tarefa para Excluir',
      concluida: false,
    });
    cy.reload();

    // Captura de tela da lista antes da exclusão
    cy.screenshot('lista-antes-exclusao');

    // Intercepta a requisição de exclusão
    cy.intercept('DELETE', '/tarefas/*').as('excluirTarefa');

    // Clica no botão "Excluir"
    cy.contains('Tarefa para Excluir').parent().within(() => {
      cy.get('.delete-task').click();
    });

    // Captura de tela após clicar em excluir
    cy.screenshot('tarefa-excluida');

    // Aguarda a requisição ser concluída
    cy.wait('@excluirTarefa');

    // Verifica que a tarefa foi removida
    cy.contains('Tarefa para Excluir').should('not.exist');
  });
});
