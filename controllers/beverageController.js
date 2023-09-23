const connection = mysql.createConnection({
    host: 'localhost',
    password: "root",
    user: 'root',
    database: 'coffee_system'
  });

const models = require("../models/index")

exports.index=async (req,res,next)=>{

    const beverage = await models.beverage.findAll();
   
    res.status(200).json({
     data:beverage
    })
    // connection.query(
    //     'SELECT * FROM `beverage`',
    //     function(err, results, fields) {
    //       console.log(results); // results contains rows returned by server
        
    //       res.json({results:results})
    // }
    //   )



};