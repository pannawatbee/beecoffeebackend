const express = require('express');
const app = express();
// const mysql = require('mysql');
const cors = require('cors');
const mysql = require('mysql2');

const path = require('path')
const cookieSession = require('cookie-session');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var jwt = require('jsonwebtoken');
const secret = 'Login-20202'

const { body, validatorResult } = require('express-validator')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  password: "root",
  user: 'root',
  database: 'coffee_system'
});

// const  beverageRouter = require('./routes/beverage')
// app.use("/api/beverage",beverageRouter)





module.exports = connection;

app.get('/all', (req, res) => {

  connection.query(
    'SELECT * FROM `beverage`',
    function (err, results, fields) {
      // console.log(results); // results contains rows returned by server

      res.json({ results: results })
    }
  );
})

app.get('/beverage', (req, res) => {

  connection.query(
    'SELECT * FROM `beverage`WHERE beverage.ListType="Beverage"',
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server

      res.json({ results: results })
    }
  );
})

app.get(['/price'], (req, res) => {
  // console.log(req.query)
  const { ListTitle } = req.query
  // console.log(ListTitle)
  connection.query(
    `SELECT Price,idList FROM beverage WHERE beverage.ListTitle="${ListTitle}"`,
    function (err, results, fields) {
      // console.log('test')
      // console.log(results); // results contains rows returned by server

      res.json({ results: results })
    }
  );
})


app.post('/idUsers', jsonParser, (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  //  console.log(token)
  var decoded = jwt.verify(token, secret);
  // console.log(decoded)
  // console.log(decoded.email)
  connection.query(
    `SELECT idUsers FROM users WHERE users.email="${decoded.email}"`,
    function (err, results, fields) {
      // console.log('test')
      // console.log(results); // results contains rows returned by server

      res.json({ results: results })
    }
  );
})


// app.post('/authen', jsonParser, function (req, res, next) {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     // res.json({token})
//     //  const token = req.headers.authorization.split('')[1];
//     var decoded = jwt.verify(token, secret);
//     res.json({ status: 'ok', decoded })
//   }

//   catch (err) {

//     res.json({ status: 'err', message: err.message })
//   }
// })


// connection.execute(
//   'INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [req.body.email, req.body.name, hash],
//   function (err, results, fields) {
//     // console.log(results)
//     if (err) {
//       res.json({ status: "error", message: err })
//       return
//     }
//     res.json({ status: "ok" })
//   }
// )



app.post('/order', jsonParser, function (req, res, next) {
  console.log('117')
  console.log(req.body)
  console.log('118')

  connection.execute(
    // `INSERT INTO order (amount, totalbaht, idList, idUsers) VALUES ('req.body.amount','req.body.totalbaht','req.body.idList','req.body.idUsers');`
    'INSERT INTO coffee_system.order (amount,totalbaht,idList,idUsers) VALUES (?, ?, ?, ?)', [req.body.amount, req.body.totalBaht, req.body.idList, req.body.idUsers],
    // 'INSERT INTO order (amount,totalbaht,idList,idUsers) VALUES (req.body.amount, req.body.totalbaht, req.body.idList,  req.body.idUsers)',
    function (err, results, fields) {
      console.log(req.body.amount);
      // console.log(results)
      if (err) {
        res.json({ status: "error", message: err })
        return
      }
      res.json({ status: "ok" })
    }
  )
})

app.post('/register', jsonParser, function (req, res, next) {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    connection.execute(
      'INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [req.body.email, req.body.name, hash],
      function (err, results, fields) {
        // console.log(results)
        if (err) {
          res.json({ status: "error", message: err })
          return
        }
        res.json({ status: "ok" })
      }
    )

  });

})




app.post('/login', jsonParser, function (req, res, next) {

  connection.execute(
    'SELECT * FROM users WHERE email=?', [req.body.email],
    function (err, users, fields) {
      // console.log(results)
      if (err) {
        res.json({ status: "error", message: err })
        return
      }
      if (users.length == 0) { res.json({ status: 'error', message: 'no user found' }); return }
      bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
        // result == true
        if (isLogin) {
          var token = jwt.sign({ email: users[0].email }, secret);
          res.json({ status: 'ok', message: 'login success', token })

        } else {
          res.json({ status: 'error', message: 'login failed' })
        }
      });

    }
  )

})

app.post('/authen', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // res.json({token})
    //  const token = req.headers.authorization.split('')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded })
  }

  catch (err) {

    res.json({ status: 'err', message: err.message })
  }
})




app.listen('8080', () => {
  console.log('Serve is running on port 8080')
})