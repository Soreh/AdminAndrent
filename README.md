# AdminAndrent

****************************
**    VERSION 1.1 BÊTA    **  
****************************
   
Notes de version
----------------

Résolutions de bugs :
    - Le journal de log ne créé plus d'entrées vides
    - Modifier les remarques d'un location génèrent correctement un log automatique
    - Il n'est plus nécessaire de créer un client pour pouvoir faire un devis, comme attendu
    - Il n'est plus possible de créer un nouveau client sans nom ou sans adresse, comme attendu ; et l'ajout ou la modification d'un client depuis
    la page de la location, sauve automatiquement cette location.
    - La page du calcul du devis sauvegarde maintenant correctement le nombre d'unités de chaque option
    - La copie du calul dans le devis prend maintenant correctement en compte le nombre d'unités de chaque option

Ajouts de fonctionnalités & modifications :
    - Création du fichier ReadMe ;)
    - Ajout du nom de l'utilisateur connecté sur la page d'acceuil et dans le menu des locations, ainsi que la version de l'app
    - Amélioration de l'affichage du contact sur la page présentant le détail d'une location
    - Le numéro de téléphone et le mail du contact ne sont plus obligatoires pour créer une nouvelle location
    - La page des locations trie automatiquement ces dernières sur base de leur statut (demande, option, confirmé, terminée, annulée)
    - Après l'ajout d'une nouvelle location, l'utilisateur est directement redirigé vers les détails de cette location
    - Il est possible de lier un nouvel utilisateur avec une structure existante en base de données
    - Modification de l'aspect du journal de log (format date)
    - Amélioration de l'aspect de la page d'encodage du devis
    - Ajout de la possibilité d'ajouter une note sur la version imprimée du devis