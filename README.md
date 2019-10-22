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

```js
const { XyzClient } = require('oauth-xyz-client')

const display = {
  name: 'My RP Application',
  uri: 'https://app.example.com',
  logo_uri: 'https://app.example.com/logo.png'
}

const capabilities = ['jwsd']

// const user = { ... } // optional

// Note: `key` can be passed in either in client constructor, or with request
const key = {
  proof: 'jwsd',
  jwks: { keys: [/* ... */] }
}

const auth = new XyzClient({ display, capabilities, user })

const server = 'https://as.example.com' // Authorization Server

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

const response = await auth.request({ server, resources, interact, key })
```

## Install

```bash
git clone https://github.com/interop-alliance/oauth-xyz-client-js.git
cd oauth-xyz-client-js
npm install
```

## Contribute

PRs accepted.

Note: If editing the README, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[The MIT License](LICENSE.md) © Interop Alliance and Dmitri Zagidulin
