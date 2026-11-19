/* ==========================================================
   CONFIGURATION — MODIFIE UNIQUEMENT CE FICHIER
   ==========================================================
   1) Remplace les valeurs entre guillemets.
   2) Ne supprime pas les guillemets ni les virgules.
   3) Enregistre, recharge la page : tout se met à jour.
   ========================================================== */

const CONFIG = {

  // ---- Le livre ----
  bookTitle:   "Trading à sens unique",
  authorName:  "TOJO",                 // <-- ton nom / pseudo
  priceUSD:    20,
  pagesCount:  "—",                    // ex: "148"

  // ---- Liens de paiement ----
  // PayPal : laisse "" tant que tu n'as pas de lien (le bouton sera masqué)
  paypalUrl:   "",

  // Boutons PayPal intelligents (carte + compte PayPal) — client ID public
  paypalClientId: "AZoGECifbHT7akZz8-7agYnYoaUyhre0MU8GBVpucOw_D7eoRnj4BLcO2j_JIqDKWsbRxQOajbD5iH2R",
  currency:       "USD",               // devise demandée à PayPal (USD, EUR…)

  // Stripe Payment Link (cartes bancaires) — laisse "" si tu n'en as pas
  stripeUrl:   "",

  // Gumroad / Lemon Squeezy (recommandé : paiement + livraison auto)
  gumroadUrl:  "",

  // Lien de téléchargement du PDF (page "merci")
  // ⚠️ N'héberge pas le PDF en accès public : utilise un lien non listé
  //    (Google Drive « toute personne disposant du lien », Dropbox, etc.)
  downloadUrl: "",

  // ---- Contact ----
  // Numéro WhatsApp au format international, sans + ni espaces
  whatsapp:    "261327936182",         // <-- ton numéro
  email:       "bertinfast@gmail.com", // <-- ton email

  // ---- Mobile Money (Madagascar) ----
  mvola:       "",
  orangeMoney: "+261 32 79 36 182",
  airtelMoney: "",

  // ---- Textes ----
  guaranteeDays: 7,

  // ---- Avis clients ----
  // Ajoute ici les VRAIS avis reçus (WhatsApp, email, réseaux sociaux).
  // Laisse la liste vide [] : le site affichera « Sois le premier à donner ton avis ».
  // Exemple :
  // reviews: [
  //   { name: "Rado", rating: 5, date: "2026-11-20",
  //     text: "Enfin un livre qui explique le risque simplement. J'ai revu toute ma façon de trader.",
  //     verified: true }
  // ],
  reviews: []
};

/* Ne touche pas à ce qui suit */
window.SITE_CONFIG = CONFIG;
