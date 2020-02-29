var mysql = require("mysql");
var inquirer = require("inquier")

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.end();
  });
  
  var display = function() {
      connection.query("SELECT * FROM products", function(err, results){
          if (err) throw err;
          console.log(results);
      })
  };
  var run = function() {
      connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer
        .prompt({
            name: "product",
            type:"list",
            choices: function() {
                var choiceArray = [];
                 for (var i = 0; i < results.length; i++) {
                    choice.Array.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "What do you want to buy?"
            },
            {
                name: "amount",
                type: "input",
                message: "Amount you would like to purchase?",
            }
        
            .then(function(answer){
            var chosenProduct;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.product) {
                    chosenProduct = results[i];
                }
            }
            if (chosenProduct.stock_quantity - parseInt(answer.amount)) {
                connection.query("UPDATE products SET ? WHERE ?", [ 
                    {
                        stock_quantity: chosenProduct.stock_quantity - parseInt(answer.amount)
                    },
                {
                    id: chosenProduct.id
                }],
                function(error) {
                    if(error) throw err;
                    console.log("\n\n");
                    console.log("Purchase complete");
                    display();
                    run();
                })
            } else {
                console.log("====================");
                console.log("Item out of stock");
                display();
                run();
            }
        )};
      });
  };

display();
run();