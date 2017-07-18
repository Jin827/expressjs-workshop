var express = require('express');
var app = express();

var mysql = require('promise-mysql')
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'jin827', 
    password : '',
    database: 'reddit',
    connectionLimit: 10
  })

var RedditAPI = require('../reddit.js')
var myReddit = new RedditAPI(connection)


app.get('/posts', function (req, res) {
  //make a starter html string
  var postsList = `<h1>Posts from DB</h1> <ul>`;
  
  //grab data to insert into string
  myReddit.getAllPosts()
    .then( response => { 
      //response is my array of post data objects
      //need to iterate aka forEach
      response.forEach(post =>{//need to add to my previous string
      
      //add iterated string to our postsList
      postsList = postsList +`<li class="post-item">
                                <h2 class="post-item__title">
                                  <a href=${post.url}> ${post.title}</a>
                                </h2>
                                  <p>${post.user.username}</p>
                              </li>`
        
      })//end of forEach
      
       //add closing tags to string
    //console.log(postsList, "post list string")
    var postHTMLString = postsList + `</ul>`;
    
    //console.log(postHTMLString)
    //send html to front end
    res.send(postHTMLString)

    })//end of .then
});


app.get('/hello', function (req, res) {
  if(req.query.name === 'John'){
    res.send("<h1>Hello John!</h1>");
  }
  else {
    res.send("<h1>Hello World!</h1>")
  }
});

// http://reddit-jin827.c9users.io/hello?name=John

app.get('/calculator/:operation', function (req, res) {
  if(req.params.operation === 'add'){
    res.send( (req.query.num1) + (req.query.num2) + "" )
  }
  else if(req.params.operation === 'multiply'){
     res.send( (req.query.num1) * (req.query.num2) +""  )
  }
  else {
    res.status(400).send('0');
  }
});

// http://reddit-jin827.c9users.io/calculator/add/?num1=2&num2=5




/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
