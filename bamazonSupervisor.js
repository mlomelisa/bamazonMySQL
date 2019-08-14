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
          viewProductsSalebyDep();
        break;
      case 'Create New Department':
          createNewDep();
        break;
      case 'Exit':
        process.exit();
      break;
    }
  });
}

function viewProductsSalebyDep(){
  connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS Total_Profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name;', function(err, response) {
    if (err) throw err;
    
  console.table(response)
  main();
  });
}

function createNewDep(){

    inquirer.prompt([
      {type: 'input',
      name:'departmentname',
      message: 'Please enter the Department name: '
      },
      {
      type: 'input',
      name:'over_head_costs',
      message: 'Please enter the Over Head Costs: '
      }
     ]).then(function(answers){
      
    var newDepartment = {
       'department_name' : answers.departmentname,
        'over_head_costs' : answers.over_head_costs
     }
     console.log(newDepartment);
      connection.query('INSERT INTO departments SET ?',newDepartment, function(err,response){
        if (err) throw err;
        console.log(response.affectedRows + ' Department created.')
        main()
      });
    })
}
