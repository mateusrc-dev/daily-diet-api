import { test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import crypto from 'node:crypto'
import { execSync } from 'node:child_process'

describe('Routes app', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  test('the user can get a sneck specific', async () => {
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

    const snackId = listMealsResponse.body.meals[0].id

    const getSnackResponse = await request(app.server)
      .get(`/meals/${snackId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getSnackResponse.body.snack).toEqual(
      expect.objectContaining({
        name: 'arroz com calabresa',
        description: 'calabresa é muito bom',
        dietIsOk: 1,
      }),
    )
  })

  test('the user can show a summary of your meals', async () => {
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

    const summaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body).toEqual(
      expect.objectContaining({
        totalAmountOfMeals: 1,
        totalAmountOfMealsTrueDiet: 1,
        totalAmountOfMealsFalseDiet: 0,
        highestSequenceOfDietsPerformed: 0,
      }),
    )
  })

  test('the user can edit a snack specific', async () => {
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

    const snackId = listMealsResponse.body.meals[0].id

    const snackEdit = await request(app.server)
      .put(`/meals/${snackId}`)
      .set('Cookie', cookies)
      .send({
        name: 'arroz com calabresa e nissin com ovo',
        description: 'calabresa e nissin é muito bom',
        dietIsOk: false,
      })
      .expect(201)

    expect(snackEdit.body.snackUpdate[0]).toEqual(
      expect.objectContaining({
        name: 'arroz com calabresa e nissin com ovo',
        description: 'calabresa e nissin é muito bom',
        dietIsOk: 0,
      }),
    )
  })

  test('the user can delete a snack specific', async () => {
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

    const snackId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${snackId}`)
      .set('Cookie', cookies)
      .expect(201)
  })
})
