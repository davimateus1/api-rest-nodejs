import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const server = fastify()

server.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de Teste',
      amount: 1000,
    })
    .returning('*')

  return transaction
})

server
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is running!'))
