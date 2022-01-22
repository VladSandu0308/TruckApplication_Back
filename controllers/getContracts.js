const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getContracts = async (req,res,next) => {

    try{
 
        const [rows] = await conn.execute('SELECT * FROM `contracts`');

        for (var i=0; i< rows.length;i++){
          
          const [trans_user_name] = await conn.execute('SELECT * FROM `users` where `id`=?', [rows[i].transporter]);
          const [client_user_name] = await conn.execute('SELECT * FROM `users` where `id`=?', [rows[i].client]);

          if (trans_user_name.length === 0 || client_user_name.length === 0) {
            return res.status(422).json({
                message: "No room by that id"
            });
          }
          
          rows[i].t_username = trans_user_name[0].name;
          rows[i].t_phone = trans_user_name[0].phone;
          rows[i].t_email = trans_user_name[0].email;

          rows[i].c_username = client_user_name[0].name;
          rows[i].c_phone = client_user_name[0].phone;
          rows[i].c_email = client_user_name[0].email;

        }

        res.contentType('application/json');
        return res.send(JSON.stringify(rows));  
    }
    catch(err){
        next(err);
    }
}