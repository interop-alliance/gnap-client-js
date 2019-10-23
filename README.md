# OAuth.xyz JS Client _(oauth-xyz-client-js)_

> Authentication client for the [oauth.xyz](https://oauth.xyz/) protocol for in-browser Javascript and Node.js

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Usage](#usage)
- [Install](#install)
- [Contribute](#contribute)
- [License](#license)

## Security

TBD

## Background

Draft IETF spec:

[Transactional Authorization](https://tools.ietf.org/id/draft-richer-transactional-authz-00.html)

See blog posts:

* [Moving On from OAuth 2: A Proposal](https://medium.com/@justinsecurity/moving-on-from-oauth-2-629a00133ade)
* [Transaction Authorization or why we need to re-think OAuth scopes](https://medium.com/oauth-2/transaction-authorization-or-why-we-need-to-re-think-oauth-scopes-2326e2038948)

Other implementations:

* https://github.com/bspk/oauth.xyz-java

## Usage

Creating a client instance:

```js
const { XyzClient } = require('oauth-xyz-client')

const store = {} // TODO: Store for persisting `nonce`s, request handles, etc

const clientDisplay = {
  name: 'My RP Application',
  uri: 'https://app.example.com',
  logo_uri: 'https://app.example.com/logo.png'
}

const capabilities = ['jwsd']

const key = {
  proof: 'jwsd',
  jwks: { keys: [/* ... */] }
}

// If you pass into the constructor params that would normally go into 
// `createRequest`, they're stored as defaults that will be auto-included
// in requests.
const defaults = {
  user: { /* .. */ },
  key,
  interact
}

const auth = new XyzClient({ store, clientDisplay, capabilities, ...defaults })
```

Create and send a request (low-level API):

```js
const interact = {
  redirect: true, // default
  callback: {
    uri: 'https://app.example.com/callback/1234',
    nonce: 'LKLTI25DK82FX4T4QFZC'
  }
}
const resources = {
  actions: [/* ... */],
  locations: [/* ... */],
  datatype: [/* ... */]
}

const request = auth.createRequest({ resources, interact, key })

// Proposed/experimental
const { endpoint } = await auth.discover({ server: 'https://as.example.com' })

// Send the request to the transaction endpoint
const txResponse = await auth.post({ endpoint, request })

const {
  transaction,
  access_token: accessToken,
  interaction_url: interactionUrl } = txResponse

if (accessToken) { /* party */ }

if (interactionUrl) { /* redirect user to it */ }

// `transaction` holds the various handles and nonces, can be used for
// continuation requests 
```

## Install

```bash
git clone https://github.com/interop-alliance/oauth-xyz-client-js.git
cd oauth-xyz-client-js
npm install
```

## Contribute

* Coding Style: [Standard.js](https://standardjs.com/)
* Docs: JSDoc
* Readme: [standard-readme](https://github.com/RichardLitt/standard-readme)

PRs accepted.

## License

[The MIT License](LICENSE.md) © Interop Alliance and Dmitri Zagidulin
