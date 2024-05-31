

const express = require('express'); // Import the Express.js framework (the express function that helps creating new instance of Express.js)
const bodyParser = require('body-parser');
const pool = require('./database_signin_login'); // Import the database connection pool
const path = require('path');
const cors = require('cors');
//const { threadId } = require('worker_threads'); //?

const app = express(); // Create an instance of the Express application
const PORT = 3000; // Define the port number for the server

// Use CORS middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials
}));

// Parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle CORS preflight requests
app.options('*', cors());


//--------------------------------------- functions ----------------------------------------------------------------------

const isUserExist = (sql, user_data, callback) => { // user data- [email, password]  callback - (err, result)
    pool.query(sql, user_data, (err, result) => { // send quary to database

        if(err){  // if there is an error with the quary, callback will be err
          callback(err);
          return;
        }
        callback(null, result.length > 0)
        // null - if no error, than callback will contain null
        // result.length > 0 - true(user exist)/ false(user doesnot exist)
    })
}

// add new user function
const addUser = (user_data, callback) => {
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    pool.query(sql, user_data, (err, result) => { // send quary to database

      if(err){
        callback(err);
        return;
      }
      callback(null)/////////// can i just put null (as no error) or do i need to past one more argument?

    })
}


//--------------------------------------------------- login endpoint  -------------------------------------------------------------------------/

/*
app.get('/try', (req, res) =>{

  pool.query("SELECT * FROM login WHERE email = ? AND password = ?", ['example@example.com', 'password123'], (err, result) =>{
    if(err){
      console.log(err);
      res.status(500).send(err);
    }

    else
    console.log(result);
    res.status(200).send(result);

  });
  

})
*/

//route for handling login requests
app.post('/login', (req, res) => {

  res.header("Access-Control-Allow-Methods", "GET, POST");


  try {
    //const username = req.body.username_log;  // get from req the value on the name username_log
    const email = req.body.email_log;
    const password = req.body.password_log;
    const sql = "SELECT * FROM login WHERE username = ? AND email = ? AND password = ?";

    isUserExist(sql, [email, password], (err, exists) => {

      if(err)
        throw err;

      if(exists)
          res.status(200).json({"success": true, "message": "Login successful"});

      else
          res.status(401).json({"success": false, "message": "Invalid credentials"});
    });

  }
  // for server related errors only
  catch (error) {  // if error is thrown from 'try' block 

      // If an error occurs, send an error response back to the client
      console.error('Error:', error);
      res.status(500).json({"success": false, "message": "Internal server error"});
  }
});




//--------------------------------------------------- signup endpoint  -------------------------------------------------------------------------/

app.post('/signin', (req, res) => {

  res.header("Access-Control-Allow-Methods", "GET, POST");


    try{
        const username = req.body.username_sign;
        const email = req.body.email_sign;
        const password = req.body.password_sign;


        const sql = "SELECT * FROM login WHERE username = ?";

        isUserExist(sql,[username], (err, exists) => { //result - true/false

            if(err){

              res.send("error chacking if username exists");
              throw err;}
            
            if(exists){
              res.send("this name is allrady taken");}
            
            else{  // if the user name is not taken -->  add  user to the database
            
                // add new user
                addUser([username, email, password], (err, resulst) => {
                  if(err){
                    res.send("error creating new user (server error)");
                    throw err;
                  }
                  else{
                    res.status(200).json({"success": true, "message": "SignUp successful"});
                  }
                });

            }

        });

    }

    catch(error){
      console.error('Error:', error);
      res.status(500).json({"success": false, "message": "Login not successful- server error "}); // Set status code for server error
      return res.send('Internal server error'); // Send error message
    }

});


//--------------------------------------------------- run server  -------------------------------------------------------------------------/

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log('Listening...');
  console.log(`Server is running on http://localhost:${PORT}`);
});
