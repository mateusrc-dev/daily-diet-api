import { test, beforeAll, afterAll, describe, expect } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import crypto from 'node:crypto'

describe('Routes app', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('the user can create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        id: crypto.randomUUID(),
        name: 'Mateus Raimundo',
        email: 'mateus@email.com',
        password: '123456',
      })
      .expect(201)
  })

  test('the user can create a new snack', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Mateus Raimundo',
      email: 'mateus@email.com',
      password: '123456',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'arroz com calabresa',
        description: 'calabresa é muito bom',
        dietIsOk: true,
      })
      .expect(201)
  })

  test('the user can list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Mateus Raimundo',
      email: 'mateus@email.com',
      password: '123456',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'arroz com calabresa',
      description: 'calabresa é muito bom',
      dietIsOk: true,
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'arroz com calabresa',
        description: 'calabresa é muito bom',
        dietIsOk: 1,
      }),
    ])
  })
})
