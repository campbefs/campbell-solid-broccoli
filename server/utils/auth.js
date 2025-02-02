const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
// const expiration = '24h';
const expiration = '2h';


module.exports = {

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function({ req }) {
    // allow token to be sent via req.body, req.query or headers
    // console.log('headers auth: ', req.headers.authorization);
    // console.log('req.body.token: ', req.body.token);

    let token = req.body.token || req.headers.authorization;
    // let token = req.body.token || req.headers.authorization;
    // console.log('token: ', token);

    // separate bearer from token value
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object

      // console.log('token2: ', token);
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      
      // debugging auth
      // const { data } = jwt.verify(token, secret, { maxAge: expiration }, function(err, decoded) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(decoded);
      //   }
      // });

      // console.log('data: ', data);
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return updated request object
    return req;
  },

    // function for our authenticated routes
  // authMiddleware: function (req, res, next) { // don't need 'next' with graphql. 'res' is simply 'return'
  //   // allows token to be sent via  req.query or headers
  //   let token = req.query.token || req.headers.authorization;

  //   // ["Bearer", "<tokenvalue>"]
  //   if (req.headers.authorization) {
  //     token = token.split(' ').pop().trim();
  //   }

  //   if (!token) {
  //     return res.status(400).json({ message: 'You have no token!' });
  //   }

  //   // verify token and get user data out of it
  //   try {
  //     const { data } = jwt.verify(token, secret, { maxAge: expiration });
  //     req.user = data;
  //   } catch {
  //     console.log('Invalid token');
  //     return res.status(400).json({ message: 'invalid token!' });
  //   }

  //   // send to next endpoint
  //   next();
  // },
};
