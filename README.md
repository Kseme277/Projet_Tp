# Projet TP - Gestion des Utilisateurs

Ce projet a été refondu de A à Z avec une architecture séparée Client/Serveur.

## Structure du projet

- `backend/` : Serveur API Express utilisant MySQL.
- `frontend/` : Application React moderne (Vite) pour l'interface utilisateur.

## Prérequis

- Node.js installé.
- MySQL installé et démarré.
- La base de données `gestion_utilisateurs` configurée (voir `script.sql`).

## Installation

Pour installer toutes les dépendances (racine, backend et frontend) :

```bash
npm run install-all
```

## Lancement

Pour lancer le backend et le frontend simultanément :

```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:5000](http://localhost:5000)

## Fonctionnalités

- **Affichage** : Basculement entre vue Tableau et vue Grille.
- **Gestion** : Ajout d'utilisateurs via une fenêtre modale.
- **Export** : Impression de la liste et export au format PDF.
- **Design** : Interface modernisée tout en conservant les fonctionnalités d'origine.
