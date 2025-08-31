# 🏎️ Motorsport Lap Sync - Guida al Deployment

## 📋 Prerequisiti
- Node.js 18+ installato
- Account su una piattaforma di hosting (Vercel, Netlify, GitHub Pages, etc.)

## 🚀 Opzioni di Deployment

### 1. **Vercel (Raccomandato)**
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. **Netlify**
```bash
# Installa Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. **GitHub Pages**
```bash
# Aggiungi al package.json
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### 4. **Firebase Hosting**
```bash
# Installa Firebase CLI
npm i -g firebase-tools

# Inizializza e deploy
firebase init hosting
firebase deploy
```

## 📁 File di Build
La cartella `dist/` contiene tutti i file necessari per il deployment:
- `index.html` - File principale
- `assets/` - CSS e JavaScript compilati
- `favicon.ico` - Icona del sito
- `robots.txt` - Configurazione SEO

## ⚙️ Configurazione del Server
Assicurati che il server web sia configurato per:
- Servire `index.html` per tutte le route (SPA)
- Abilitare la compressione GZIP
- Impostare le corrette header CORS se necessario

## 🔧 Variabili d'Ambiente
L'app non richiede variabili d'ambiente specifiche per il deployment.

## 📱 Test Post-Deployment
Dopo il deployment, verifica:
- ✅ Caricamento dei video
- ✅ Funzionalità keyframe
- ✅ Sincronizzazione video
- ✅ Responsive design
- ✅ Performance generale

## 🆘 Troubleshooting
- **404 su refresh**: Configura redirect a index.html
- **Video non caricano**: Verifica CORS e formati supportati
- **Performance lenta**: Abilita compressione e caching

## 📞 Supporto
Per problemi di deployment, controlla i log del server e verifica la configurazione.
