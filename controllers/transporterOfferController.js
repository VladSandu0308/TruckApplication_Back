const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.transporterOffer = async(req,res,next) => {
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

      const [transporters_change] = await conn.execute(
        "INSERT INTO `transporters` (`dep_date`,`dep_place`,`arival_date`,`arival_place`,`truck_type`,`volume`, `length`, `width`, `height`, `empty_price`, `full_price`, `user`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",[
          req.body.dep_date,
          req.body.dep_place,
          req.body.arival_date,
          req.body.arival_place,
          req.body.truck_type,
          req.body.volume,
          req.body.length,
          req.body.width,
          req.body.height,
          req.body.empty_price,
          req.body.full_price,
          req.body.user_id
        ]);

        if (transporters_change.affectedRows == 0) {
          return res.status(422).json({
            message: "The offer was not posted."
          })
        } else {
          return res.status(201).json({
            message: "The offer was posted succesfully!"
          })
        }

    }catch(err){
        next(err);
    }
}