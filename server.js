//const http = require('http');

const express = require('express'); // Import the Express.js framework (the express function that helps creating new instance of Express.js)
const bodyParser = require('body-parser');
const pool = require('./database_signin_login'); // Import the database connection pool
const path = require('path')

const app = express(); // Create an instance of the Express application
const PORT = 3000; // Define the port number for the server

// use middlewere
// Parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Sign_in_log_in.html'));
});




/************************  login endpoint  ***************************/

//route for handling login requests
app.post('http://localhost:3000/login', (req, res) => {

  try {
    //const username = req.body.username_log;  // get from req the value on the name username_log
    const email = req.body.email_log;
    const password = req.body.password_log;

    // i need to to a check if the form transferred is login form or signup form

    //find a row with matching email and password. if true- returns array with length > 0, else- length = 0
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";  // ? will be replaced by password and email. placeholders (?)

    pool.query(sql, [email, password], (err, results) => {

        if(err){ // if error accurs when executing query, trow error
            throw err;
        }

        if (results.length > 0){ // if found in database the email with the password
          res.status(200).json({"success": true, "message": "Login successful (message test)"}); // Set status code for success
          res.send('Login successful'); // Send success message
          return;
        }

        else{  // if password and email not found
          res.status(401); // Set status code for unauthorized
          //res.send('Invalid credentials'); // Send error message
          return;
        }

    }); 
  } 

  // for server related errors only
  catch (error) {  // if error is thrown from 'try' block 

      // If an error occurs, send an error response back to the client
      console.error('Error:', error);
      res.status(500).send('Internal server error');
  }
});






/************************  signin endpoint  ***************************/

app.post('http://localhost:3000/signin', (req, res) => {

    try{
      res.send("test1");

        const username = req.body.username_sign;
        const email = req.body.email_sign;
        const password = req.body.password_sign;

        // a quary to check if this user exists before adding it to the database
        const sql_exiatance_check = "SELECT * FROM login WHERE username = ? AND email = ? AND password = ?";  // ? will be replaced by password and email. placeholders (?)
        const sql_add_user = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        pool.query(sql_exiatance_check, [username, email, password], (err, results) => {

          if (err){ // check  if theres an err with the query
            throw err;
          }

          if (results.length > 0){  // checks if user alrady exists
            res.status(409).json({"success": false, "message": "Login not successful- this user alrady exists"});
            res.send("this user alrady exists")
            return;
          }

          else{  // if user  doesnt exist, add new user

            pool.query(sql_add_user, [username, email, password], (err, resulst) => {

              if (err){  // if there was an err with quary
                throw err;
              }

              // signup successful
              res.status(200).json({"success": true, "message": "Login successful (message test)"});
              res.send("Signup successful");
              return;
            });

          }

        });
        
    }

    catch(error){

      console.error('Error:', error);
      res.status(500).json({"success": false, "message": "Login not successful- serever error "}); // Set status code for server error
      return res.send('Internal server error'); // Send error message


    }

});



// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log('Listening...');
  console.log(`Server is running on http://localhost:${PORT}`);
});
