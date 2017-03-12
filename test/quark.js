const Quark = require('../')
const chai = require('chai')
const TestModel = require('./TestModel')
const Proton = require('proton-koa')
const expect = chai.expect

global.proton = new Proton()

describe('Quark mongoose test',  () => {

  before(() => {
    const connection = { uri: 'mongodb://localhost:27017' }
    const adapter = 'mongoose'
    proton.app = {
      models: { 'Test': new TestModel(proton) },
      config: {
        database: {
          stores: { mongo: { connection, adapter } },
          store: 'mongo' // the default DB storage
        }
      }
    }
  })

  it('Should instantiate the quark', done => {
    const quark = new Quark(proton)
    quark.initialize().then(done)
    proton.emit('quark:proton-quark-models:init')
  })

  it('Should use with no errors the Test model', done => {
    Test.find().then(() => done())
  })

})
