const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

const port = 8080;

app.get('/', (req, res) =>
  res.json({
    message: 'Welcome to JWT!',
  })
);

// create post route
app.post('/api/posts', verifyToken, (req, res) => {
  // Verify token from request
  jwt.verify(req.token, 'secret_key', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData,
      });
    }
  });
});

// login route
app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: 'arttwis',
    email: 'art.twis@gmail.com',
  };

  jwt.sign(
    { user: user },
    'secret_key',
    {
      expiresIn: '30s',
    },
    (err, token) => {
      res.json({
        token,
      });
    }
  );
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // Format of token
  // authorization: Bearer <access_token>

  //   Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    let bearer = bearerHeader.split(' ');

    // Get token from array
    let bearerToken = bearer[1];

    // Set the token
    req.token = bearerToken;

    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(port, () => console.log(`App is listening on port ${port}!`));
