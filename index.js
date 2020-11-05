const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const regFactory = require("./registration");
const routesFac = require("./routes");

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
const reg = routesFac(regNo)

app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.get('/', reg.welcomeFlash);

app.get('/addFlash', reg.addedFlash);

app.get("/", reg.listReg);

app.get("/registration", reg.filtering);

app.get("/deleteDb", reg.clear);

app.post("/registration", reg.addingPlate);

const PORT = process.env.PORT || 3090;
app.listen(PORT, function () {
  console.log('App started at port:', PORT);
})