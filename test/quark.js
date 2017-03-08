const Quark = require('../')
const chai = require('chai')
const TestClass = require('./TestClass')
const expect = chai.expect


const stores = {
  mongo: {
    connection: { uri: 'mongodb://localhost:27017' },
    adapter: 'mongoose'
  }
}

const proton = {
  app: {
    config: { database: { stores, store: 'mongo' } }
  }
}

global.proton = proton

describe('Quark mongoose test',  () => {

  it('should initialize the test', done => {
    proton.app.models =  { TestClass: new TestClass(proton) }
    const quark = new Quark(proton)
    quark.initialize()
    done()
  })

  it('Test should exist', done => {
    expect(Test).to.not.be.undefined
    done()
  })

  it('Test find', done => {
    Test.find()
      .then(() => done())
      .catch(err => {
        console.log(err)
      })
  })


})
