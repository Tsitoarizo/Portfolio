# Portfolio Dynamique — Tsito Arizo

Portfolio converti en application **dynamique** : backend **Python (Flask)** + **Tailwind CSS** + **JavaScript** (rendu côté client via fetch API).

## Corrections / changements (côté DevOps)

- **Cadre violet supprimé** (`border: 1px solid rgba(126,86,255,.8)` sur `.page-shell`) : le site est maintenant **plein écran**, sans encadrement.
- **Code mort supprimé** : `counter.js` (boilerplate Vite jamais importé), `vite.svg`, `javascript.svg`.
- **Bouton langue 🇬🇧 non fonctionnel** → remplacé par un **vrai toggle FR/EN** (i18n complet, persistant via `localStorage`).
- **Filtres de projets** (`All / Frontend / Backend / Full Stack`) présents visuellement mais inertes → **filtrage réellement fonctionnel** en JS.
- **Contenu codé en dur** dans `main.js` → externalisé dans `data/portfolio.json`, servi par une API Flask (`/api/portfolio`), donc modifiable sans toucher au code.
- **Formulaire de contact** désormais fonctionnel : validation serveur (`POST /api/contact`), retour d'erreurs par champ, sauvegarde des messages dans `data/messages.json`.
- **Compteur de visites** côté serveur (`GET /api/stats`), preuve du dynamisme backend.
- **Tailwind CSS** en remplacement du CSS custom statique (identité visuelle sombre/cyan conservée).

## Structure

```
portfolio_app/
├── app.py                 # Backend Flask (routes + API)
├── requirements.txt
├── data/portfolio.json    # Toutes les données du site (FR/EN)
├── templates/index.html   # Coquille HTML + Tailwind (CDN)
└── static/
    ├── js/app.js           # Rendu dynamique + logique (fetch, i18n, filtres, formulaire)
    ├── css/custom.css      # Styles complémentaires à Tailwind
    └── favicon.svg
```

## Lancer le projet

```bash
cd portfolio_app
pip install -r requirements.txt
python3 app.py
```

Puis ouvrir : http://localhost:5000

## API

| Méthode | Route            | Description                                    |
|---------|------------------|-------------------------------------------------|
| GET     | `/api/portfolio` | Toutes les données du portfolio (FR/EN)          |
| GET     | `/api/stats`     | Compteur de visites (persisté en JSON)           |
| POST    | `/api/contact`   | Envoi du formulaire de contact (validé serveur)  |
