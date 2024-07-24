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
    bodyResponse(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;

    /**
     * Custom command to validate JSON response.
     * @example cy.response({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
    response(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;

    /**
     * Custom command to validate JSON response.
     * @example cy.res({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
    res(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;
    /**
     * Custom command to validate JSON response.
     * @example cy.expects({ path: "type", eq: "express" }, { path: "age", eq: 30 })
     */
    expects(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;
    expect(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;
    assert(
      ...args: {
        path: string;
        eq: any;
        type: any;
        search: string;
        as: string;
        property: string;
        key: string;
      }[]
    ): Chainable<Element>;

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
      schemas?: string | null;
      log?: boolean;
    }): Chainable<any>;
    schema(options: { schemas?: string | null; log?: boolean }): Chainable<any>;
    findInJson<T = any>(
      obj: object,
      keyToFind: string,
      position?: number
    ): Chainable<T>;

    /**
     * Custom command to decode a JWT and extract its payload.
     * @param token The JWT token string.
     * @example cy.crudSafeData('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIxMjM0NTY3ODkwIiwicGFzc3dvcmQiOiJKb2huIERvZSJ9.d7gibg6eK9oxrpcCob-MuNz65NHMWNK1x4otVLyHPCo')
     */
    crudSafeData(token: string): Chainable<string>;
       /**
     * Runs fixtures from a specified path or all fixtures if no path is specified.
     * @param path - Optional path to the fixtures folder.
     * @example
     * cy.runFixtures('users')
     */
    runFixtures(path?: string): Chainable<FixtureItem[]>;
  }
}
