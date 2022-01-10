const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.generateContract = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
      const [row_users] = await conn.execute(
        "SELECT * FROM `users` WHERE `id`=?",
        [req.body.user_id]
      );

      if (row_users.length === 0) {
        return res.status(422).json({
          message: "The user doesn't exist",
        });
      }

      const [row_trucks] = await conn.execute(
        "SELECT * FROM `transporters` WHERE `t_id`=?",
        [req.body.truck_id]
      );

      if (row_trucks.length === 0) {
        return res.status(422).json({
          message: "The truck doesn't exist",
        });
      }

      const [row_clients] = await conn.execute(
        "SELECT * FROM `clients` WHERE `c_id`=?",
        [req.body.client_id]
      );

      if (row_clients.length === 0) {
        return res.status(422).json({
          message: "The client doesn't exist",
        });
      }

      const [clients_change] = await conn.execute(
        "INSERT INTO `contract` (`truck`, `user`, `client`, `dep_place`, `arival_place`, `price`) VALUES(?,?,?,?,?,?)",[
          req.body.truck_id,
          req.body.user_id,
          req.body.client_id,
          req.body.dep_place,
          req.body.arival_place,
          req.body.price
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