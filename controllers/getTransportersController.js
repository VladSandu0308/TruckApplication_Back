const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getTransporters = async (req,res,next) => {

    try{
 
        const [rows] = await conn.execute('SELECT * FROM `transporters`');

        for (var i=0; i< rows.length;i++){
          const [user_name] = await conn.execute('SELECT * FROM `users` where `id`=?', [rows[i].user]);

          if (user_name.length === 0) {
            return res.status(422).json({
                message: "No room by that id"
            });
          }
          
          rows[i].user_name = user_name[0].name;
        }


        res.contentType('application/json');
        return res.send(JSON.stringify(rows));  
    }
    catch(err){
        next(err);
    }
}