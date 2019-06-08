import { UserInputError } from 'apollo-server-micro'

const knex = require('knex')({
  client: 'pg',
  version: '10.6',
  connection: {
    host: process.env.DATABASE_URL,
    database: process.env.DATABASE_NAME,
    user: 'service_tool',
    password: process.env.TOOL_DATABASE_PASSWORD
  },
  searchPath: 'sc_tool'
})

const isValidUUID = uuid =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  )

export default {
  Query: {
    hello: () => 'toolkit service says hello',
    toolkits: async () => await knex('toolkit').select(),
    toolkit: async (root, { id }) => {
      if (!isValidUUID(id)) throw new UserInputError('INVALID_UUID')
      const kit = (await knex('toolkit').where({ id }))[0]
      if (!kit) throw new UserInputError('DOES_NOT_EXIST')
      return kit
    }
  },

  Toolkit: {
    canvas: ({ canvas }) => JSON.stringify(canvas)
  }
}