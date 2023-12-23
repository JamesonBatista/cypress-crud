/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    crud(options: {
      payload?: string | null;
      alias?: string | null;
    }): Chainable<Response>;

    bodyResponse(options: {
      path?: string | null;
      eq?: any | null;
    }): Chainable<Response>;

    save(
      options: {
        path?: string | null;
        alias?: string | null;
        log?: boolean;
      } = {}
    ): Chainable<any>;

    write(options: { path?: string | null; log?: boolean }): Chainable<any>;
    read(options: { path?: string | null; log?: boolean }): Chainable<any>;
    validateSchema(options: {
      schema?: string | null;
      log?: boolean;
    }): Chainable<any>;
  }
}
