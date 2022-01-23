const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.updateContract = async(req,res,next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `contracts` WHERE `c_id`=?",
            [req.body.id]
          );

        if (row.length === 0) {
            return res.status(201).json({
                message: "This contract doesn't exist",
            });
        }

        const [row_role_change] = await conn.execute(
          "UPDATE `contracts` SET `finished`=? WHERE `c_id`=?",[
            1,
            req.body.id
          ]
        );           

        if (row_role_change.affectedRows === 0){
          return res.status(422).json({
            message: "The contract status wasn't modified.",
          });
        } else {
          return res.status(200).json({
            message: "The contract status was modified!",
          });
        }



    }catch(err){
        next(err);
    }
}