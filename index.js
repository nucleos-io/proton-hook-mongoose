'use strict'

const _ = require('lodash')
const Quark = require('proton-quark')
const uriBuilder = require('mongo-uri-builder')

class MongooseQuark extends Quark {

  constructor(proton) {
    super(proton)
    this.odm = 'mongoose'
  }

  initialize() {
    return new Promise(resolve => {
      this.after('quark:proton-quark-models:init', () => {
        _.mapValues(this._mongooseStores, (store, name) => {
          const models = this._getModels(name)
          const uri = store.connection.uri || uriBuilder(store.connection)
          this._buildModels(models, uri)
        })
        resolve()
      })
    })
  }


  _buildModels(models, uri) {
    const mongoose = require('mongoose')
    mongoose.connect(uri, { promiseLibrary: global.Promise })
    _.forEach(models, model => {
      const instance = model.build(mongoose)
      this.proton.app.models[model.name] = instance
      global[model.name] = this.proton.app.models[model.name]
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
