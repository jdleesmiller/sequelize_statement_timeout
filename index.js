const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres', 'postgres', '', {
  host: 'db',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    statement_timeout: 1000
  },
  operatorsAliases: false
})

console.log('Fast query without transaction:')
sequelize.query('SELECT 1').then(result => {
  console.log(result)
}).then(() => {
  console.log('\nSlow query without transaction:')
  return sequelize.query('SELECT pg_sleep(2)').then(result => {
    console.log(result)
  }).catch((err) => {
    console.log(err.message)
  })
}).then(() => {
  console.log('\nSlow query in transaction without local statement timeout:')
  return sequelize.transaction((transaction) => {
    return sequelize.query('SELECT pg_sleep(2)', { transaction })
    .then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err.message)
    })
  })
}).then(() => {
  console.log('\nSlow query in transaction with local statement timeout:')
  return sequelize.transaction((transaction) => {
    return sequelize.query('SET LOCAL statement_timeout = 3000', { transaction })
    .then((result) => {
      return sequelize.query('SELECT pg_sleep(2)', { transaction })
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err.message)
    })
  })
}).then(() => sequelize.close())
