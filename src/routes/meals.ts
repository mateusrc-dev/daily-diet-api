import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'
import { checkUserIdExist } from '../middlewares/check-user-id-exist'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkUserIdExist] }, async (request) => {
    const { userId } = request.cookies
    const meals = await knex('meals').where('user_id', userId).select()

    return {
      meals,
    }
  })

  app.get('/:id', { preHandler: [checkUserIdExist] }, async (request) => {
    const getSnackParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getSnackParamSchema.parse(request.params)

    const { userId } = request.cookies

    const snack = await knex('meals').where({ id, user_id: userId }).first()

    return {
      snack,
    }
  })

  app.get('/summary', { preHandler: [checkUserIdExist] }, async (request) => {
    const { userId } = request.cookies
    const getRegisterMealsCount = await knex('meals')
      .where('user_id', userId)
      .select() // vamos ter que acrescentar aqui um where com o id do usuário no cookie
    const countMeals = getRegisterMealsCount.length
    const getDietTrue = await knex('meals').where({
      dietIsOk: 1,
      user_id: userId,
    })
    const mealsDietTrueCount = getDietTrue.length
    const getDietFalse = await knex('meals').where({
      dietIsOk: 0,
      user_id: userId,
    })
    const mealsDietFalseCount = getDietFalse.length

    let countSequence = 0
    const arraySequences: number[] = []

    for (let i = 0; i < getRegisterMealsCount.length; i++) {
      if (getRegisterMealsCount[i].dietIsOk === 1) {
        countSequence = countSequence + 1
      } else {
        arraySequences.push(countSequence)
        countSequence = 0
      }
    }

    return {
      countMeals,
      mealsDietTrueCount,
      mealsDietFalseCount,
      maxNumberSequence: Math.max(...arraySequences),
    }
  })

  app.post('/', { preHandler: [checkUserIdExist] }, async (request, reply) => {
    const { userId } = request.cookies

    const createSnackSchema = z.object({
      name: z.string(),
      description: z.string(),
      dietIsOk: z.boolean(),
    })

    const { name, description, dietIsOk } = createSnackSchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      dietIsOk: dietIsOk === true ? 1 : 0,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    { preHandler: [checkUserIdExist] },
    async (request, reply) => {
      const updateSnackSchema = z.object({
        name: z.string(),
        description: z.string(),
        dietIsOk: z.boolean(),
      })

      const updateSnackParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateSnackParamSchema.parse(request.params)

      const { name, description, dietIsOk } = updateSnackSchema.parse(
        request.body,
      )

      await knex('meals')
        .update({
          name,
          description,
          dietIsOk: dietIsOk === true ? 1 : 0,
        })
        .where('id', id)

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkUserIdExist] },
    async (request, reply) => {
      const updateSnackParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateSnackParamSchema.parse(request.params)

      await knex('meals').where('id', id).delete()

      return reply.status(201).send()
    },
  )
}
