'use strict'

import axios from 'axios' // todo: consider 'apisauce' instead
import httpsig from 'http-signature-header'

const DEFAULT_CLIENT = {
  name: 'My RP Application',
  uri: 'https://app.example.com',
  logo_uri: 'https://app.example.com/logo.png'
}

const DEFAULT_CAPABILITIES = ['httpsig', 'dpop']

export class XyzClient {
  /**
   * @param store - Store for handles, nonces
   * @param [clientDisplay]
   * @param [capabilities]
   * @param [user]
   * @param [key]
   * @param [interact]
   * @param [httpsAgent] {https.Agent} Optional override
   */
  constructor ({ store = {}, clientDisplay, capabilities, user, key, interact, httpsAgent } = {}) {
    this.store = store
    this.clientDisplay = clientDisplay || DEFAULT_CLIENT
    this.capabilities = capabilities || DEFAULT_CAPABILITIES
    this.user = user
    this.key = key
    this.interact = interact || { redirect: true }
    this.httpsAgent = httpsAgent
  }

  /**
   * @param resources {Array<string>|object}
   * @param interact
   * @param key
   * @param user
   *
   * @returns {TxRequest}
   */
  createRequest ({ resources, interact = this.interact, key = this.key, user = this.user }) {
    if (interact.redirect && !interact.callback) {
      throw new Error('`callback` param is required for redirect interactions.')
    }

    if (interact.redirect && !interact.callback.nonce) {
      interact.callback.nonce = this.generateNonce()
    }

    return new TxRequest({
      clientDisplay: this.clientDisplay,
      capabilities: this.capabilities,
      resources,
      interact,
      key,
      user
    })
  }

  generateNonce () {
    return 'LKLTI25DK82FX4T4QFZC'
  }

  /**
   * Returns transaction endpoint URL.
   * @param server {string}
   * @returns {Promise<string>}
   */
  async discover ({ server }) {
    // TODO: actually implement
    // const discoverUrl = new URL('/.well-known/xyz', server)
    // const { data: { transaction_endpoint: endpoint } } = await get(discoverUrl.toString())
    // return endpoint
    return server + '/transaction'
  }

  /**
   * @param server
   * @param endpoint
   * @param request
   * @returns {Promise<{accessToken: string, transaction: {}, interactionUrl: string}>}
   */
  async post ({ server, endpoint, request }) {
    if (!server && !endpoint) {
      throw new Error('Either endpoint or server param is required.')
    }

    if (!endpoint) {
      endpoint = await this.discover({ server })
    }

    const headers = this.headersFor({ request })
    const { httpsAgent } = this

    const { data: response } = await axios.post(endpoint, request,
      { headers, httpsAgent })

    const {
      access_token: accessToken,
      interaction_url: interactionUrl
    } = response

    return {
      transaction: Transaction.from({ response, clientNonce: request.clientNonce }),
      accessToken,
      interactionUrl
    }
  }

  headersFor ({ request }) {
    // const { createSignatureString, createAuthzHeader } = httpsig
    return {
      // content-type automatically set by axios
      // 'Detached-JWS': '...'
      // http signature headers go here
    }
  }
}

export class Transaction {
  constructor ({ handles, clientNonce, serverNonce } = {}) {
    this.handles = handles || {
      // handle (tx handle)
      // display_handle
      // interact_handle
      // user_handle
      // resource_handle
      // key_handle
    }
    this.clientNonce = clientNonce
    this.serverNonce = serverNonce
  }

  static from ({ response, clientNonce }) {
    const { server_nonce: serverNonce, handle } = response
    const handles = { txHandle: handle }
    return new Transaction({ handles, clientNonce, serverNonce })
  }
}

export class TxRequest {
  constructor ({ clientDisplay, resources, interact, key, user, capabilities }) {
    this.display = clientDisplay
    this.resources = resources
    this.interact = interact
    this.key = key
    this.user = user
    this.capabilities = capabilities
  }

  get clientNonce () {
    return this.interact.redirect && this.interact.callback.nonce
  }
}
