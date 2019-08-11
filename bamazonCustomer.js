var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "mlomelisa",

  password: "password",
  database: "bamazon"

});

connection.connect(function(err) {
  if (err) throw err;

  main();
  
});

//Function to list all products to sale
function main(){
  connection.query('SELECT * FROM products', function(err, response) {
    if (err) throw err;
    
  console.table(response)
  postFunction();

  });
};

//Function Customer option
function postFunction(){
  
  inquirer.prompt([
    {type: 'input',
    name:'item',
    message: 'What is the item  ID you want to buy?'
    }
  ]).then(function(answers){
    var newItem = {
      'id' : answers.item
    };
    console.log(newItem)
    connection.query('SELECT * FROM products id = ?',newItem,function(err, response){
      if (err) throw err;
      console.log(response);
      
      inquirer.prompt([
        {type: 'input',
        name:'quantity',
        message: 'How many items you want to buy?'
        }
      ]).then(function(answers){
        var quantityItem = {
          'stock_quantity' : parseInt(answers.quantity)
        };
        console.log(quantityItem)
        connection.query('SELECT * FROM products id = ?',quantityItem,function(err, response){
          if (err) throw err;
          console.log(response);
          
          listAuctions();
        
        })
     });
    
    })
 });

}  

