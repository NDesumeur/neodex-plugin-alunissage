# Alunissage

Un jeu d'adresse : pilote un module lunaire jusqu'au sol et pose-le en douceur sur l'une des plateformes, sans tomber en panne de carburant. Chaque mission réussie en ouvre une plus difficile, avec une gravité un peu plus forte.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèche du haut** (ou **clic maintenu**) : moteur principal. Il pousse le module vers le haut et freine la chute.
- **Flèches gauche et droite** : propulseurs latéraux, pour glisser au-dessus de la bonne plateforme.
- **Espace** ou un clic lance la mission ; après un atterrissage, un clic passe à la mission suivante ; après un crash, un clic réessaie.

## Comment ça marche

- La gravité attire le module vers le sol en permanence. Le moteur principal la combat, les propulseurs déplacent le module de côté ; tous consomment du carburant (le moteur principal deux fois plus que les propulseurs).
- Le module part avec un réservoir plein. À sec, plus aucun moteur ne répond : le module tombe.
- Le **tableau de bord** affiche le carburant et les deux vitesses, verticale et horizontale. Elles passent **au vert** quand elles sont assez faibles pour se poser sans danger.
- Chaque mission propose **trois plateformes plates**, marquées ×2, ×3 et ×5 : plus la plateforme est petite, plus elle multiplie les points.
- Le module doit toucher le sol **entièrement sur une plateforme**, en descendant lentement et sans glisser de côté. Sinon c'est le crash, et le jeu dit pourquoi : pas sur une plateforme, trop vite vers le bas ou trop vite de côté.
- À chaque mission réussie, la gravité augmente de 8 %.

## Les points

Un atterrissage rapporte **50 points + 5 points par unité de carburant restant**, le tout multiplié par la plateforme choisie. Économiser le carburant et viser la petite plateforme ×5 rapporte le plus.

## Statistiques

Le panneau **Records** garde le meilleur score, la mission la plus lointaine atteinte et le nombre d'atterrissages réussis.

## Données et synchronisation

La mission atteinte et le meilleur score sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Aucune autre autorisation, aucune connexion à Internet.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Alunissage → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
