context("Landing", () => {
  it("contains title", () => {
    cy.visit("/");

    cy.contains(/react frontend/i).should("exist");
  });
});
