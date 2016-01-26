'use strict'

let mongoose = require('mongoose')
let _ = require('lodash')
let Hook = require('proton-hook')
let uriBuilder = require('mongo-uri-builder')

module.exports = class MongooseHook extends Hook {

  constructor(proton) {
    super(proton)
  }

  configure() {
    this.proton.app.config.database.orm = 'mongoose'
  }

  initialize() {
    _.forEach(this.stores, store => this._buildModels(store.models, store.mongoose))
  }

  get stores() {
    let stores = this.proton.app.config.database.stores
    return _.mapValues(stores, (store, name) => {
      return {
        mongoose: mongoose.connect(uriBuilder(store.connection)),
        models: this._getModels(name)
      }
    })
  }

  _buildModels(models, mongoose) {
    _.forEach(models, model => model.build(mongoose))
  }

  _getModels(name) {
    let criteria = {
      store: name
    }
    return _.pickBy(this.proton.app.models, criteria)
  }

}
