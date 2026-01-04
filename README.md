
# Lancer le serveur postgresql sur codespaces
sudo service postgresql start

# Commande serveur Backend (ne pas oublier de passer le port en public)
node ./src/index.js

# Commande accès DB 
psql -U cedriclellis -h localhost -d demoapps -p 5432

