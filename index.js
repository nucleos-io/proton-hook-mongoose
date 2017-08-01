'use strict'

const _ = require('lodash')
const Quark = require('proton-quark')
const uriBuilder = require('mongo-uri-builder')
const mongoose = require('mongoose')
const connectionOptions = { promiseLibrary: global.Promise }

class MongooseQuark extends Quark {

  constructor(proton) {
    super(proton)
    this.odm = 'mongoose'
  }

  initialize() {
    _.mapValues(this._mongooseStores, (store, name) => {
      const models = this._getModels(name)
      const uri = store.connection.uri || uriBuilder(store.connection)
      this._buildModels(models, uri)
    })
  }

  _buildModels(models, uri) {
    const connection = mongoose.createConnection(uri, connectionOptions)
    console.log('model func', connection.model);
    _.forEach(models, model => {
      const instance = model.build(connection)
      const name = model.name
      this.proton.app.models[name] = instance
      global[name] = instance
    })
  }

  _getModels(name) {
    const criteria = { store: name }
    return _.pickBy(this.proton.app.models, criteria)
  }

  get _mongooseStores() {
    const criteria = { adapter: this.odm }
    return _.pickBy(this.proton.app.config.database.stores, criteria)
  }
}

module.exports = MongooseQuark
