import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email({ message: 'Digite um email válido!' }),
      password: z.coerce
        .string()
        .length(6, { message: 'A senha tem que ter pelo menos 6 caracteres!' }),
    })

    const { name, email, password } = createUserSchema.parse(request.body)

    const userId = crypto.randomUUID()

    await knex('users').insert({
      id: userId,
      name,
      email,
      password,
    })

    return reply
      .cookie('userId', userId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(201)
      .send()
  })
}
