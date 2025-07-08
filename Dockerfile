# --- STAGE 1: Build Application (pour la compilation des assets de production) ---
# Utilise une image Node.js Alpine pour la compilation, plus légère.
FROM node:22-alpine AS builder

# Définit le répertoire de travail dans le conteneur.
WORKDIR /app

# Copie package.json et package-lock.json pour optimiser le cache Docker.
# Si ces fichiers ne changent pas, npm install ne sera pas relancé.
COPY package.json package-lock.json ./

# Installe les dépendances npm.
RUN npm install

# Copie le reste du code source de l'application React.
COPY . .

# Déclare un argument de build pour l'URL de l'API.
# Cette valeur sera passée lors de la commande docker build ou par docker-compose.
ARG VITE_API_URL
# Définit une variable d'environnement dans l'image pour le build Vite.
ENV VITE_API_URL=${VITE_API_URL}

# Exécute la construction de l'application React.
# Votre script "build" dans package.json doit gérer cela.
RUN npm run build

# --- STAGE 2: Serve Application with Nginx (pour la production/démo) ---
# Utilise une image Nginx légère pour servir les fichiers statiques de l'application.
# Nomme ce stage pour y faire référence
FROM nginx:alpine AS production-stage

# Copie les fichiers de build du stage 'builder' vers le répertoire de service de Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port par défaut de Nginx (port web standard).
EXPOSE 80

# Commande par défaut pour démarrer Nginx.
CMD ["nginx", "-g", "daemon off;"]

# --- STAGE 3: Environnement de Développement (pour `docker-compose.dev.yml`) ---
# Cette étape est utilisée spécifiquement pour le développement avec Vite.
# Elle a besoin de Node.js et npm pour exécuter le serveur de développement.
# Nomme ce stage pour y faire référence dans docker-compose.dev.yml
FROM node:22-alpine AS development-stage

# Définit le répertoire de travail dans le conteneur.
WORKDIR /app

# Copie package.json et package-lock.json et installe les dépendances.
# C'est nécessaire car les modules Node ne sont pas copiés depuis le stage 'builder' par défaut
# et le volume mount recouvrira le code source.
COPY package.json package-lock.json ./
RUN npm install

# Copie tout le code source de l'application.
# Notez que ce COPY sera ensuite "recouvert" par le volume mount
# spécifié dans docker-compose.dev.yml pour permettre le hot-reloading.
COPY . .

# Expose le port par défaut de Vite pour le serveur de développement.
# C'est le port 3000 que Vite écoutera à l'intérieur du conteneur.
EXPOSE 3000

# La commande par défaut pour cette image sera de lancer le serveur de développement Vite.
# Cette commande sera exécutée si aucune autre commande n'est spécifiée par docker-compose.
# Dans notre cas, `docker-compose.dev.yml` définit aussi `command: npm run dev`,
# mais c'est une bonne pratique de l'avoir ici aussi.
CMD ["npm", "run", "dev"]