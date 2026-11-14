# Alunissage

Un jeu d'adresse : pilote un module spatial jusqu'au sol et pose-le en douceur sur l'une des plateformes, sans tomber en panne de carburant. Une partie, c'est 3 vies et un score qui s'additionne de mission en mission, à travers quatre mondes : la Lune, Mars et son vent, Europe et sa glace, un astéroïde et ses météores.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèche du haut** (ou **clic maintenu**) : moteur principal. Il pousse le module vers le haut et freine la chute.
- **Flèches gauche et droite** : propulseurs latéraux, pour glisser au-dessus de la bonne plateforme (et freiner sur la glace).
- **Espace**, **flèche du haut** ou un clic lance la mission, passe à la suivante ou réessaie après un crash. **P** met en pause.
- **Manette** : A ou la gâchette droite pour le moteur, la croix ou le stick pour les propulseurs, Start pour la pause.
- **Plein écran** : le bouton en haut à droite du jeu ; Échap pour en sortir.

## Une partie

- Tu as **3 vies**. Un crash en coûte une et tu recommences la même mission ; à 0, la partie est finie.
- Le score de chaque atterrissage **s'ajoute** à celui de la partie. Le record est celui de la meilleure partie.
- Tous les 5 missions, on change de monde, et **une vie de plus** est offerte (5 au maximum).

## Les mondes

- **La Lune** (missions 1 à 5) : la Terre dans le ciel, pas de surprise.
- **Mars** (6 à 10) : une gravité plus forte et du **vent** qui pousse le module. Les drapeaux des plateformes et la poussière montrent sa force et sa direction.
- **Europe** (11 à 15) : la lune glacée de Jupiter. Un module posé avec un peu de vitesse de côté **glisse** : freine avec les propulseurs avant de sortir de la plateforme.
- **Un astéroïde** (16 à 20) : une gravité faible, mais des **météores** tombent. Un « ! » rouge en haut de l'écran prévient d'où ils arrivent.
- Ensuite les mondes reviennent, avec une gravité plus forte.
- Dans chaque monde, à partir de la 3e mission, un **canyon** entoure la plateforme ×3 ; à partir de la 4e, la plateforme ×5 **flotte et va et vient**.

## Comment ça marche

- La gravité attire le module vers le sol en permanence. Le moteur principal la combat, les propulseurs déplacent le module de côté ; tous consomment du carburant (le moteur principal deux fois plus que les propulseurs).
- Le module part avec un réservoir plein. À sec, plus aucun moteur ne répond : le module tombe.
- Le **tableau de bord** affiche le carburant, les deux vitesses (verticale et horizontale) et l'**altitude**. Les vitesses passent **au vert** quand elles sont assez faibles pour se poser sans danger.
- Chaque mission propose **trois plateformes**, marquées ×2, ×3 et ×5 : plus la plateforme est petite, plus elle multiplie les points.
- Le module doit toucher le sol **entièrement sur une plateforme**, en descendant lentement et sans glisser de côté. Sinon c'est le crash, et le jeu dit pourquoi.

## Les points

Un atterrissage rapporte **50 points + 5 points par unité de carburant restant**, le tout multiplié par la plateforme choisie. Économiser le carburant et viser la petite plateforme ×5 rapporte le plus.

## Statistiques

Le panneau **Records** garde la meilleure partie, la partie en cours (score et vies), la mission la plus lointaine atteinte et le nombre d'atterrissages réussis.

## Données et synchronisation

La mission atteinte et le meilleur score sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Aucune autre autorisation, aucune connexion à Internet.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Alunissage → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
