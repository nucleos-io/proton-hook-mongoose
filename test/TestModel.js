const Model = require('proton-mongoose-model')

module.exports = class Test extends Model {
  schema() { return { name: String } }
}
