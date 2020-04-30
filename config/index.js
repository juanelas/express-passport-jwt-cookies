const path = require('path')

module.exports = {
  baseUrl: 'https://localhost:8443',
  jwt: {
    secret: 'myServerSecret'
  },
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: true
  },
  tlsServer: {
    certificate: path.join(__dirname, '..', 'keys', 'cert.pem'),
    privateKey: path.join(__dirname, '..', 'keys', 'privkey.pem')
  }
}
