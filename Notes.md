Step :

    1) Mise la forme, cards de réponse (emoji, espacement, autres) -ok

    2) Réussite / echec critique sur d20 -ok

    3) pool de string random pour tirage au sort -ok

    4) symbole -ok

    5) Problème whitespace randomString -ok

    6) Default error message -ok

    7) Permettre plusieurs option sur le même lancé de dès -ok

    8) Rellier le bot a l'api dungeon&dragon pour avoir des info en temps réel sans devoir aller sur un navigateur
    (Mettre en place, spell by class & lvl, mettre en place le search global)

    9) Déploiment sur aws

*** JDR advices *** 
**Custom roll to do:**
+ 1 param qui donne la moyenne -done

+ 1 param pour un seuille de réussite -done

+ 1 param pour établire un reroll ()

+ 1 param pour les dés explosifs (voir google)

+ 1 param qui donne une systeme de poids

+ 1 param de roll & keep (régle forcé, example tu es obliger de garder une certaine face)

Later :

- Passer les symbole de calcul en variable (sauve des ligne dans roll.js 'include +,-')

- BDD, super interéssant : systeme de dés custom ou de lancer pré-établie, de listes de correspondance custom


-----------------------------------------------------------
*** Note API ***

- Live API : https://api.open5e.com/
- Documentation API : https://open5e.com/api-docs

- Example, url params :

https://api.open5e.com/spells/?slug__in=
&slug__iexact=&slug=&name__iexact=
&name=&level__iexact=
&level=
&level__in=
&level_int__iexact=
&level_int=
&level_int__range=
&school__iexact=
&school=
&school__in=
&duration__iexact=
&duration=
&duration__in=
&components__iexact=
&components=
&components__in=
&concentration__iexact=
&concentration=
&concentration__in=
&casting_time__iexact=
&casting_time=
&casting_time__in=
&dnd_class__iexact=
&dnd_class=
&dnd_class__in=
&dnd_class__icontains=Bard
&document__slug__iexact=
&document__slug=
&document__slug__in=