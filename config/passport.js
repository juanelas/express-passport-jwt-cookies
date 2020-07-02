'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const GitHubStrategy = require('passport-github').Strategy
const bcrypt = require('bcrypt')

const config = require('.') // if not specified, a require gets the file index.js in the directory
const users = require('./users')

/*
Configure the local strategy for use by Passport.
The local strategy requires a `verify` function which receives the credentials
(`username` and `password`) submitted by the user.  The function must verify
that the username and password are correct and then invoke `done` with a user
object, which will be set at `req.user` in route handlers after authentication.
*/
passport.use('local', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false // we are storing a JWT in the cookie with all the required session data. The server is session-less
  },
  function (username, password, done) {
    const user = users.findByUsername(username)
    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      console.log(`username ${username}: good password!`)
      return done(null, user)
    }
    return done(null, false)
  }
))

/*
JWT strategies differ in how the token is got from the request: cookies, HTTP
authorization header, parameterize URI, ...
The first argument is the name we want for the strategy.
The second argument explains how to get the JWT from the req.
The third one is the strategy's verify function, with provides with extra
verification actions on the JWT claims (the JwtStrategy itself verifies the
signature and the expiration date). If the verification succeeds, it invokes
`done` with a user object, which will be set at `req.user` in route handlers
after authentication.
 */
passport.use('jwtCookie', new JwtStrategy(
  {
    jwtFromRequest: (req) => {
      if (req && req.cookies) { return req.cookies.jwt }
      return null
    },
    secretOrKey: config.jwt.secret
  },
  jwtVerify
))

function jwtVerify (jwtPayload, done) {
  /*
  If the user has a valid token but has been removed from our database,
  authentication fails (we return false). If the token is valid and the user
  is in the database, we return the user data (that will become available as
  req.user)
  */
  const user = users.findByUsername(jwtPayload.sub)
  // console.log(JSON.stringify(user));
  if (user) {
    console.log(`jwt for user ${jwtPayload.sub} verified and the user is in the db`)
    return done(null, user)
  }
  console.log(`jwt for user ${jwtPayload.sub} verified but the user is NOT in the db`)
  return done(null, false) //
}

/**
 * Before using passport-github, you must register an application with GitHub. If you have not already done so, a new application can be created at developer applications within GitHub's settings panel. Your application will be issued a client ID and client secret, which need to be provided to the strategy. You will also need to configure a callback URL which matches the route in your application.
 */
passport.use('github',
  new GitHubStrategy(
    {
      clientID: '46dc017310a82614c071',
      clientSecret: '071e7dc4c999c1c8619a713f46bc63de63253d05',
      callbackURL: 'https://localhost:8443/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
      let user = users.findByUsername(profile.username)
      if (!user) {
        user = users.createUserFromGitHub(profile)
      }
      return cb(null, user)
    }
  )
)

module.exports = passport
