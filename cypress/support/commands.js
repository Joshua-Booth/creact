const API_LOGIN_PATH = "http://localhost:8000/auth/login/";

Cypress.Commands.add("login", (user) => {
  cy.clearLocalStorage();
  return cy
    .request({
      url: API_LOGIN_PATH,
      method: "POST",
      body: user,
    })
    .then((response) => {
      window.localStorage.setItem("token", response.body.key);
      return response.body;
    });
});

Cypress.Commands.add("mockLogin", () => {
  window.localStorage.setItem("token", "test-token");
});

Cypress.Commands.add("assertRoot", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertPath", (path) => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/${path}`);
});
