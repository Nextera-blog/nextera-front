# --- STAGE 1: Build Application ---
# Utilise une image Node.js Alpine pour la compilation, plus légère.
FROM node:22-alpine AS builder

# Définit le répertoire de travail dans le conteneur.
WORKDIR /app

# Copie package.json et package-lock.json (ou yarn.lock) pour optimiser le cache Docker.
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
FROM nginx:alpine

# Copie les fichiers de build du stage 'builder' vers le répertoire de service de Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Optionnel : Si vous utilisez react-router-dom et avez besoin de rediriger toutes les requêtes vers index.html,
# vous pouvez ajouter une configuration Nginx personnalisée ici.
# Pour le moment, nous n'en avons pas besoin pour une démo de base.
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port par défaut de Nginx (port web standard).
EXPOSE 80

# Commande par défaut pour démarrer Nginx.
CMD ["nginx", "-g", "daemon off;"]