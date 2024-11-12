import { app } from '../src/app'

import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
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
    
    it('should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'test transaction',
                amount: 200.45,
                type: 'credit'
            })
            .expect(201)
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

    it('should be able to get especific transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'test get unique transaction',
                amount: 187.36,
                type: 'credit'
            })
        
        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies){
            throw new Error('Cookie dont generated')
        }
        
        const listTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        const transactionId = listTransactionResponse.body.transactions[0].id

        const getTransactionById = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionById.body.transaction).toEqual(
            expect.objectContaining({
                title: 'test get unique transaction',
                amount: 187.36,
            })
        )
    })

    it('should be able to list all transactions', async () => {
        const creditTransaction = await request(app.server)
            .post('/transactions')
            .send({
                title: 'credit transaction',
                amount: 5000,
                type: 'credit'
            })
        
        const cookies = creditTransaction.get('Set-Cookie')
            
        if (!cookies){
            throw new Error('Cookie not exists!')
        }

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'credit transaction',
                amount: 2000,
                type: 'debit'
            })
        
        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)

        expect(summaryResponse.body.summary).toEqual(
            { total_amount: 3000 }
        )
    })
})
