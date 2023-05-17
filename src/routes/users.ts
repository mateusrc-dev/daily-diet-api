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

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password,
    })

    return reply.status(201).send()
  })
}
