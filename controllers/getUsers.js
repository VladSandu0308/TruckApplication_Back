const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();

exports.getUsers = async (req,res,next) => {

    try{
 
        const [rows] = await conn.execute('SELECT * FROM `users`');
        res.contentType('application/json');
        return res.send(JSON.stringify(rows));  
    }
    catch(err){
        next(err);
    }
}