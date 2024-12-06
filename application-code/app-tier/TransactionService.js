const dbcreds = require('./DbConfig');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE
});

function addTransaction(req){
    var mysql = `INSERT INTO \`movies\` (
        \`name\`,
        \`posterImg\`,
        \`coverImg\`,
        \`description\`,
        \`rating\`,
        \`year\`,
        \`tagLine\`,
        \`minutes\`,
        \`genres\`
    )
    VALUES (
    '${req.name}',
    '${req.posterImg}',
    '${req.coverImg}',
    '${req.description}',
    '${req.rating}',
    '${req.year}',
    '${req.tagLine}',
    '${req.minutes}',
    '${req.genres}'
    )`;
    con.query(mysql, function(err,result){
        if (err) throw err;
        console.log("Adding to the table should have worked");
    })
    return 200;
}

function getAllTransactions(callback){
    var mysql = "SELECT * FROM movies";
    con.query(mysql, function(err,result){
        try {
            if (err) throw err;
            console.log("Getting all movies...");
            return(callback(result));
        } catch (e) {
            return(callback(
                []
            ));
        }
    });
}

function findTransactionById(id,callback){
    var mysql = `SELECT * FROM movies WHERE id = ${id}`;
    con.query(mysql, function(err,result){
        if (err) throw err;
        console.log(`retrieving movies with id ${id}`);
        return(callback(result));
    })
}

function deleteAllTransactions(callback){
    var mysql = "DELETE FROM movies";
    con.query(mysql, function(err,result){
        if (err) throw err;
        console.log("Deleting all movies...");
        return(callback(result));
    })
}

function deleteTransactionById(id, callback){
    var mysql = `DELETE FROM movies WHERE id = ${id}`;
    con.query(mysql, function(err,result){
        if (err) throw err;
        console.log(`Deleting movies with id ${id}`);
        return(callback(result));
    })
}


module.exports = {addTransaction ,getAllTransactions, deleteAllTransactions, deleteAllTransactions, findTransactionById, deleteTransactionById};







