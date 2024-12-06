const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

//Health Checking
app.get('/health',(req,res)=>{
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/inventory', (req,res)=>{
    var response = "";
    try{
        console.log(req.body);
        var success = transactionService.addTransaction(req.body);
        if (success = 200) res.json({ message: 'added transaction successfully'});
    }catch (err){
        res.json({ message: 'something went wrong', error : err.message});
    }
});

// GET ALL TRANSACTIONS
app.get('/inventory',(req,res)=>{
    try{
        var transactionList = [];
       transactionService.getAllTransactions(function (results) {
            console.log("we are in the call back:");
            for (const row of results) {
                transactionList.push({
                    "id": row.id,
                    "name": row.name,
                    "posterImg": row.posterImg,
                    "coverImg": row.coverImg,
                    "description": row.description,
                    "rating": row.rating,
                    "year": row.year,
                    "tagLine": row.tagLine,
                    "minutes": row.minutes,
                    "genres": row.genres,
                });
            }
            console.log(transactionList);
            res.statusCode = 200;
            res.json(transactionList);
        });
    }catch (err){
        res.json({message:"could not get all transactions",error: err.message});
    }
});

//DELETE ALL TRANSACTIONS
app.delete('/inventory',(req,res)=>{
    try{
        transactionService.deleteAllTransactions(function(result){
            res.statusCode = 200;
            res.json({message:"delete function execution finished."})
        })
    }catch (err){
        res.json({message: "Deleting all transactions may have failed.", error:err.message});
    }
});

//DELETE ONE TRANSACTION
app.delete('/inventory/id', (req,res)=>{
    try{
        //probably need to do some kind of parameter checking
        transactionService.deleteTransactionById(req.body.id, function(result){
            res.statusCode = 200;
            res.json({message: `transaction with id ${req.body.id} seemingly deleted`});
        })
    } catch (err){
        res.json({message:"error deleting transaction", error: err.message});
    }
});

//GET SINGLE TRANSACTION
app.get('/inventory/id',(req,res)=>{
    //also probably do some kind of parameter checking here
    try{
        transactionService.findTransactionById(req.body.id,function(result){
            res.statusCode = 200;
            var id = result[0].id;
            var name = result[0].name;
            var posterImg= result[0].posterImg;
            var coverImg = result[0].coverImg;
            var description = result[0].description;
            var rating = result[0].rating;
            var year = result[0].year;
            var tagLine= result[0].tagLine;
            var minutes= result[0].minutes;
            var genres= result[0].genres;

            res.json({
                "id": id,
                "name": name,
                "posterImg": posterImg,
                "coverImg": coverImg,
                "description": description,
                "rating": rating,
                "year": year,
                "tagLine": tagLine,
                "minutes": minutes,
                "genres": genres,
            });
        });

    }catch(err){
        res.json({message:"error retrieving transaction", error: err.message});
    }
});

  app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`)
  })
