# FrancePartage API

API pour la plateforme FrancePartage utilisant le framework NestJS

## Lancement de l'API (DEV)

- ```docker compose up dev```

## Lancement l'API (PROD)

- ```docker compose up prod```

## Lancement de Prisma Studio

- ```docker compose up prisma-studio```

## Todo

### Authentification

- [x] Inscription
- [x] Connexion
- [x] Deconnexion
- [x] Rafraichir les tokens
- [x] Récuperer les informations de l'utilisateur avec son token (/me)

### Utilisateurs

- [x] Changer son mot de passe
- [x] Changer ses informations (Nom d'utilisateur, Prénom, Nom)
- [x] Changer son avatar
- [x] Récuperer l'avatar d'un utilisateur
- [x] Récuperer les utilisateurs (Modérateur, Pagination, Recherche)
- [x] Changer le role d'un utilisateur (Admin)
- [x] Récuperer les informations d'un utilisateur
- [ ] Nombre de ressources dans l'utilisateur
- [ ] Nombre de relations dans l'utilisateur

### Ressources

- [x] Ajouter une ressource
- [x] Supprimer une ressource
- [x] Modifier une ressource
- [x] Récuperer une ressource
- [x] Récuperer des ressources (Pagination)
- [x] Mettre une ressource en favori
- [x] Enlever une ressource des favoris
- [x] Récuperer la liste des ressources favorites
- [ ] Lors de la récuperation des ressources par un utilisateur connecté, ajouté une variable pour savoir si l'utilisateur à liké ou pas
- [x] Ajouter une commentaire
- [x] Supprimer un commentaire
- [x] Lister les commentaires d'une ressource
- [x] Récuperer les ressources en attente d'approbation
- [x] Changer le statut d'une ressource (Modérateur)
- [x] Tags populaires
- [x] Récuperation des ressources par tag
- [x] Récuperer la couverture d'une ressource
- [x] Récuperer les ressources d'un utilisateur

### Relations

- [x] Envoyer une demande pour entrer en relation
- [x] Accepter une demande
- [x] Recuperer les demandes
- [x] Recuperer les relations d'un utilisateur
- [x] Paginer les relations d'un utilisateur
- [x] Refuser une demande
- [x] Annuler une demande
- [x] Supprimer une relation
- [x] Recuperer la relation avec un utilisateur
- [x] Suggestions d'utilisateurs avec lesquelles l'utilisateur n'est pas en relation