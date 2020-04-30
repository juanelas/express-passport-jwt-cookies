# express-passport with local and JWT authentication

A simple fortune-teller server authenticated with JWTs. It has been created merely with an academic purpose. 

It provides an authenticated fortune-teller server. The fortune-teller server requires that the users have a valid JWT ([JwtStrategy](http://www.passportjs.org/packages/passport-jwt/)) and expects to find it in a cookie. In order to get a valid JWT, a user should login with a valid username and password ([LocalStrategy](http://www.passportjs.org/packages/passport-local/)).

The fortune-teller server operated over https and therefore you need a certificate and a private key. Where to find those files is configured in `config/index.js`. By default, it is expecting to find the private key in `keys/privkey.pem` and the certificate in `keys/cert.pem`; both in PEM format.

All the session information is stored in the JWT client side (__sessionless server__).

As already stated, we will use cookies for token storage (on the client) and exchange (between client and server). Cookies are handled by default by any web browser and thus remove the need to also create a client.

JWT and cookies configuration options are stored in `config/index.js`. You MUST __revisit that file__.
> Please note that the server's secret for 'signing' (HMACing) the token is one of the options, so be careful if you are syncing that file with an online repository. Just in case you are interested, this problem is often faced by using a gitignored .env file with an environment variable for the secret.

User login is performed with a local strategy using username and passwords. The server stores bcrypt-ed passwords that are checked against the user-provided one. For the sake of simplicity, no DB is used and two example users are hardcoded in `config/users.js`. You can create new bcrypt-ed passwords using the provided script `tools/bcrypt.js`. The salt value is randomly chosen and the number of rounds defaults to `13` but can be set to any value as a second argument; e.g. for password `hello123`:
 ```bash
$ node bcrypt.js hello123
$2b$13$x2B9adECo7EkKuDbujJe1unW3icISCctreasFOJFiLyyWUdDOO9zu
$ node bcrypt.js hello123 16
$2b$16$ZiY1yscail4V72CYP1IK3uaC3owprKpLftbHCutDvCVxKSlYVe6qW
 ```
 