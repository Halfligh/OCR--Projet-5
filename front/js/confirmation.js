// Récupération de la chaîne de requête de l'URL
const queryString = window.location.search;

// Analyse des paramètres de la chaîne de requête
const urlParams = new URLSearchParams(queryString);

// Récupération de la valeur de l'ID de commande depuis les paramètres de l'URL
const orderId = urlParams.get("id");

// Affichage de l'ID de commande dans la page de confirmation
document.getElementById("orderId").textContent = orderId;
