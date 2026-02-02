CREATE DATABASE IF NOT EXISTS gestion_utilisateurs
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gestion_utilisateurs;


CREATE TABLE IF NOT EXISTS utilisateur (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nom       VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL,
    telephone VARCHAR(30),
    entreprise VARCHAR(120),
    site_url  VARCHAR(255)
);

INSERT INTO utilisateur (nom, email, telephone, entreprise, site_url)
VALUES 
('Dongmo vaneck', 'vaneck.dongmo@saintjeaningenieur.org', '658534919', 'NEL SARL', 'https://dongmo-vaneck.cm');