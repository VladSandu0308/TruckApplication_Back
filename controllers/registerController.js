const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.register = async(req,res,next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    try{

        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
          );

        if (row.length > 0) {
            return res.status(201).json({
                message: "The E-mail already in use",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute('INSERT INTO `users`(`name`,`email`, `phone`, `password`, `role`) VALUES(?,?,?,?,?)',[
            req.body.name,
            req.body.email,
            req.body.phone,
            hashPass,
            req.body.role
        ]);

        if (rows.affectedRows === 1) {
            console.log("SUCCESFUL");
            return res.status(201).json({
                message: "The user has been successfully inserted.",
            });
        }
        
    }catch(err){
        next(err);
    }
}