'use strict'

const mongoose = require('mongoose')
const _ = require('lodash')
const Quark = require('proton-quark')
const uriBuilder = require('mongo-uri-builder')

class MongooseQuark extends Quark {

  constructor(proton) {
    super(proton)
    this.odm = 'mongoose'
  }

  initialize() {
    _.mapValues(this.mongooseStores, (store, name) => {
      const models = this._getModels(name)
      const uri = uriBuilder(store.connection)
      this._buildModels(models, uri)
    })
  }

  get mongooseStores() {
    const criteria = {
      adapter: this.odm
    }
    return _.pickBy(this.proton.app.config.database.stores, criteria)
  }

  /**
   * @method buildModels
   * @description
   * @todo: validate the mongoose connection
   * @return
   */
  _buildModels(models, uri) {
    _.forEach(models, model => {
      mongoose.createConnection(uri)
      const instanceModel = model.build(mongoose)
      model.expose(instanceModel)
      //this._addModelToApp(model, instanceModel)
    })
  }

  _addModelToApp(model, instance) {
    this.proton.app.models[model.name] = instance
  }

  _getModels(name) {
    let criteria = {
      store: name
    }
    return _.pickBy(this.proton.app.models, criteria)
  }

}

module.exports = MongooseQuark
