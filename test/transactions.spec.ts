import { app } from '../src/app'

import { it, beforeAll, afterAll, describe, isWatchMode, expect } from 'vitest'
import request from 'supertest'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to create a new transaction', async () => {
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'test transaction',
                amount: 200.45,
                type: 'credit'
            })
            .expect(201)
            console.log(response.get('Set-Cookie'))
        })
    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'test transaction get list',
                amount: 200.45,
                type: 'credit'
            })
        
        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies){
            throw new Error('Cookie dont generated')
        }
        
        const listAllTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listAllTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'test transaction get list',
                amount: 200.45,
            })
        ])
    })
})
