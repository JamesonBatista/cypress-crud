/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    crud(options: {
      payload?: string | null;
      alias?: string | null;
    }): Chainable<Response>;

    /**
     * Custom command to validate JSON response.
     * @example cy.bodyResponse({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
     bodyResponse(...args: { path: string; eq: any, type: any, search: string, as: string }[]): Chainable<Element>;

    /**
     * Custom command to validate JSON response.
     * @example cy.response({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
     response(...args: { path: string; eq: any, type: any, search: string , as: string}[]): Chainable<Element>;

/**
     * Custom command to validate JSON response.
     * @example cy.res({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
     res(...args: { path: string; eq: any, type: any, search: string, as: string }[]): Chainable<Element>;

  /**
     * Custom command to validate JSON response.
     * @example cy.expects({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
   expects(...args: { path: string; eq: any, type: any, search: string, as: string }[]): Chainable<Element>;

    save(
      options: {
        path?: string | null;
        alias?: string | null;
        position?: number | null;
        eq?: any | null;
        log?: boolean;
        as?: string;
      } = {}
    ): Chainable<any>;

    crudScreenshot(type?: string | null): Chainable<any>;

    write(options: { path?: string | null; log?: boolean }): Chainable<any>;

    read(options: { path?: string | null; log?: boolean }): Chainable<any>;

    validateSchema(options: {
      schema?: string | null;
      log?: boolean;
    }): Chainable<any>;
  schema(options: {
      schema?: string | null;
      log?: boolean;
    }): Chainable<any>;
    findInJson<T = any>(
      obj: object,
      keyToFind: string,
      position?: number
    ): Chainable<T>;
  }
}
