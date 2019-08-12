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

function main(){
  inquirer.prompt([
    {
     type: "rawlist",
     name: 'actions',
     message:"Menu Options:",
     choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','Exit']
    }
  ]).then(function(answer){
    // console.log(answer);
    var option = answer.actions;

    switch(option){
      case 'View Products for Sale':
          viewProductsforSale();
        break;
      case 'View Low Inventory':
          viewLowInventory();
        break;
      case 'Add to Inventory':
          addToInventory();
        break;
      case 'Add New Product':
          addNewProduct();
        break;
      case 'Exit':
        process.exit();
      break;
    }
  });
}

function viewProductsforSale(){
  connection.query('SELECT * FROM products', function(err, response) {
    if (err) throw err;
    
  console.table(response)
  main();
  });
}

function viewLowInventory(){
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, response) {
    if (err) throw err;
    
  console.table(response)
  main();
  });
 }

// function addToInventory(){

// }

// function addNewProduct(){

// }

