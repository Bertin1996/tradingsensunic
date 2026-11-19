# Site de vente — « Trading  unique »

Site statique complet (HTML / CSS / JS), sans base de données, prêt à héberger.
Prix : **5 $** · Livraison : **PDF**.

---

## 1. Structure

```
site-livre-trading/
├── index.html          → page de vente
├── merci.html          → page affichée après paiement (téléchargement)
├── assets/
│   ├── style.css       → design
│   ├── config.js       → ⚙️ TOUS tes réglages (à modifier)
│   ├── app.js          → logique (ne pas toucher)
│   └── cover.png       → image de partage (réseaux sociaux)
└── README.md
```

---

## 2. Configuration (5 minutes)

Ouvre **`assets/config.js`** et remplis :

| Champ | Exemple | Obligatoire |
|---|---|---|
| `authorName` | `"Jean Rakoto"` | ✅ |
| `paypalUrl` | `https://www.paypal.com/paypalme/jeanrakoto/20` | ✅ (ou Stripe/Gumroad) |
| `stripeUrl` | `https://buy.stripe.com/xxxx` | si tu veux les cartes |
| `gumroadUrl` | `https://tonnom.gumroad.com/l/xxxx` | ⭐ recommandé |
| `whatsapp` | `261341234567` (sans `+`) | ✅ |
| `email` | `contact@tonsite.com` | ✅ |
| `mvola` / `orangeMoney` / `airtelMoney` | `034 12 345 67` | si Mobile Money |
| `downloadUrl` | lien non listé vers le PDF | ✅ |
| `pagesCount` | `148` | recommandé |

Les prix (`data-price`) et la garantie se mettent à jour automatiquement partout.

---

## 3. Choisir le mode de paiement

### Option A — Gumroad / Lemon Squeezy ⭐ (le plus simple)

Ils gèrent **paiement + livraison automatique du PDF + factures + TVA**.

1. Crée un produit à 5 $, upload le PDF.
2. Copie le lien du produit dans `gumroadUrl`.
3. Terminé : le bouton principal envoie directement chez eux.

### Option B — PayPal (boutons intégrés) ✅ déjà configuré

Le site affiche les **boutons PayPal intelligents** (carte bancaire + compte PayPal),
directement dans la carte de prix.

- Le `paypalClientId` est déjà renseigné dans `assets/config.js`.
- Un **client ID est public** : il peut rester dans le code, ce n'est pas un secret.
- Devise : `currency: "USD"` → 5 $. Les symboles affichés (`$`, `USD`) suivent
  automatiquement ce réglage (`EUR`, `GBP`, `MGA`…).
- Après paiement, le client est redirigé vers `merci.html`.

⚠️ **À savoir :**

1. Les boutons PayPal **ne fonctionnent qu'en http/https** (pas en `file://`).
   Teste via Netlify ou `python -m http.server 8765` dans le dossier.
2. Si PayPal refuse la devise (`currency not supported`), passe `currency`
   à `"EUR"` : le site affichera automatiquement `5 €`.
3. `createOrder` + `capture` côté navigateur : simple et suffisant pour un
   ebook, mais la page `merci.html` reste accessible par URL directe.
   Pour une livraison réellement protégée → Gumroad (option A).
4. Vérifie que ton compte PayPal peut **recevoir** des paiements (les comptes
   PayPal de Madagascar ne peuvent en général que payer, pas encaisser).
   Fais un test réel à 1 $ avant de lancer la campagne.

### Option C — Stripe Payment Link

1. Stripe → Paiements → Créer un lien de paiement (5 USD).
2. Dans les réglages du lien, mets l'URL de confirmation :
   `https://tonsite.com/merci.html`
3. Colle le lien dans `stripeUrl`.

### Option D — Mobile Money (Madagascar)

Les boutons WhatsApp sont déjà prêts : le client clique, le message
« je souhaite acheter… » s'écrit tout seul, tu envoies le numéro MVola /
Orange / Airtel, il paie, tu envoies le PDF.

---

## 4. Protéger le PDF

⚠️ **Ne mets jamais le PDF en accès public** sur ton site : n'importe qui
pourrait le télécharger gratuitement.

Bonnes pratiques :

- Héberge-le sur **Google Drive** avec « Toute personne disposant du lien »,
  et colle ce lien dans `downloadUrl` (lien non listé = non indexé).
- Ou envoie-le manuellement après paiement (PayPal / Mobile Money).
- La page `merci.html` est en `noindex`, mais elle reste accessible si
  quelqu'un connaît l'URL : c'est une protection *légère*, pas un vrai
  contrôle d'accès. Pour du sérieux : Gumroad gère ça pour toi.

---

## 5. Publier le site (gratuit)

### Méthode la plus rapide — Netlify Drop

1. Va sur **https://app.netlify.com/drop**
2. Glisse le dossier `site-livre-trading` entier dans la page.
3. Tu obtiens une URL du type `https://ton-site.netlify.app` en 30 secondes.
4. (Optionnel) `Domain settings` → ajoute ton nom de domaine (≈ 10 €/an).

### GitHub Pages

1. Crée un dépôt public, pousse les fichiers.
2. `Settings → Pages → Branch: main → /root`.
3. URL : `https://tonpseudo.github.io/nom-du-depot/`.

### Vercel

`https://vercel.com/new` → importe le dossier → Deploy.

### Hébergement classique (cPanel)

Envoie le contenu du dossier dans `public_html` via FTP. Aucun PHP/MySQL requis.

> Le site est 100 % statique : il fonctionne même ouvert en double-clic
> sur `index.html` (mode local).

---

## 6. À personnaliser avant publication

- [ ] `assets/config.js` rempli (aucun `TONCOMPTE` / `261340000000` restant)
- [ ] `authorName` remplacé partout
- [ ] **Sommaire** (`index.html`, section « Le sommaire ») : remplace les 6
      chapitres d'exemple par le vrai sommaire du livre
- [ ] **« Ce que tu vas apprendre »** : adapte aux vrais chapitres
- [ ] `pagesCount` renseigné
- [ ] `cover.png` remplacé par la vraie couverture (1200×630 px)
- [ ] Textes de la garantie validés (c'est **ton** engagement commercial)
- [ ] Mentions légales complétées (nom, adresse, contact)
- [ ] Test du parcours complet sur mobile

---

## 7. Points juridiques (à ne pas négliger)

- **Aucune promesse de gain** n'apparaît sur le site : garde cette règle.
  Les mentions de risque sont déjà en pied de page.
- **Produit numérique** : précise les conditions de remboursement
  (la garantie 7 jours est déjà annoncée, à honorer).
- Si tu vends depuis Madagascar à des clients étrangers, vérifie les règles
  de TVA de Gumroad/Stripe (ils gèrent souvent ça pour toi).
- Garde une trace des ventes (email + reçu) pour le service client.

---

## 8. Support

En cas de doute sur un réglage : ouvre `assets/config.js`, tout est commenté.
Le site n'utilise aucune librairie externe — il se charge même hors ligne.
