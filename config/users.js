'use strict'

const users = [
  { username: 'alice', password: '$2b$13$a.6oKzhpbGcWmrQpV1U42Oc2e6H2/Zb9O3txkSVg7//k9COWjMn0i', email: 'alice@domain', name: 'Alice Inchains', identityProvider: 'Local' }, // password: hello1234
  { username: 'bob', password: '$2b$13$uqZ8Wdg0IRRn3zbLHf.UguaAcX1ixrfbNvHN5Q.tTuxxgxJ7QMpkK', email: 'bob@foo', name: 'Silent Bob', identityProvider: 'Local' } // password: qwerty
]

const findByUsername = function (username) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    if (user.username === username) {
      return user
    }
  }
  return null
}

module.exports = {
  users,
  findByUsername
}
