var express = require("express");
var createError = require("http-errors");
var http = require("http");
var path = require("path");

var app = express();
var server = http.createServer(app);

var indexRouter = require("./routes/index");

//  Moteur de vue
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
//  Middlewares indispensables
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  Routes
app.use("/", indexRouter);

//  Gestion 404
app.use(function (req, res, next) {
  next(createError(404));
});


// Utilisation de la variable d'environnement PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});


module.exports = { app, server };
