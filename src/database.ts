import 'dotenv/config'
import { knex as knexDatabase, Knex } from 'knex';
import { env } from './env';

export const configDatabase: Knex.Config = {
    client: 'sqlite3',
    connection: {
        filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = knexDatabase(configDatabase)