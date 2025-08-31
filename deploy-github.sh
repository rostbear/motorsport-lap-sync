#!/bin/bash

# 🏎️ Motorsport Lap Sync - GitHub Pages Deployment Script

echo "🚀 Iniziando deployment su GitHub Pages..."

# Verifica che git sia configurato
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Errore: Non sei in un repository git!"
    exit 1
fi

# Verifica che il remote origin esista
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Errore: Remote 'origin' non trovato!"
    echo "Configura il remote con: git remote add origin <url-github>"
    exit 1
fi

# Build dell'applicazione
echo "📦 Building dell'applicazione..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Errore durante il build!"
    exit 1
fi

echo "✅ Build completato!"

# Verifica se il branch gh-pages esiste
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "🔄 Branch gh-pages trovato, aggiornando..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "🆕 Creando nuovo branch gh-pages..."
    git checkout -b gh-pages
fi

# Rimuovi tutti i file esistenti (tranne .git)
git rm -rf . || true

# Copia i file di build
cp -r dist/* .

# Aggiungi tutti i file
git add .

# Commit
git commit -m "🚀 Deploy Motorsport Lap Sync - $(date)"

# Push
echo "📤 Push su GitHub..."
git push origin gh-pages

# Torna al branch main
git checkout main

echo "🎉 Deployment completato!"
echo "🌐 La tua app sarà disponibile su: https://<username>.github.io/<repository>"
echo "⏰ Potrebbero volerci alcuni minuti per essere visibile online."
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai su GitHub nel tuo repository"
echo "2. Settings → Pages"
echo "3. Source: Deploy from a branch"
echo "4. Branch: gh-pages, Folder: / (root)"
echo "5. Save"
