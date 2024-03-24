const mysql = require('mysql');
const con = mysql.createConnection({
    host: '193.198.97.21',
    user:'iooa-turisticke',
    password:'11', 
    database:'iooa-turisticke'
});

/*con.connect((err)=>{
    if(err){
        console.log("connection not proper");
    }else{
        console.log("connected");
    }
});*/

module.exports = con;