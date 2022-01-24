const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.generateContract = async(req,res,next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

      const [row_trucks] = await conn.execute(
        "SELECT * FROM `users` WHERE `name`=?",
        [req.body.trans]
      );

      if (row_trucks.length === 0) {
        return res.status(422).json({
          message: "The truck user doesn't exist",
        });
      } else if (row_trucks[0].role !== "Transporter") {
        return res.status(422).json({
          message: "This is not transporter user",
        });
      }

      const [row_clients] = await conn.execute(
        "SELECT * FROM `users` WHERE `name`=?",
        [req.body.client]
      );

      if (row_clients.length === 0) {
        return res.status(422).json({
          message: "The client user doesn't exist",
        });
      } else if (row_clients[0].role !== "Client") {
        return res.status(422).json({
          message: "This is not client user",
        });
      }

      

      // delete offer or request
      if (req.body.t_id != null) {
        
        const [delete_trans] = await conn.execute(
          "DELETE FROM `transporters` WHERE `t_id`=?",[
          req.body.t_id
        ]);  
    
        if (delete_trans.affectedRows === 0) {
            return res.status(422).json({
                message: "The request has not been deleted.",
            });
        }  
      } else if (req.body.c_id != null) {
        
        const [delete_client] = await conn.execute(
          "DELETE FROM `clients` WHERE `c_id`=?",[
          req.body.c_id
        ]);  
    
        if (delete_client.affectedRows === 0) {
            return res.status(422).json({
                message: "The client request has not been deleted.",
            });
        } 
      }

      const [clients_change] = await conn.execute(
        "INSERT INTO `contracts` (`transporter`, `client`, `dep_place`, `int_place`, `arival_place`, `price`, `pay_deadline`, `dep_date`, `arival_date`, `finished`, `obs`) VALUES(?,?,?,?,?,?,?,?,?,?,?)",[
          row_trucks[0].id,
          row_clients[0].id,
          req.body.dep_place,
          req.body.int_place,
          req.body.arival_place,
          req.body.price,
          req.body.pay_deadline,
          req.body.dep_date,
          req.body.arival_date,
          0,
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