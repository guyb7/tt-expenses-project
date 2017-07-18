import Pool from 'pg-pool'
import Promise from 'bluebird'

const pool = new Pool({
  host:     process.env.PG_HOST,
  port:     process.env.PG_PORT,
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  max: 10,
  idleTimeoutMillis: 30000,
  Promise
})

pool.on('error',  (err, client) => {
  console.error('idle client error', err.message, err.stack)
})

const disconnect = async () => {
  await pool.end()
}

module.exports = {
  pool,
  query: (query, params) => {
    return new Promise((resolve, reject) => {
      pool.connect()
      .then(client => {
        client.query(query, params).then(res => {
          client.release()
          resolve(res)
        })
        .catch(e => {
          client.release()
          reject(e)
        })
      })
      .catch(e => {
        reject(e)
      })
    })
  },
  disconnect
}
