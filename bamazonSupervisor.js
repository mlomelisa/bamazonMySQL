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
     choices: ['View Product Sales by Department','Create New Department','Exit']
    }
  ]).then(function(answer){
    // console.log(answer);
    var option = answer.actions;

    switch(option){
      case 'View Product Sales by Department':
          viewProductsforSale();
        break;
      case 'Create New Department':
          viewLowInventory();
        break;
      case 'Exit':
        process.exit();
      break;
    }
  });
}