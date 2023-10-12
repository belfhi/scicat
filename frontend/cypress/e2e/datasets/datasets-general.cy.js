/// <reference types="Cypress" />

describe("Datasets general", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Create dataset", () => {
    it("should be able to create dataset in the UI", () => {
      const newName = "Test created dataset name";
      const newDescription = "Test created dataset description";
      const usedSoftware = "Test software";

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-card.add-card").contains("Create Dataset").click();

      cy.get('input[formcontrolname="datasetName"]').clear().type(newName);
      cy.get('textarea[formcontrolname="description"]')
        .clear()
        .type(newDescription);
      cy.get('mat-select[formcontrolname="ownerGroup"]').click();
      cy.get('[role="listbox"] mat-option').first().click();
      cy.get('input[formcontrolname="usedSoftware"]')
        .clear()
        .type(usedSoftware);

      cy.get('button[color="primary"]').contains("Save").click();

      cy.finishedLoading();

      cy.get('[data-cy="edit-general-information"]').should("exist");
    });
  });

  describe("Show dataset table after logout and login", () => {
    it("should be able to see datasets after visiting details page logout and login again", () => {
      const username = Cypress.config("username");
      const password = Cypress.config("password");

      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.get(".user-button").should("contain.text", username).click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.url().should("include", "/login");

      cy.get('mat-tab-group [role="tab"]').contains("Local").click();

      cy.get("#usernameInput").type(username).should("have.value", username);
      cy.get("#passwordInput").type(password).should("have.value", password);

      cy.get("button[type=submit]").click();

      cy.url().should("include", "/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();
    });
  });

  describe("Proposal connection and link from dataset details", () => {
    it("should be able to see and click proposal connection link from dataset details page", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);
      cy.createDataset("raw", proposalId);

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.contains("A minimal test proposal").click();

      cy.url().should("include", "/proposals");

      cy.contains("A minimal test proposal");

      cy.deleteProposal(proposalId);
    });
  });
});
