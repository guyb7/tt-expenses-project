import dotenv from 'dotenv'

if (process.env.ENV === 'test') {
  dotenv.config({ path: './config/config.test.env' })
}
dotenv.config({ path: './config/config.env' })
