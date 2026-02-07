require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initDB() {
    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        // 1. Connexion sans base de données pour la créer si elle n'existe pas
        const connection = await mysql.createConnection(connectionConfig);
        const dbName = process.env.DB_NAME || 'gestion_utilisateurs';

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await connection.end();

        // 2. Connexion à la base de données spécifique
        const db = await mysql.createPool({
            ...connectionConfig,
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(`Connected to database: ${dbName}`);

        // 3. Création de la table utilisateur
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS utilisateur (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        telephone VARCHAR(30),
        entreprise VARCHAR(120),
        site_url VARCHAR(255)
      );
    `;
        await db.query(createTableQuery);
        console.log('Table "utilisateur" verified/created.');

        return db;
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

let dbPool;

// Routes
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM utilisateur');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/users', async (req, res) => {
    const { nom, email, telephone, entreprise, site_url } = req.body;

    if (!nom || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const sql = 'INSERT INTO utilisateur (nom, email, telephone, entreprise, site_url) VALUES (?, ?, ?, ?, ?)';
        const values = [nom, email, telephone || null, entreprise || null, site_url || null];
        const [result] = await dbPool.query(sql, values);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Error adding user' });
    }
});

// Start Server after DB init
initDB().then(pool => {
    dbPool = pool;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
