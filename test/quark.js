const Model = require('proton-mongoose-model')

const Quark = require('../')
const chai = require('chai')
const expect = chai.expect



class User extends Model {
  schema() {
    return { name: String }
  }
}

const proton = {
  app: {
    models: { User: new User({}) },
    config: { database: { stores: 'mongoose' } }
  }
}

global.proton = proton

describe('Quark mongoose test',  () => {

  it('should initialize the test', done => {
    const quark = new Quark(proton)
    quark.initialize()
    done()
  })

  it('User should exist', done => {
    expect(User).to.not.be.undefined
    done()
  })


})
