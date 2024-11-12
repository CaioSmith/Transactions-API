import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test'){
    config({ path: '.env.test' })
}else{
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['test', 'development', 'homologation', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.error) {
    throw new Error(`Invalid environment variables: ${_env.error.format()}`)
}

export const env = _env.data