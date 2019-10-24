'use strict'

const DEFAULT_CLIENT = {
  name: 'My RP Application',
  uri: 'https://app.example.com',
  logo_uri: 'https://app.example.com/logo.png'
}

const DEFAULT_CAPABILITIES = ['httpsig']

export class XyzClient {
  /**
   * @param store
   * @param clientDisplay
   * @param capabilities
   * @param user
   * @param key
   * @param interact
   */
  constructor ({ store, clientDisplay, capabilities, user, key, interact } = {}) {
    this.store = store
    this.clientDisplay = clientDisplay || DEFAULT_CLIENT
    this.capabilities = capabilities || DEFAULT_CAPABILITIES
    this.user = user
    this.key = key
    this.interact = interact
  }

  /**
   * @param resources
   * @param interact
   * @param key
   * @param user
   *
   * @returns {TxRequest}
   */
  createRequest ({ resources, interact = this.interact, key = this.key, user = this.user }) {
    const request = new TxRequest({
      clientDisplay: this.clientDisplay,
      capabilities: this.capabilities,
      resources,
      interact,
      key,
      user
    })
  }

  /**
   * @param server {string}
   * @returns {Promise<void>}
   */
  async discover ({ server }) {
    throw new Error('discover() is not implemented.')
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

    return { transaction: {}, accessToken: '', interactionUrl: '' }
  }
}

export class TxRequest {
  constructor ({ clientDisplay, resources, interact, key, user, capabilities }) {
    this.clientDisplay = clientDisplay
    this.resources = resources
    this.interact = interact
    this.key = key
    this.user = user
    this.capabilities = capabilities
  }
}
