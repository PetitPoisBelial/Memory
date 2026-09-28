MEMORY PHOENIX vs T-REX — VERSION PWA CHIFFREE

DEMO :
- PIN de démonstration : 1234
- Le fichier data/words.enc fourni contient uniquement une liste de démonstration chiffrée.

AVANT PUBLICATION :
1. Utilise l'outil privé encrypt.html fourni séparément.
2. Choisis ton propre PIN à 4 chiffres et ta vraie liste.
3. Télécharge le nouveau words.enc.
4. Remplace data/words.enc par ton fichier.
5. Publie ce dossier sur GitHub Pages.
6. Ne publie JAMAIS encrypt.html avec le jeu.

Le PIN n'est pas stocké dans le jeu.
Les mots ne sont pas stockés en clair.
Le PIN sert à dériver la clé AES qui déchiffre data/words.enc.

LIMITATION :
Un PIN de 4 chiffres n'a que 10 000 possibilités. PBKDF2 ralentit les essais, mais ce système
est destiné à masquer/protéger un petit jeu personnel, pas à stocker des secrets sensibles.
