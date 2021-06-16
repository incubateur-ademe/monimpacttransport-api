# API Mon Impact Transport

API alimentant l'app [Mon Impact Transport](https://monimpacttransport.fr/).

Accessible via https://api.monimpacttransport.fr

## /footprints

Retourne la liste des modes de transport avec leur impact calculé pour une distance (paramètre **km**) donnée.

### Exemples

    https://api.monimpacttransport.fr/beta/footprints?km=250

    https://api.monimpacttransport.fr/beta/footprints?km=250&filter=smart&sort=id&fields=emoji,description

### Paramètres

- **km**: Number (défaut: **1**)
 
  Distance en km utilisée pour le calcul de l'impact des modes de transport
  

- **filter**: String (défaut : **auto**)

  Mode de filtrage (n'est pas pris en compte si le paramètre **transportations** est défini)
  Valeurs possibles : 
    - **all** : renvoie l'ensemble des modes de transport (même ceux dont l'impact n'est pas connu) 
    - **smart** : renvoie les modes de transport pertinents pour la distance (pas d'avion en dessous de 500km par exemple) 
    - **auto** : renvoie les modes de transport dont l'impact est connu.

- **transportations**: Number[]

  ID des modes de transport à retourner, séparé par des virgules

- **ignoreRadiativeForcing**: Boolean (défaut: **false**)

  Si **true** l'api ignore l'impact des trainées ([forçage radiatif](https://fr.wikipedia.org/wiki/For%C3%A7age_radiatif)) dans son calcul de l'impact de l'avion

- **fields**: String[] (défaut: **id, name, footprint**)
 
  Détermine la liste des champs retournés par l'api.
  Valeurs possibles : 
  - **id** (toujours retourné) 
  - **source**
  - **name** (toujours retourné) 
  - **emoji** 
  - **description** 
  - **carpool** 
  - **footprint** (toujours retourné) 
  - **display**


- **sort**: String (défaut: **footprint**)

  Determine la propriété utilisée pour le classement.
  Valeurs possibles : 
  - **id**
  - **name**
  - **footprint**
