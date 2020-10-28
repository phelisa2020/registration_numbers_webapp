const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const regFactory = require("./registration");

const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_registrations';
const pool = new Pool({
  connectionString
});

let app = express();
const regNo = regFactory(pool);

app.engine('handlebars', exphbs({layoutsDir: './views/layouts'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret : "<add a secret string here>",
    resave: false,
    saveUninitialized: true
  }));

  // initialise the flash middleware
  app.use(flash());

  app.get('/', function (req, res) {
    req.flash('info', 'Welcome now');
    res.render('index')
  });
  app.get('/addFlash', function (req, res) {
    req.flash('info', 'Flash Message Added');
    res.redirect('/');
  });

  app.get("/", async function (req, res) {
    res.render('index', {
      registrations: await regNo.getList()
    });
  });

  app.get("/registration", async function (req, res) {
    const town = req.query.town
    console.log(town );
    res.render('index', {
      regNumber: await regNo.regFilter(town),
     
    });
  });
 
  app.get("/deleteDb", async function (req, res) {
    await regNo.reset();
    res.redirect('/');
  });
  

app.post("/registration", async function(req, res) {

    const regN = req.body.regNumbers;
   
    await regNo.addRegNumber(regN);
   
    const regNos = await regNo.getList();

    res.render('index', {
        regNumber: regNos,
        
    });

});
  

const PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App started at port:', PORT);
})