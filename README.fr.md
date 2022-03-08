# bezier-demo

[English version](https://github.com/SuperDelphi/bezier-demo/blob/master/README.md)

Ceci est un éditeur minimaliste pour créer des courbes de Bézier sur un canevas HTML. Vous pouvez accéder à une version en ligne [ici](https://frenchforge.fr/bezier).

*Remarque : Cet outil a uniquement été créé dans un but éducatif. Il est juste fait pour ajouter... des courbes, quoi. C'est tout.*

## Comment utiliser l'éditeur

### Accéder à l'application

1. Téléchargez le contenu du dépôt.
2. Ouvrez le fichier ``index.html`` dans votre navigateur web préféré *(vous n'avez pas besoin d'un serveur web)*.
3. Et voilà !

### Créer une courbe

Par défaut, l'éditeur utilise l'*outil Plume*, qui vous permet de créer des [courbes de Bézier](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) sur le canevas.

Pour créer une courbe, faites simplement un clic gauche (sans relâcher le bouton), faites glisser la souris puis lâchez le bouton. Vous venez ainsi d'ajouter :
- Le point de départ de la courbe
- Le premier point de contrôle (signalé par la poignée bleue), donnant l'allure à la courbe.

Enfin, pour terminer la courbe, répétez l'opération une dernière fois (clic gauche, faire glisser puis relâcher).

*Remarque : Si la position ou la forme de la courbe ne vous convient pas, vous pouvez faire un clic droit à n'importe quel moment avant de terminer la courbe pour annuler l'opération.*

### Créer une ligne

Avec l'*outil Plume*, faites simplement un clic gauche sans faire glisser la souris, puis faites un autre clic gauche autre part pour terminer la ligne.

*Remarque : En réalité, ce qu'il se passe vraiment c'est que vous créez une courbe de Bézier dont les points de contrôle se situent au même endroit que les points de début et de fin de la courbe, donnant ainsi une ligne.*

### Modifier une courbe

L'*outil Sélection* vous permet de modifier les points d'une courbe. Pour ce faire, assurez-vous avant d'avoir sélectionné l'outil en cliquant sur le bouton "Select tool".

Pour modifier l'emplacement d'un point, faites simplement un clic gauche puis faites-le glisser à l'emplacement souhaité.

*Remarque : Pour le moment, il n'est pas possible de déplacer les points de contrôle.*
