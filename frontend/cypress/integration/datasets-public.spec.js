/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.createDataset("raw");

    cy.server();
    cy.route("PUT", "/api/v3/Datasets/**/*").as("change");
    cy.route("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Make dataset public", () => {
    it("should go to dataset details and toggle public", () => {
      cy.visit("/datasets");

      cy.wait("@fetch");

      cy.wait(5000);

      cy.contains(".mat-row", "Cypress Dataset")
        .click();

      cy.wait("@fetch");

      cy.get(".mat-slide-toggle-label")
        .contains("Public")
        .as("publicToggle");

      cy.get("mat-slide-toggle").should("not.have.class", "mat-checked");

      cy.get("@publicToggle").click();

      cy.wait("@change").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.get("mat-slide-toggle").should("have.class", "mat-checked");
    });
  });
});
