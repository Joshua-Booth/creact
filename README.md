<div align="center" style="text-align:center">
  <a href="https://creact.netlify.app/">
    <img
      alt="creact Logo"
      src="./src/assets/images/README.svg"
    />
  </a>

  <h2 style="padding-top:0;margin-top:20px">creact</h2>
  <h4 style="padding-top:20px">A project template for creating awesome React web apps.</h4>

  <br />

[**Visit demo**](https://creact.netlify.app/) ·
[**Documentation**][wiki]

  <br />

  <p>
    <a href="https://app.netlify.com/sites/creact/deploys">
      <img
        alt="Netlify Build Status"
        src="https://img.shields.io/netlify/4b639571-edc3-4fd5-ab63-61f0959fd921?label=build&style=for-the-badge"
      />
    </a>
    <img 
      alt="GitHub package.json version" 
      src="https://img.shields.io/github/package-json/v/Joshua-Booth/creact?style=for-the-badge"
    />
    <img 
      alt="Dependencies"
      src="https://img.shields.io/david/Joshua-Booth/creact?style=for-the-badge"
    />
    <img 
      alt="GitHub last commit" 
      src="https://img.shields.io/github/last-commit/Joshua-Booth/creact?label=Last%20Update&style=for-the-badge"
    />
  </p>

  <br />

<sub>Developed by <a href="https://joshuabooth.nz">Joshua Booth</a></sub>

  <br />

  <hr />
  <p>
    <a href="#about">About</a> |
    <a href="#requirements">Features</a> |
    <a href="#requirements">Requirements</a> |
    <a href="#installation">Installation</a> |
    <a href="#installation">Setup</a> |
    <a href="#installation">Usage</a> |
    <a href="#support">Support</a> |
    <a href="#license">License</a>
  </p>
  <hr />
</div>

## About

<p style="padding-bottom: 20px">
creact is a React JS project template for quickly setting up advanced production web apps.
Setting up a complex app from scratch takes ages, so this template aims to have 
as many realistic project features and integrations as possible. However, with the focus on
being modular - you should be able to remove parts if they aren't a good fit for your project.

Take a look at the <a href="#features">features</a> to see what's included. And
if there's something that you think should be added, feel free to create a
[feature request](https://github.com/Joshua-Booth/creact/issues/new).

For more information about this project check out the [wiki].

</p>

[wiki]: https://github.com/Joshua-Booth/creact/wiki/Home/

## Features

- :scissors: **Customisable** - Only use the parts that you need for your project
- :file_folder: **Data management** - Manage state with [Redux] and handle API data with [redux-thunk] and [axios]
- :iphone: **Responsive design** - Uses [Tailwind CSS] with [Sass] and custom media query mixins
- :arrow_right_hook: **Git hooks** - Starter hooks with [Husky]
- :bookmark: **Versioning** - Automated SemVer versioning, changelogs and releases with [semantic-release]
- :memo: **Documentation** - Internal docs with JSDoc and a [clean-jsdoc-theme] site
- :shirt: **Linting** - [ESlint], [Prettier], [stylelint], and [commitlint]
- :white_check_mark: **Testing** - Config and starter tests for unit, integration and end-to-end testing
- :chart_with_upwards_trend: **Coverage reports** - [Jest] and [Cypress] test coverage results either combined or separate
- :package: **Third party apps/tools** - [Algolia], [Google Analytics], [Hotjar] and [Intercom] built in

[redux]: https://redux.js.org/
[redux-thunk]: https://github.com/reduxjs/redux-thunk
[axios]: https://axios-http.com/
[tailwind css]: https://tailwindcss.com/
[sass]: https://sass-lang.com/
[husky]: https://github.com/typicode/husky
[semantic-release]: https://github.com/semantic-release/semantic-release
[clean-jsdoc-theme]: https://github.com/ankitskvmdam/clean-jsdoc-theme
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[stylelint]: https://stylelint.io/
[commitlint]: https://commitlint.js.org/#/
[jest]: https://jestjs.io/
[cypress]: https://www.cypress.io/
[algolia]: https://www.algolia.com/
[google analytics]: https://analytics.google.com/analytics/web/
[hotjar]: https://www.hotjar.com/
[intercom]: https://www.intercom.com/

## Requirements

This project requires the following:

- [Git](https://git-scm.com/downloads)
- [Node.js 14.16+](https://nodejs.org/en/download/)
- [npm 7.0.0+](https://nodejs.org/en/download/)

### Other useful global dependencies

- [git-cz](https://www.npmjs.com/package/git-cz)
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [prettier](https://www.npmjs.com/package/prettier)

## Installation

```sh
> git clone https://github.com/Joshua-Booth/creact.git   # Clone the repository

> cd creact     # Change into the 'creact' directory

> npm install   # Install all the project's dependencies
```

**Ensure the `NODE_ENV` environment variable is either undefined or set to `'development'` before installing dependencies.**

## Setup

Create three env files (.prod, .dev, .test) in an `env` directory in [config](/config).

```sh
> mkdir ./config/env
> cd ./config/env

> touch .prod .dev .test   # Windows: cd > .prod && cd > .dev && cd > .test
```

Add the following environment variables for development (.dev) and production (.prod):

| Variable name                      | Required | Description                                                                                            |
| ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `NODE_VERSION`                     | False    | This app's Node version (should be equal or greater than `14.16`)                                      |
| `REACT_APP_ROOT_URL`               | True     | Your API's URL (e.g. `localhost:8000` for dev and `https://api.example.com/` for prod)                 |
| `REACT_APP_PUBLIC_URL`             | True     | This app's public URL (e.g. `localhost:8080/public` for dev and `https://example.com/public` for prod) |
| `REACT_APP_ALGOLIA_APP_ID`         | False    | [Algolia app id]                                                                                       |
| `REACT_APP_ALGOLIA_SEARCH_KEY`     | False    | [Algolia search key]                                                                                   |
| `REACT_APP_GA_TRACKING_ID`         | False    | Google Analytics tracking id (e.g. `UA-123456789-1`)                                                   |
| `REACT_APP_HOTJAR_SNIPPET_VERSION` | False    | Hotjar snippet version (Also called 'hjsv')                                                            |
| `REACT_APP_HOTJAR_TRACKING_ID`     | False    | Hotjar tracking id (Also called 'hjid')                                                                |
| `REACT_APP_INTERCOM_APP_ID`        | False    | [Intercom app id]                                                                                      |
| `REACT_APP_SENTRY_DSN`             | False    | [Sentry DSN]                                                                                           |

[algolia app id]: https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id
[algolia search key]: https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
[intercom app id]: https://www.intercom.com/help/en/articles/3539-where-can-i-find-my-workspace-id-app-id
[sentry dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/

## Usage

To use the application use the following commands:

### Production

Run `npm run build` to build the static files for production.

Run `npm start prod` to serve the production files.

:sparkles: Visit the site on the localhost URL.

### Development

Run `npm start dev` to start the webpack dev server for the web app.

:sparkles: Visit the site on the localhost URL.

### Testing

```sh
> npm t                # Unit tests

> npm start test.it    # Integration tests

> npm start test.e2e   # End-to-end tests

> npm start coverage   # Full test coverage report (unit, integration and e2e combined)
```

`npm t` starts the unit tests in watch mode, but you can also set the environment variable `CI`
to run the tests in continuous integration mode (this also works for integration and end-to-end tests).

### Other

Run `npm start help` for a full list of available commands.

## Support

Do you need some help? Check the out articles in the [wiki].

Check the [issues](https://github.com/Joshua-Booth/creact/issues) page to see if there is an open issue with a potential workaround.

### Additional Support

Reach out to me for support through the following methods:

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- Website: [joshuabooth.nz/contact](https://joshuabooth.nz/contact)

## License

This project is the sole property of Joshua Booth.

Copyright &copy; 2021 Joshua Booth

Please see individual licenses contained in the project where third-party
code was used, as this code is owned by it's respective authors.
