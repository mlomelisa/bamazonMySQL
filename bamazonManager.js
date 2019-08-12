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

 function addToInventory(){
      inquirer.prompt([
      {type: 'input',
      name:'item',
      message: 'What is the item ID you want to increase its inventory?'
      // Add a validation that user cant enter a value outside the items range
      }
    ]).then(function(answers){
      var itemID = parseInt(answers.item);
      console.log(itemID)
      connection.query('SELECT * FROM products WHERE item_id = ?', itemID ,function(err, response){
        if (err) throw err;
        console.log(response)
        // console.log("You select product: " + response[0].product_name);
        var dbItemCount = response[0].stock_quantity;
                
        inquirer.prompt([
          {type: 'input',
          name:'quantity',
          message: 'How many items you want to add?'
          }
        ]).then(function(answers){
          var quantityItem = parseInt(answers.quantity);
                     
            var newItemCount = dbItemCount + quantityItem;
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newItemCount, itemID],function(err, response){
              if (err) throw err;
          
              console.log(response.affectedRows + ' Products increased Inventory.')
              process.exit();
            });
         
       });
      
      })
   });
}

 function addNewProduct(){
  inquirer.prompt([
    {type: 'input',
    name:'productname',
    message: 'Please enter the Product name: '
    },
    {
    type: 'input',
    name:'deparmentname',
    message: 'Please enter the Department name: '
    },
    {
    type: 'input',
    name:'price',
    message: 'Please enter the price: '
    },
    {
      type: 'input',
      name:'stockQuantity',
      message: 'Please enter the quantity of the Item: '
    }
   ]).then(function(answers){
    
  var newItem = {
     'product_name' : answers.productname,
      'department_name' : answers.deparmentname,
      'price' : answers.price,
      'stock_quantity' : answers.stockQuantity
   }
   console.log(newItem);
    connection.query('INSERT INTO products SET ?',newItem, function(err,response){
      if (err) throw err;
      console.log(response.affectedRows + ' Products added to Inventory.')
      viewProductsforSale()
    });
  })
}

