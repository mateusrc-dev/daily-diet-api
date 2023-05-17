import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createSnackSchema = z.object({
      name: z.string(),
      description: z.string(),
      dietIsOk: z.boolean(),
      userId: z.string().uuid(),
    })

    const { name, description, dietIsOk, userId } = createSnackSchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      dietIsOk,
      user_id: userId, // depois substituir esse dado pelo id do user no cookie para não precisar enviar ele manualmente pela requisição
    })

    return reply.status(201).send()
  })
}
