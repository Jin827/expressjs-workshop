var express = require('express');
var app = express();
var pug = require('pug')
var bodyParser = require('body-parser')

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

app.set('view engine', 'pug')


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
var num1 = +req.query.num1
var num2 = +req.query.num2
var op = req.params.operation

if(op !== 'add' && op !== 'multiply'){
  res.status(400).json({error: "operation must be one of add or multiply"}) // send error with JSON -> TO be consistant !
  return;     // Important ! otherwise it will kepp running.
}

var response = { 
                 operation: op,
                 firstOperand: num1,   // + : string -> number
                 seconsOperand: num2,
                 solution: op === 'add'? num1 + num2 : num1 * num2 
                }
  res.json(response);
}); 
// http://reddit-jin827.c9users.io/calculator/add/?num1=2&num2=5




// app.get('/posts', (req, res) => {
  
//   //make a starter html string
//   var postsList = `<h1>Posts from DB</h1> <ul>`;
  
//   //grab data to insert into string
//   myReddit.getAllPosts()
//     .then( response => { 
//       //response is my array of post data objects
//       //iterate response and build HTML 
//       response.forEach(post =>{//need to add to my previous string
      
//       //add iterated string to our postsList
//       postsList = postsList +`<li class="post-item">
//                                 <h2 class="post-item__title">
//                                   <a href=${post.url}> ${post.title}</a>
//                                 </h2>
//                                   <p>${post.user.username}</p>
//                               </li>`
        
//       })//end of forEach
      
//     //add closing tags to string
//     //console.log(postsList, "post list string")
//     var postHTMLString = postsList + `</ul>`;
    
//     //console.log(postHTMLString)
//     //send html to front end('client')
//     res.send(postHTMLString)

//     })//end of .then
// });


// retrieves the contents of the posts table of reddit database 
// using the getAllPosts function
app.get('/posts', (req, res) => {
  myReddit.getAllPosts()
  .then(result => {
    res.render('post-list',{posts: result})
  })
});




app.get('/new-post', (req, res) => {
  res.send(
  `<form action="/createPost" method="POST">
  <p>
    <input type="text" name="url" placeholder="Enter a URL to content">
  </p>
  <p>
    <input type="text" name="title" placeholder="Enter the title of your content">
  </p>
  <button type="submit">Create!</button>
</form>`)
});

// app.get('/new-post', (req, res) => {
//   res.render('new-post-form')
// })



app.post('/creatPost', bodyParser.urlencoded({extended:false}), function (req,res){ 
    console.log(req.body);
    
    myReddit.createPost({
      userId : 1,
      title : req.body.title,
      url : req.body.url,
      subredditId : 1
    });
    
  res.redirect("/posts")
})



app.get('/createContent', (req, res) => {
  res.render('create-content');
})




/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */
// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});


// http://reddit-jin827.c9users.io



