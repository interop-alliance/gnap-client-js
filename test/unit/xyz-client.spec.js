'use strict'

import { XyzClient } from '../../src'

import chai from 'chai'
import dirtyChai from 'dirty-chai'
chai.use(dirtyChai)
chai.should()
const { expect } = chai

describe('XyzClient', () => {
  describe('constructor', () => {
    it('should exist', () => {
      expect(new XyzClient()).to.exist()
    })
  })
})
