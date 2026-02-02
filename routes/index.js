var express = require("express");
var router = express.Router();
var mysql = require("mysql2");

// Configuration de la connexion à la base de données
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "01mars&2004",
  database: "gestion_utilisateurs",
});

// Connexion à la base de données
db.connect(function (err) {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

// Page d'accueil → charge les utilisateurs
router.get("/", (req, res) => {
  const sql = "SELECT * FROM utilisateur";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur récupération utilisateurs:", err);
      return res.status(500).send("Erreur serveur");
    }

    res.render("index", {
      title: "Gestion des Utilisateurs",
      users: results,           // ← Ceci est très important !
    });
  });
});

/* POST : ajouter un utilisateur */
router.post("/add", function (req, res) {
  const { nom, email, telephone, entreprise, site_url } = req.body;

  if (!nom || !email) {
   
    return res.redirect("/?error=Nom et email sont obligatoires");

  }

  const sql =
    "INSERT INTO utilisateur (nom, email, telephone, entreprise, site_url) VALUES (?, ?, ?, ?, ?)";
  
  const values = [nom, email, telephone || null, entreprise || null, site_url || null];

  db.query(sql, values, function (err, result) {
    if (err) {
      console.error("Erreur lors de l'insertion :", err);
      
      // Redirection avec message d'erreur
      return res.redirect("/?error=Erreur lors de l'ajout de l'utilisateur");
      
    }

  
    res.redirect("/");
  });
});

/* GET : récupérer la liste des utilisateurs */
router.get("/users", function (req, res) {
  const sql = "SELECT * FROM utilisateur";

  db.query(sql, function (err, results) {
    if (err) {
      console.error("Erreur lors de la récupération :", err);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
});

module.exports = router;
