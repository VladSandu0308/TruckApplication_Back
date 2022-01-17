const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.updateUserRole = async(req,res,next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `name`=?",
            [req.body.name]
          );

        if (row.length === 0) {
            return res.status(201).json({
                message: "This user doesn't exist",
            });
        }

        const [row_role_change] = await conn.execute(
          "UPDATE `users` SET `role`=? WHERE `name`=?",[
            req.body.role,
            req.body.name
          ]
        );           

        if (row_role_change.affectedRows === 0){
          return res.status(422).json({
            message: "The user's role wasn't modified.",
          });
        } else {
          return res.status(200).json({
            message: "The user's role was modified!",
          });
        }



    }catch(err){
        next(err);
    }
}