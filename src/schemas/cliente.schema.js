const { personaSchema } = require('./persona.schema');

const ClienteSchema = [
  ...personaSchema
];

module.exports = {
  ClienteSchema
};