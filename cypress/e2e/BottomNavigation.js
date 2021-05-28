context("BottomNavigation", () => {
  it("can display", () => {
    cy.visit("/").viewport("iphone-x");

    cy.get(".bottom-nav").should("exist");
  });
});
