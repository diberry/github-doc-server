const request = require('supertest')
const app = require('../src/app')

describe('Errors', () => {
  it('new Error should be caught ', async (done) => {

    try{
        const res = await request(app).post('/api/error')
        expect(res.status).toBe(404)
        done()
    } catch (err){
        done(err)
    }
  })
  it('sync - undefined variable should be caught ', async (done) => {

    try{
        const res = await request(app).post('/error/sync')
        expect(res.status).toBe(404)
        done()
    } catch (err){
        done(err)
    }
  })
  it('async - rejected promise should be caught ', async (done) => {

    try{
        const res = await request(app).post('/error/async')
        expect(res.status).toBe(404)
        done()
    } catch (err){
        done(err)
    }
  })
})