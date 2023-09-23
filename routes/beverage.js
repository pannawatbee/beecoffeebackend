const express = require('express');
const router = express.Router();
const beverageController="../controller/beverageController"
const connection = mysql.createConnection({
    host: 'localhost',
    password: "root",
    user: 'root',
    database: 'coffee_system'
  });

router.get("/",beverageRouter.index)
router.get('/all', (req, res) => {
  
    connection.query(
        'SELECT * FROM `beverage`',
        function(err, results, fields) {
          console.log(results); // results contains rows returned by server
        
          res.json({results:results})
    }
      );
      
})

module.exports= router;
