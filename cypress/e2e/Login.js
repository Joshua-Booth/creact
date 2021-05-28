const USER_EMAIL = Cypress.env("USER_EMAIL");
const USER_PASSWORD = Cypress.env("USER_PASSWORD");

const API_URL_PATH = "/auth/login";

context("Login", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("requires email", () => {
    cy.get("form").contains("Login").click();
    cy.contains(/your email is required/i).should("exist");
  });

  it("requires password", () => {
    cy.findByTestId(/email/i).type(USER_EMAIL + "{enter}");
    cy.contains(/your password is required/i).should("exist");
  });

  it("fails on bad login", () => {
    cy.intercept("POST", API_URL_PATH, {
      statusCode: 400,
      body: {},
    });

    cy.findByTestId(/email/i).type("test@mail.com");
    cy.findByTestId(/password/i).type("password");
    cy.findByTestId(/login/i).click();
    cy.contains(/email or password is incorrect/i).should("exist");
  });

  it("user can login", () => {
    cy.intercept("POST", API_URL_PATH, {
      statusCode: 200,
      body: {},
    });
    cy.findByTestId(/email/i).type(USER_EMAIL);
    cy.findByTestId(/password/i).type(USER_PASSWORD);
    cy.findByTestId(/login/i).click().assertPath("dashboard");
  });
});
