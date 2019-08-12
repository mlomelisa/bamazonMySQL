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
    var newItem = parseInt(answers.item);
    
    connection.query('SELECT * FROM products WHERE item_id = ?', newItem ,function(err, response){
      if (err) throw err;
      console.log("You select product: " + response[0].product_name);
      var dbItemCount = response[0].stock_quantity;
      var dbItemPrice = response[0].price;
      
      inquirer.prompt([
        {type: 'input',
        name:'quantity',
        message: 'How many items you want to buy?'
        }
      ]).then(function(answers){
        var quantityItem = parseInt(answers.quantity);
        
        if(dbItemCount >= quantityItem) {
          
          var newItemCount = dbItemCount - quantityItem;
          connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newItemCount, newItem],function(err, response){
            if (err) throw err;
            totalAmount(quantityItem,dbItemPrice)
            console.log('Thank you for buying with us!!')
            process.exit();
          });
        } else {
          console.log("Insufficient quantity!");
          postFunction();
        }
     });
    
    })
 });

}  

function totalAmount(quantityItem, price){
  var total = quantityItem * price;
  console.log("Your Total is: " + total)
}