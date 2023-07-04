import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(transactionsRoutes)

server
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server is running!'))
