

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('log_in_form');
    const signupForm = document.getElementById('registrationForm');
  

    // Function to handle login form submission
    loginForm.addEventListener('submit', function(event) {
        
        event.preventDefault();
        const formData = new FormData(event.target); // Get form data
        const formDataJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formDataJson))   //-----> the data from the loginform an string   
    
        
        const email = document.getElementById('email_log').value;
        const password = document.getElementById('password_log').value;
        alert(email + password);


        // Create an object with the user data --> for the server
        const userData = {
          email_sign: email,
          password_sign: password
        };

        // Send the data to the server using fetch
        fetch('/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userData)
        })


        .then(response => response.json()) // response - promise that fetch returns. response in a parameter to a function that returns the respose in object type (it was string before)
        .then(data => {  // data - response.json, data is the parameter of a function
          if (data.success) {
              alert('login successful');
          } else {
              alert('login failed: ' + data.message);
          }
          })


        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });

        //loginForm.submit();


      //}
  
      // Call login function (to be implemented later)
      //login(username, password);
      
    });


  
    // Function to handle signup form submission
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const username = document.getElementById('username_sign').value;
      const password = document.getElementById('password_sign').value;
      const email = document.getElementById('email_sign').value;
  
      // Perform basic validation (you can add more validation rules)
      if (username.trim() === '' || password.trim() === '') {
        alert('Please enter both username and password');
        return;
      }

      if (password.length < 8){
        alert("password must be at least 8 characters")
        return;
      }



      // Create an object with the user data --> for the server
      const userData = {
        username_sign: username,
        email_sign: email,
        password_sign: password
      };

      // Send the data to the server using fetch
      fetch('/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
      })


      .then(response => response.json()) // response - promise that fetch returns. response in a parameter to a function that returns the respose in object type (it was string before)
      .then(data => {  // data - response.json, data is the parameter of a function
        if (data.success) {
            alert('Signup successful');
        } else {
            alert('Signup failed: ' + data.message);
        }
        })


      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      });

      // NEED  TO SEND TO THE SERVER:
      //1. CHECK IF USER EXIST IN TABLE
      //2. IF NOT ADD TO DATABASE
  
      // Call signup function (to be implemented later)
      signup(username, password);

      //signupForm.submit();
    });
  


    // Function to handle login
    function login(username, password) {
      // Placeholder function for login logic (to be implemented later)
      alert('Logging in with username:', username, 'and password:', password);
    }
  
    // Function to handle signup
    function signup(username, password) {
      // Placeholder function for signup logic (to be implemented later)
      alert('Signing up with username:  '  + username +  '  and password: ' + password);
    }


  });
  
