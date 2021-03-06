# GNAP JS Client _(gnap-client-js)_

> Authorization client for the [GNAP](https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol) (previously: [oauth.xyz](https://oauth.xyz/)) protocol for in-browser Javascript and Node.js

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

An authorization client, for both 
[public and confidential clients](https://tools.ietf.org/html/rfc6749#section-2.1),
for use with in-browser and server-side on Node.js. 

Draft IETF spec:

[Grant Negotiation and Authorization Protocol (GNAP)](https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol)

See blog posts:

* [Moving On from OAuth 2: A Proposal](https://medium.com/@justinsecurity/moving-on-from-oauth-2-629a00133ade)
* [Transaction Authorization or why we need to re-think OAuth scopes](https://medium.com/oauth-2/transaction-authorization-or-why-we-need-to-re-think-oauth-scopes-2326e2038948)

Other implementations:

* https://github.com/bspk/oauth.xyz-java

## Usage

Creating a client instance:

```js
const { GnapClient } = require('@interop/gnap-client')

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

const auth = new GnapClient({ store, clientDisplay, capabilities, ...defaults })
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

const { transaction, accessToken, interactionUrl } = txResponse

if (accessToken) { /* success! Although see sessionFromResponse() below */ }

// `transaction` holds the various handles and nonces, can be used for
// continuation requests 

if (interactionUrl) {
  /* send the user's browser to it */
  transaction.interactRedirectWindow({ interactionUrl }) // or,

  /* open a popup window and redirect it  */
  transaction.interactPopup({ interactionUrl }) // or,

  /* in Node / Express */
  res.redirect(interactionUrl) // assuming a `res` ServerResponse object
  // transaction is saved, will be accessible at the `callback.uri`
}
```

Parsing the `interact_handle` from front-end response, at the callback url.
This is low-level (to illustrate the protocol), app devs are expected to use
a helper method like `sessionFromResponse()` instead.

```js
// get `callbackUrl` from current url (browser) or request url (server)
// `transaction` is from the original transaction response

// this also validates the incoming `hash` value against saved nonces
const interactHandle = await transaction.parseFromUrl(callbackUrl)

const { accessToken } = await transaction.continueWith({ interactHandle })
```

High-level helper API (used at the callback url, instead of `parseFromUrl`
/ `continueWith`):

```js
const session = await auth.sessionFromResponse()

session.accessToken // validated `access_token`
session.fetch // wrapped whatwg `fetch()` that makes authenticated requests 
```

## Install

```bash
git clone https://github.com/interop-alliance/gnap-client-js.git
cd gnap-client-js
npm install
```

## Contribute

* Coding Style: [Standard.js](https://standardjs.com/)
* Docs: JSDoc
* Readme: [standard-readme](https://github.com/RichardLitt/standard-readme)

PRs accepted.

## License

[The MIT License](LICENSE.md) © Interop Alliance and Dmitri Zagidulin
