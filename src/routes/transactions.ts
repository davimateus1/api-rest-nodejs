import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(server: FastifyInstance) {
  server.get('/hello', async () => {
    const transactions = await knex('transactions').select('*')

    return transactions
  })
}
