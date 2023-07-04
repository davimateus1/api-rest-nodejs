import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

export async function transactionsRoutes(server: FastifyInstance) {
  server.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  server.get('/:id', async (request) => {
    const createTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = createTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  server.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  server.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: SEVEN_DAYS,
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
