# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0](https://github.com/Joshua-Booth/creact/compare/v2.0.1...v2.1.0) (2026-07-13)

### Features

* **app:** add shadcn typeset styling system ([c5cc5a0](https://github.com/Joshua-Booth/creact/commit/c5cc5a0dbaac261367e0d3c315f8e20e8e1e2a9a))
* **shared:** add shadcn chat interface components ([c8bce90](https://github.com/Joshua-Booth/creact/commit/c8bce907d65b1b555d0a335f459a61160dbfc131))
* **shared:** cache data-grid row measurements while hidden ([9e52fc0](https://github.com/Joshua-Booth/creact/commit/9e52fc068f1a0a3885a21fcde31159f294e71de7))
* **shared:** narrow useFeatureFlag return type via overloads ([f6f1d2f](https://github.com/Joshua-Booth/creact/commit/f6f1d2f6897647a147b2ba65e1aac7ce19903827))
* **shared:** set toggle-group default spacing to 2 ([75026d7](https://github.com/Joshua-Booth/creact/commit/75026d733d1a2e716ae1ab24da5052ddf651c299))
* **shared:** update UI components to latest shadcn ([#173](https://github.com/Joshua-Booth/creact/issues/173)) ([58d9e18](https://github.com/Joshua-Booth/creact/commit/58d9e189ec65a994e34f20103402a445cea2c7e5))
* **shared:** upgrade @base-ui/react to 1.5.0 ([9c2f114](https://github.com/Joshua-Booth/creact/commit/9c2f11452adcd771a29b6dedea8115cb39a0eb3e))
* **shared:** upgrade react-day-picker to 10.0 ([5005f71](https://github.com/Joshua-Booth/creact/commit/5005f718da4424e896583a72eb5be822592a427e))

### Bug Fixes

* **deps:** override transitive fast-uri to patch CVE ([aba6d4c](https://github.com/Joshua-Booth/creact/commit/aba6d4ce06bc8cc37fadafe0f585303012f93d92))
* **deps:** patch shell-quote critical and prune dormant overrides ([d40578c](https://github.com/Joshua-Booth/creact/commit/d40578c786dcd8ab46cbb1076d4b1c270f9f886b))

### Code Refactoring

* **app:** move ambient declarations to app layer ([3e74571](https://github.com/Joshua-Booth/creact/commit/3e74571d58f0d64305890bdecae5dda65a41cb5f))

### Documentation

* **release:** backfill CHANGELOG.md for v2.0.1 ([2460330](https://github.com/Joshua-Booth/creact/commit/24603302e1cb318721f8a41335fd5e50cd1861ff))
* **release:** point version badge at latest github release ([9a546e1](https://github.com/Joshua-Booth/creact/commit/9a546e1df187909dc2df41103e4f44d66e440ebf))

## [2.0.1](https://github.com/Joshua-Booth/creact/compare/v2.0.0...v2.0.1) (2026-05-02)


### Bug Fixes

* **deps:** align @types/node with Node.js runtime version ([#39](https://github.com/Joshua-Booth/creact/issues/39)) ([586f74c](https://github.com/Joshua-Booth/creact/commit/586f74c6e905b1a31a81e1438a75a418eabe481d))
* **deps:** auto-regenerate msw service worker on install ([#93](https://github.com/Joshua-Booth/creact/issues/93)) ([3c7cfb1](https://github.com/Joshua-Booth/creact/commit/3c7cfb103ccd06faa8224730e27e1c6b62cee231))
* **deps:** remove weekly lockfile maintenance ([#94](https://github.com/Joshua-Booth/creact/issues/94)) ([5f3e410](https://github.com/Joshua-Booth/creact/commit/5f3e4102314ce58fddf4e31b4cb008334e999033))
* **deps:** resolve Vite 8 compat and test warnings ([#65](https://github.com/Joshua-Booth/creact/issues/65)) ([8d5e0f8](https://github.com/Joshua-Booth/creact/commit/8d5e0f897e131de2e8a67161b53890ec5b3ccb45))
* **deps:** update @tanstack/react-virtual to ^3.13.19 ([#26](https://github.com/Joshua-Booth/creact/issues/26)) ([97de8db](https://github.com/Joshua-Booth/creact/commit/97de8dbbd53d9fc0506e15bfc5b30faf6e0bba55))
* **deps:** update @tanstack/react-virtual to ^3.13.21 ([#54](https://github.com/Joshua-Booth/creact/issues/54)) ([23cf6c8](https://github.com/Joshua-Booth/creact/commit/23cf6c818e841bc9949161770464515331c4486e))
* **deps:** update @tanstack/react-virtual to ^3.13.23 ([#80](https://github.com/Joshua-Booth/creact/issues/80)) ([c54f6bb](https://github.com/Joshua-Booth/creact/commit/c54f6bb7862eaa606547e8dc35c3f720c3d9eb26))
* **deps:** update @tanstack/react-virtual to ^3.13.24 ([#155](https://github.com/Joshua-Booth/creact/issues/155)) ([6943996](https://github.com/Joshua-Booth/creact/commit/6943996ed69fa6a661e84786bec5e27b8f8914ae))
* **deps:** update all non-major dependencies ([#100](https://github.com/Joshua-Booth/creact/issues/100)) ([2352104](https://github.com/Joshua-Booth/creact/commit/2352104fc80f0b87537816234c6f383cd88e850b))
* **deps:** update all non-major dependencies ([#106](https://github.com/Joshua-Booth/creact/issues/106)) ([1bf803b](https://github.com/Joshua-Booth/creact/commit/1bf803bf838d93fdc8838e380cbfdc8b5a94f77a))
* **deps:** update all non-major dependencies ([#119](https://github.com/Joshua-Booth/creact/issues/119)) ([b620fe4](https://github.com/Joshua-Booth/creact/commit/b620fe4c0ba26d4dc5ee73bba4ca5c8f50ecfd75))
* **deps:** update all non-major dependencies ([#34](https://github.com/Joshua-Booth/creact/issues/34)) ([f710aa4](https://github.com/Joshua-Booth/creact/commit/f710aa4704e1bdd75abd82db9f05f2f1cd9d9131))
* **deps:** update all non-major dependencies ([#41](https://github.com/Joshua-Booth/creact/issues/41)) ([a536752](https://github.com/Joshua-Booth/creact/commit/a5367524b3bdc14518c211955172a1df486b0a41))
* **deps:** update all non-major dependencies ([#50](https://github.com/Joshua-Booth/creact/issues/50)) ([2667e83](https://github.com/Joshua-Booth/creact/commit/2667e8300550541163548a22b94bcd57d4d6f35c))
* **deps:** update all non-major dependencies ([#81](https://github.com/Joshua-Booth/creact/issues/81)) ([a63d98c](https://github.com/Joshua-Booth/creact/commit/a63d98c6453e10d05caeef85e13df23f1dd432eb))
* **deps:** update es-toolkit to ^1.45.1 ([#58](https://github.com/Joshua-Booth/creact/issues/58)) ([7cd26de](https://github.com/Joshua-Booth/creact/commit/7cd26debcc9a87ec38e7eb55f9a23f4f9887b951))
* **deps:** update i18n ([#101](https://github.com/Joshua-Booth/creact/issues/101)) ([dd66617](https://github.com/Joshua-Booth/creact/commit/dd6661727aa68410d7a6f41152a6d0a25ba6e456))
* **deps:** update i18n ([#55](https://github.com/Joshua-Booth/creact/issues/55)) ([94fb97a](https://github.com/Joshua-Booth/creact/commit/94fb97a4fe698c369f801f13562f7e63db229f7f))
* **deps:** update i18next to ^25.10.10 ([#111](https://github.com/Joshua-Booth/creact/issues/111)) ([dc3fb4b](https://github.com/Joshua-Booth/creact/commit/dc3fb4b29f4d05c216116bb84ee7e68451f56261))
* **deps:** update i18next to ^25.8.19 ([#89](https://github.com/Joshua-Booth/creact/issues/89)) ([cd0fad2](https://github.com/Joshua-Booth/creact/commit/cd0fad226e0fe8ab24d801807172864af3a8febb))
* **deps:** update i18next to ^25.8.20 ([#91](https://github.com/Joshua-Booth/creact/issues/91)) ([450e6bf](https://github.com/Joshua-Booth/creact/commit/450e6bf63bcd922c0f7bae02cfe2fd6718b2682b))
* **deps:** update posthog ([#122](https://github.com/Joshua-Booth/creact/issues/122)) ([0be55c0](https://github.com/Joshua-Booth/creact/commit/0be55c0063e57e6db82580a38d5fd247c3837fdb))
* **deps:** update posthog ([#131](https://github.com/Joshua-Booth/creact/issues/131)) ([4571447](https://github.com/Joshua-Booth/creact/commit/4571447a958f300437aaa7e966c2d34f5465c6f5))
* **deps:** update posthog ([#33](https://github.com/Joshua-Booth/creact/issues/33)) ([96611bb](https://github.com/Joshua-Booth/creact/commit/96611bbe75c151edae0cb643124619fbc7b5bd19))
* **deps:** update posthog ([#51](https://github.com/Joshua-Booth/creact/issues/51)) ([d912dee](https://github.com/Joshua-Booth/creact/commit/d912dee91d74bbb1b8ec2c57a0f75c108e3849bf))
* **deps:** update posthog-js to ^1.353.1 ([#22](https://github.com/Joshua-Booth/creact/issues/22)) ([4d5a168](https://github.com/Joshua-Booth/creact/commit/4d5a1681cf5cdf9afe7fcef3ad987aede401862f))
* **deps:** update posthog-js to ^1.356.1 ([#42](https://github.com/Joshua-Booth/creact/issues/42)) ([2d47e5f](https://github.com/Joshua-Booth/creact/commit/2d47e5f77bd1b549c434ddd274206558555d2149))
* **deps:** update posthog-js to ^1.358.1 ([#59](https://github.com/Joshua-Booth/creact/issues/59)) ([0bd93e2](https://github.com/Joshua-Booth/creact/commit/0bd93e29c14e8e8c45d9cb78c0824a001063e585))
* **deps:** update posthog-js to ^1.359.0 ([#62](https://github.com/Joshua-Booth/creact/issues/62)) ([916b6de](https://github.com/Joshua-Booth/creact/commit/916b6de68bf307d70c5befac3fdf66f9d67590d4))
* **deps:** update posthog-js to ^1.362.0 ([#85](https://github.com/Joshua-Booth/creact/issues/85)) ([ae71c57](https://github.com/Joshua-Booth/creact/commit/ae71c5703bb17676d31446992016e6959ad450f5))
* **deps:** update posthog-js to ^1.363.5 ([#102](https://github.com/Joshua-Booth/creact/issues/102)) ([52eaeec](https://github.com/Joshua-Booth/creact/commit/52eaeecaedb57e818ea0b3dcc803d9bf51c76b41))
* **deps:** update posthog-js to ^1.363.6 ([#112](https://github.com/Joshua-Booth/creact/issues/112)) ([f96ea25](https://github.com/Joshua-Booth/creact/commit/f96ea25a3b10c173f8fbee57afda2a7e300be69d))
* **deps:** update posthog-js to ^1.364.4 ([#117](https://github.com/Joshua-Booth/creact/issues/117)) ([04e1caa](https://github.com/Joshua-Booth/creact/commit/04e1caa7feeea7c20ddfc71a2d41967dedf3bb49))
* **deps:** update posthog-js to ^1.364.6 ([#123](https://github.com/Joshua-Booth/creact/issues/123)) ([3f06999](https://github.com/Joshua-Booth/creact/commit/3f0699977567738d736ffaa48bfec1488ca52ca5))
* **deps:** update posthog-js to ^1.366.1 ([#138](https://github.com/Joshua-Booth/creact/issues/138)) ([86b6f8a](https://github.com/Joshua-Booth/creact/commit/86b6f8a6a05cc9a7e2426b7d677a9514388d0bad))
* **deps:** update posthog-js to ^1.367.0 ([#140](https://github.com/Joshua-Booth/creact/issues/140)) ([a6af6a1](https://github.com/Joshua-Booth/creact/commit/a6af6a12c529e79117475fdc2028badf88fc1c9c))
* **deps:** update posthog-js to ^1.369.1 ([#146](https://github.com/Joshua-Booth/creact/issues/146)) ([a058619](https://github.com/Joshua-Booth/creact/commit/a05861975566d1c6117c1d4b268d64068722929b))
* **deps:** update posthog-js to ^1.370.1 ([#156](https://github.com/Joshua-Booth/creact/issues/156)) ([83b10e6](https://github.com/Joshua-Booth/creact/commit/83b10e6a1f2d769dbf822970ea7179bc9dc133b6))
* **deps:** update posthog-js to ^1.371.1 ([#161](https://github.com/Joshua-Booth/creact/issues/161)) ([8e781c4](https://github.com/Joshua-Booth/creact/commit/8e781c4ecc0d6c23db072100fb238bd7d92c682e))
* **deps:** update posthog-js to ^1.371.2 ([#164](https://github.com/Joshua-Booth/creact/issues/164)) ([f7db378](https://github.com/Joshua-Booth/creact/commit/f7db37862d33ec4adf0a8c70199cc2bd586d8d72))
* **deps:** update react ecosystem to ^19.2.5 ([#134](https://github.com/Joshua-Booth/creact/issues/134)) ([c4180bd](https://github.com/Joshua-Booth/creact/commit/c4180bdbab2ff31ee4639c605966f275c8fc1ddf))
* **deps:** update react ecosystem to ^7.13.1 ([#28](https://github.com/Joshua-Booth/creact/issues/28)) ([0ab5449](https://github.com/Joshua-Booth/creact/commit/0ab54498ed9cfebf83556a8b96702372038a4e16))
* **deps:** update react ecosystem to ^7.13.2 ([#103](https://github.com/Joshua-Booth/creact/issues/103)) ([e73e62e](https://github.com/Joshua-Booth/creact/commit/e73e62e83d15ab62c1be9e6693224a71d968a60c))
* **deps:** update react ecosystem to ^7.14.0 ([#125](https://github.com/Joshua-Booth/creact/issues/125)) ([4668ef7](https://github.com/Joshua-Booth/creact/commit/4668ef7305d92153bc1fea671f36dc02497f0d48))
* **deps:** update react ecosystem to ^7.14.1 ([#144](https://github.com/Joshua-Booth/creact/issues/144)) ([29eb43c](https://github.com/Joshua-Booth/creact/commit/29eb43c63c22588a99dd784e23cf71ecee3e9c3c))
* **deps:** update react ecosystem to ^7.14.2 ([#157](https://github.com/Joshua-Booth/creact/issues/157)) ([6f2bbe1](https://github.com/Joshua-Booth/creact/commit/6f2bbe10ca2e981f20e972fdfc04563a8124b1c7))
* **deps:** update remix-i18next to ^7.5.0 ([#150](https://github.com/Joshua-Booth/creact/issues/150)) ([7c14440](https://github.com/Joshua-Booth/creact/commit/7c1444095dfaf7f836e2938a7957eaface6f4fae))
* **deps:** update sentry to ^10.40.0 ([#23](https://github.com/Joshua-Booth/creact/issues/23)) ([1100342](https://github.com/Joshua-Booth/creact/commit/1100342011d0570a3497a43b6230359af27d7bd7))
* **deps:** update sentry to ^10.42.0 ([#53](https://github.com/Joshua-Booth/creact/issues/53)) ([e33a4a9](https://github.com/Joshua-Booth/creact/commit/e33a4a912f9f4e6193c8e4cd7e0138cf51142fea))
* **deps:** update sentry to ^10.45.0 ([#84](https://github.com/Joshua-Booth/creact/issues/84)) ([2f5aed4](https://github.com/Joshua-Booth/creact/commit/2f5aed48e3ee9095ac7fb04b80c7dba2cb46daf3))
* **deps:** update sentry to ^10.46.0 ([#107](https://github.com/Joshua-Booth/creact/issues/107)) ([def4a05](https://github.com/Joshua-Booth/creact/commit/def4a05357f25bc7723dbdc9d78c18808d40e68d))
* **deps:** update sentry to ^10.47.0 ([#120](https://github.com/Joshua-Booth/creact/issues/120)) ([72ff0c2](https://github.com/Joshua-Booth/creact/commit/72ff0c258492ef3d7df7d87d50ac0593d6a206ab))
* **deps:** update sentry to ^10.48.0 ([#139](https://github.com/Joshua-Booth/creact/issues/139)) ([f2b6ee3](https://github.com/Joshua-Booth/creact/commit/f2b6ee3c9f6a25053bd5559d9c6c7dd34ada67c5))
* **deps:** update sentry to ^10.49.0 ([#151](https://github.com/Joshua-Booth/creact/issues/151)) ([1259426](https://github.com/Joshua-Booth/creact/commit/125942695d06606b01254fb4015d7d298241e772))
* **deps:** update sentry to ^10.50.0 ([#163](https://github.com/Joshua-Booth/creact/issues/163)) ([d3d4d89](https://github.com/Joshua-Booth/creact/commit/d3d4d89df7fe84d853a13061e497ea7b004d2533))
* **shared:** add `.trim()` to all `z.string()` schemas ([#37](https://github.com/Joshua-Booth/creact/issues/37)) ([a6de715](https://github.com/Joshua-Booth/creact/commit/a6de715dc29bd7dcbd2fcf5e2beb9dd8814d907c))


## [2.0.0](https://github.com/Joshua-Booth/creact/compare/v1.2.8...v2.0.0) (2026-02-23)


* feat(app)!: modernize tech stack ([#1](https://github.com/Joshua-Booth/creact/issues/1)) ([815d4ea](https://github.com/Joshua-Booth/creact/commit/815d4ea093a385c651cad445c6a90be369ac8dcf))


### BREAKING CHANGES

* upgrade to React 19,
React Router v7, Vite, Tailwind CSS v4,
and Feature-Sliced Design architecture

### [1.2.8](https://github.com/Joshua-Booth/creact/compare/v1.2.7...v1.2.8) (2021-08-21)


### Chores

* update dependencies ([81b51fc](https://github.com/Joshua-Booth/creact/commit/81b51fce3ad54b0a67d7593bb402eb38e0b5732b))

### [1.2.7](https://github.com/Joshua-Booth/creact/compare/v1.2.6...v1.2.7) (2021-08-09)


### Chores

* update dependencies ([6aac131](https://github.com/Joshua-Booth/creact/commit/6aac13160d58eab854d4b5c8af36d896452206a8))

### [1.2.6](https://github.com/Joshua-Booth/creact/compare/v1.2.5...v1.2.6) (2021-07-31)


### Code Refactoring

* separate Error buttons into components ([14422b3](https://github.com/Joshua-Booth/creact/commit/14422b33da7c8d104475999700ed3ac8cf661f70))


### Chores

* remove unused knowledge references ([e1d777c](https://github.com/Joshua-Booth/creact/commit/e1d777c409d0e1f6e666e52f34cc728776a4f62e))

### [1.2.5](https://github.com/Joshua-Booth/creact/compare/v1.2.4...v1.2.5) (2021-07-24)


### Bug Fixes

* remove duplicate title on 404 page ([2285b3f](https://github.com/Joshua-Booth/creact/commit/2285b3fbef4582be0a369b697fedb60cc0b36946))


### Chores

* update dependencies ([cb5fbeb](https://github.com/Joshua-Booth/creact/commit/cb5fbeb7f482f228e9258787ee1ac35007d2bd89))

### [1.2.4](https://github.com/Joshua-Booth/creact/compare/v1.2.3...v1.2.4) (2021-07-17)


### Bug Fixes

* remove PurgeCSS Webpack plugin ([f3a67a3](https://github.com/Joshua-Booth/creact/commit/f3a67a359d4ce80be80fc070b36bbc843cf7c029))


### Chores

* **deps:** update dependencies ([c10656e](https://github.com/Joshua-Booth/creact/commit/c10656eea3902b858752ab8070abf0b5a8698c6c))


### Continuous Integration

* **release:** add commit type rules ([c6b63f4](https://github.com/Joshua-Booth/creact/commit/c6b63f41dcd98c63bceb357430819ce9ed67811d))

### [1.2.3](https://github.com/Joshua-Booth/creact/compare/v1.2.2...v1.2.3) (2021-07-10)


### Bug Fixes

* unique key prop warning ([141c69e](https://github.com/Joshua-Booth/creact/commit/141c69ec5a28e4e1052d86b5277d633340930674))
* unstyled input error messages ([5f31dbf](https://github.com/Joshua-Booth/creact/commit/5f31dbfddf73bc17af1e71e8b4ee583b48f1bab4))


### Chores

* update dependencies ([cc0a53b](https://github.com/Joshua-Booth/creact/commit/cc0a53b8a3f30d09e905eae69882643d9e0de353))


### Documentation

* remove irrelevant docstring values ([bb0ca99](https://github.com/Joshua-Booth/creact/commit/bb0ca99139bb231a28e319e7335605bb88d1a973))


### Code Refactoring

* header component and styles ([9281d37](https://github.com/Joshua-Booth/creact/commit/9281d37342e8753b532111d432a6b5d39a4b7368))

### [1.2.2](https://github.com/Joshua-Booth/creact/compare/v1.2.1...v1.2.2) (2021-07-04)


### Bug Fixes

* footer link and styles ([f30be0e](https://github.com/Joshua-Booth/creact/commit/f30be0e9b64909c2bd97bc0d2bcd5ef9f4361443))


### Code Refactoring

* remove arbitrary tailwind classes ([c84ac48](https://github.com/Joshua-Booth/creact/commit/c84ac48fde377f673f4c50db399024d568864439))

### [1.2.1](https://github.com/Joshua-Booth/creact/compare/v1.2.0...v1.2.1) (2021-07-02)


### Code Refactoring

* separate SideNavigation into components ([b75f1f1](https://github.com/Joshua-Booth/creact/commit/b75f1f171147ba8786e731c5db7603784a264de0))


### Chores

* update dependencies ([ff41e06](https://github.com/Joshua-Booth/creact/commit/ff41e06ad0252cc82d15d807c666435c6cc45a03))

## [1.2.0](https://github.com/Joshua-Booth/creact/compare/v1.1.5...v1.2.0) (2021-06-29)


### Features

* add Copyright component ([55c7c12](https://github.com/Joshua-Booth/creact/commit/55c7c1215a1b9d76a89c95f759f358de92eea10d))
* add SocialLinks and TextLinks components ([e5fdfc4](https://github.com/Joshua-Booth/creact/commit/e5fdfc44ed859776b8056e47c0f5fd1970f04bda))

### [1.1.5](https://github.com/Joshua-Booth/creact/compare/v1.1.4...v1.1.5) (2021-06-26)


### Performance Improvements

* preconnect to Google font API ([a3434e2](https://github.com/Joshua-Booth/creact/commit/a3434e284fcf9bd5edf6770e10aa9ad65aa35932))


### Build System

* concurrently as dev dependency ([10854f8](https://github.com/Joshua-Booth/creact/commit/10854f828b2d39efc0b1a6b4cd6927d7420ab92b))


### Code Refactoring

* remove unnecessary dashboard render ([cc7c34b](https://github.com/Joshua-Booth/creact/commit/cc7c34b3d18b3832c4513a31f40271709dfc04d0))
* separate out and define each icon used ([a999220](https://github.com/Joshua-Booth/creact/commit/a999220dd973a0d0d1d5ff5feff7a46bdc6b830d))


### Chores

* update dependencies ([d3d66b9](https://github.com/Joshua-Booth/creact/commit/d3d66b97a7e75077d45ff2dbfd7253fc78827540))

### [1.1.4](https://github.com/Joshua-Booth/creact/compare/v1.1.3...v1.1.4) (2021-06-24)


### Continuous Integration

* **husky:** clean npm install on post-merge ([8654f14](https://github.com/Joshua-Booth/creact/commit/8654f14c5625fd37a698063d5f06c2bb21385eed))


### Chores

* update dependencies ([6e06acc](https://github.com/Joshua-Booth/creact/commit/6e06accf6dbf151a44eaf16cc2e4fa625923e848))

### [1.1.3](https://github.com/Joshua-Booth/creact/compare/v1.1.2...v1.1.3) (2021-06-23)


### Continuous Integration

* **release:** version bump package-lock ([b0e5a39](https://github.com/Joshua-Booth/creact/commit/b0e5a397865415e73252892f976bd1726bfbd7ef))

### [1.1.2](https://github.com/Joshua-Booth/creact/compare/v1.1.1...v1.1.2) (2021-06-23)


### Continuous Integration

* **release:** bump node version and add step ([4eaa420](https://github.com/Joshua-Booth/creact/commit/4eaa420bc1025ade15c63a6cf6e5fd8ed0c4df70))

### [1.1.1](https://github.com/Joshua-Booth/creact/compare/v1.1.0...v1.1.1) (2021-06-22)


### Continuous Integration

* **release:** git author and commit values ([d7e9a48](https://github.com/Joshua-Booth/creact/commit/d7e9a4893e6b7d4b4a322be59515d0e8a24def4f))


### Chores

* update dependencies ([aade74b](https://github.com/Joshua-Booth/creact/commit/aade74bf89c0f39b54407a6a9022a4289fc3deb3))

## [1.1.0](https://github.com/Joshua-Booth/creact/compare/v1.0.2...v1.1.0) (2021-06-21)


### Features

* tailwindcss ([b1bc8bd](https://github.com/Joshua-Booth/creact/commit/b1bc8bdaef3c2389b02d3e6e82aac24ba15118af))


### Chores

* update package-lock version ([cbc54ee](https://github.com/Joshua-Booth/creact/commit/cbc54ee4c8baa4d6676f4bccc6a4525c7c8a1c09))

### [1.0.2](https://github.com/Joshua-Booth/creact/compare/v1.0.1...v1.0.2) (2021-06-17)


### Documentation

* display chores in changelog ([1449768](https://github.com/Joshua-Booth/creact/commit/1449768d535c3745c401df4531a2e5288a8d29a3))

### [1.0.1](https://github.com/Joshua-Booth/creact/compare/v1.0.0...v1.0.1) (2021-06-16)


### Continuous Integration

* **fix:** prevent husky hooks running in CI ([28a6cbc](https://github.com/Joshua-Booth/creact/commit/28a6cbc9f64fdc1a25adf87cedf2fa727b63c3de))
* add separate prettier ignore file ([b322280](https://github.com/Joshua-Booth/creact/commit/b3222800f6d619dd71ab99fbf2b3ed87a8914358))

## 1.0.0 (2021-06-13)


### Bug Fixes

* footer content overflow on mobile devices ([cc28def](https://github.com/Joshua-Booth/creact/commit/cc28def2c32d1eab654f82ff6664476e70e71999))


### Code Refactoring

* move left and right helpers ([3021ce1](https://github.com/Joshua-Booth/creact/commit/3021ce1dfb0a1f42ebeeb882ab6ac70c8b2cd802))


### Styles

* fix import order and spacing ([26b149a](https://github.com/Joshua-Booth/creact/commit/26b149ad8ade8d46cd5afaa44c181f7b4b953437))


### Continuous Integration

* **release:** prevent husky hooks running in CI ([d702ff3](https://github.com/Joshua-Booth/creact/commit/d702ff31b09c8a13856af050606cac8180611d36))
* allow longer line lengths for commits ([68fe594](https://github.com/Joshua-Booth/creact/commit/68fe594cc548b9890fea916a6e73ce12f87d62c8))
* **release:** fix commit message ([73167c2](https://github.com/Joshua-Booth/creact/commit/73167c26c5bcfbc49a3d7fa37acf300a028ff003))
* **release:** separate and organise release steps ([5e0b585](https://github.com/Joshua-Booth/creact/commit/5e0b5855c7d983ea0a70001d47fa0a598ee60384))
