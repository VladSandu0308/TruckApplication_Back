const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.clientRequest = async(req,res,next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
      const [row_users] = await conn.execute(
        "SELECT * FROM `users` WHERE `name`=?",
        [req.body.user]
      );

      if (row_users.length === 0) {
        return res.status(422).json({
          message: "The user doesn't exist",
        });
      }
      
      const [clients_change] = await conn.execute(
        "INSERT INTO `clients` (`dep_date`,`dep_max_date`, `dep_place`,`arival_date`,`arival_max_date`, `arival_place`,`product_type`,`product_weight`, `product_volume`, `budget`, `user`, `obs`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",[
          req.body.dep_date,
          req.body.dep_max_date,
          req.body.dep_place,
          req.body.arival_date,
          req.body.arival_max_date,
          req.body.arival_place,
          req.body.product_type,
          req.body.product_weight,
          req.body.product_volume,
          req.body.budget,
          row_users[0].id,
          req.body.obs
        ]);

        if (clients_change.affectedRows == 0) {
          return res.status(422).json({
            message: "The request was not posted."
          })
        } else {
          return res.status(201).json({
            message: "The request was posted succesfully!"
          })
        }

    }catch(err){
        next(err);
    }
}