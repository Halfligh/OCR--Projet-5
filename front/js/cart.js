const cartItemsSection = document.getElementById("cart__items");

// Récupérer les données du panier dans le local storage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Petite vérification pour améliorer l'expéreince utilisateur
if (cart.length === 0) {
  const emptyCartMsg = document.createElement("p");
  emptyCartMsg.textContent = "Votre panier est vide";
  cartItemsSection.appendChild(emptyCartMsg);

  const orderForm = document.querySelector(".cart__order");
  if (orderForm) {
    orderForm.remove();
  }
} else {
  // Pour chaque élément du panier, créer les éléments HTML correspondants
  cart.forEach((item) => {
    fetch(`http://localhost:3000/api/products/${item.id}`)
      .then((response) => response.json())
      .then((productData) => {
        // Créer les éléments HTML correspondants
        const article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", item.id);
        article.setAttribute("data-color", item.color);

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("cart__item__img");

        const img = document.createElement("img");
        img.setAttribute("src", productData.imageUrl);
        img.setAttribute("alt", productData.description);
        imgDiv.appendChild(img);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("cart__item__content");

        const descDiv = document.createElement("div");
        descDiv.classList.add("cart__item__content__description");

        const h2 = document.createElement("h2");
        h2.textContent = productData.name;
        descDiv.appendChild(h2);

        const p1 = document.createElement("p");
        p1.textContent = item.color;
        descDiv.appendChild(p1);

        const p2 = document.createElement("p");
        p2.textContent = `${productData.price} €`;
        descDiv.appendChild(p2);

        const settingsDiv = document.createElement("div");
        settingsDiv.classList.add("cart__item__content__settings");

        const quantityDiv = document.createElement("div");
        quantityDiv.classList.add("cart__item__content__settings__quantity");

        const p3 = document.createElement("p");
        p3.textContent = "Qté : ";
        quantityDiv.appendChild(p3);

        const input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("class", "itemQuantity");
        input.setAttribute("name", "itemQuantity");
        input.setAttribute("min", "1");
        input.setAttribute("max", "100");
        input.setAttribute("value", item.quantity);
        quantityDiv.appendChild(input);

        //Vérification de la quantité si modification dans le panier
        function isValidQuantity(quantity) {
          return quantity >= 1 && quantity <= 100;
        }

        //Ajout de l'EventListener pour mettre à jour la quantité

        input.addEventListener("change", function (event) {
          const newQuantity = parseInt(event.target.value);

          const article = event.target.closest(".cart__item");
          const itemId = article.dataset.id;
          const itemColor = article.dataset.color;
          const cart = JSON.parse(localStorage.getItem("cart")) || [];

          // Vérifier que la quantité est valide
          if (!isValidQuantity(newQuantity)) {
            alert("Veuillez indiquer une quantité comprise entre 1 et 100");

            // Afficher une la dernière valeur acceptée dans le sens de la demande de l'utilisateur
            if (newQuantity <= 0) {
              event.target.value = 1;
            } else if (newQuantity > 100) {
              event.target.value = 100;
            }

            // Mettre à jour le local storage avec la dernière valeur acceptée
            cart.find(
              (item) => item.id === itemId && item.color === itemColor
            ).quantity = parseInt(event.target.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateTotalPrice(cart);
            return;
          }

          for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === itemId && cart[i].color === itemColor) {
              cart[i].quantity = event.target.value;
              break;
            }
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateTotalPrice(cart);
        });

        const deleteDiv = document.createElement("div");
        deleteDiv.classList.add("cart__item__content__settings__delete");

        const deleteP = document.createElement("p");
        deleteP.classList.add("deleteItem");
        deleteP.textContent = "Supprimer";
        deleteDiv.appendChild(deleteP);

        //Ajout de l'événement d'écoute pour la suppresion
        deleteP.addEventListener("click", function (event) {
          const article = event.target.closest(".cart__item");
          const productId = article.dataset.id;
          const productColor = article.dataset.color;
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === productId && cart[i].color === productColor) {
              cart.splice(i, 1);
              break;
            }
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          article.remove();
          if (cart.length === 0) {
            const emptyCartMsg = document.createElement("p");
            emptyCartMsg.textContent = "Votre panier est vide";
            cartItemsSection.appendChild(emptyCartMsg);
            document.querySelector(".cart__order").style.display = "none";
          }
          updateTotalPrice(cart);
        });

        // Ajouter tous les éléments créés à la section du panier
        settingsDiv.appendChild(quantityDiv);
        settingsDiv.appendChild(deleteDiv);
        contentDiv.appendChild(descDiv);
        contentDiv.appendChild(settingsDiv);
        article.appendChild(imgDiv);
        article.appendChild(contentDiv);
        cartItemsSection.appendChild(article);
      })
      .catch((error) => console.log(error));
  });
}

// Récupération des éléments DOM pour les spans
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

// Fonction qui calcule le prix total pour chaque produit dans le panier
async function getTotalPrice(cart) {
  let totalPrice = 0;

  // Boucle sur chaque produit dans le panier
  for (const item of cart) {
    // Appel fetch pour récupérer les informations du produit à partir de son ID
    const response = await fetch(
      `http://localhost:3000/api/products/${item.id}`
    );
    const product = await response.json();

    // Ajout du prix du produit au prix total, en tenant compte de sa quantité
    totalPrice += parseFloat(product.price) * parseInt(item.quantity);
  }

  // Mise à jour des spans avec les valeurs calculées
  const totalQuantity = cart.reduce(
    (acc, item) => acc + parseInt(item.quantity),
    0
  );
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Appel de la fonction pour calculer le prix total
getTotalPrice(cart);

async function updateTotalPrice() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;

  for (const item of cart) {
    const response = await fetch(
      `http://localhost:3000/api/products/${item.id}`
    );
    const product = await response.json();
    totalPrice += parseFloat(product.price) * parseInt(item.quantity);
  }

  const totalQuantity = cart.reduce(
    (acc, item) => acc + parseInt(item.quantity),
    0
  );
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Déclaration de la fonction qui permettra de vérifier le formulaire onBlur et onChange via les regex
function validateInput(inputElement, regex, regexUser, errorMsgElement) {
  if (!regex.test(inputElement.value) && inputElement.value) {
    errorMsgElement.textContent = `${regexUser}`;
    return false;
  } else {
    errorMsgElement.textContent = "";
    return true;
  }
}

//Déclaration des variables et regex pour la vérification du formulaire

// Récupération des champs de formulaire
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

// Récupération des champs d'erreurs
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Expressions régulières de validation
const firstNameRegex = /^[a-zA-Zà-ÿ]+$/;
const lastNameRegex = /^[a-zA-Zà-ÿ]+$/;
const addressRegex = /^(\d{1,3}\s)?[a-zA-Zà-ÿ\s'-]+$/; //Numéro de rue capturé ici 1 à 3 chiffre suivi d'un espace
const cityRegex = /^[a-zA-Zà-ÿ\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // début ni espace blanc ni arobase + arobase séparant la chaîne en deux parties + chaque partie contient au moins un caractère et pas d'espace + un point dans la deuxième partie

// Affichage Regex adapté à l'utilisateur
const firstNameRegexUser = "Le prénom ne doit que contenir que des lettres.";
const lastNameRegexUser = "Le nom de famille ne doit contenir que des lettres.";
const addressRegexUser =
  "L'adresse ne doit contenir que des lettres, des chiffres, des espaces, des apostrophes, des tirets et un éventuel numéro de rue (1 à 3 chiffres suivi d'un espace).";
const cityRegexUser =
  "La ville ne doit contenir que des lettres et des espaces.";
const emailRegexUser =
  "L'adresse email doit être au format valide (par exemple : john.doe@example.com).";

// Validation en temps réél des champs de formulaire - onInput

firstName.addEventListener("input", function () {
  validateInput(
    firstName,
    firstNameRegex,
    firstNameRegexUser,
    firstNameErrorMsg
  );
});

lastName.addEventListener("input", function () {
  validateInput(lastName, lastNameRegex, lastNameRegexUser, lastNameErrorMsg);
});

address.addEventListener("input", function () {
  validateInput(address, addressRegex, addressRegexUser, addressErrorMsg);
});

city.addEventListener("input", function () {
  validateInput(city, cityRegex, cityRegexUser, cityErrorMsg);
});

email.addEventListener("input", function () {
  validateInput(email, emailRegex, emailRegexUser, emailErrorMsg);
});

// Gestion de l'envoi du formulaire

const form = document.querySelector(".cart__order__form");

function validateForm() {
  // Vérification que tous les champs ont une valeur
  if (
    firstName.value.trim() === "" ||
    lastName.value.trim() === "" ||
    address.value.trim() === "" ||
    city.value.trim() === "" ||
    email.value.trim() === ""
  ) {
    alert("Veuillez remplir tous les champs.");
    return false;
  }

  // Re-Vérification finale que les données du formulaires sont correctes
  const isCorrect =
    validateInput(
      firstName,
      firstNameRegex,
      firstNameErrorMsg,
      firstNameRegexUser
    ) &&
    validateInput(
      lastName,
      lastNameRegex,
      lastNameErrorMsg,
      lastNameRegexUser
    ) &&
    validateInput(address, addressRegex, addressErrorMsg, addressRegexUser) &&
    validateInput(city, cityRegex, cityErrorMsg, cityRegexUser) &&
    validateInput(email, emailRegex, emailErrorMsg, emailRegexUser);

  if (!isCorrect) {
    alert("Le formulaire contient des erreurs.");
    return false;
  }

  return isCorrect;
}

// Déclaration de la fonction d'envoi du formulaire
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le formulaire de s'envoyer de manière classique

  // Re-Vérification finale que les données du formulaires sont correctes
  const isFormCorrect = validateForm();

  if (!isFormCorrect) {
    return;
  }

  // Regroupement des champs de formulaire validés, pour envoi des données
  const contact = {
    firstName,
    lastName,
    address,
    city,
    email,
  };

  //Liste des produits du panier
  const products = JSON.parse(localStorage.getItem("cart")).map(
    (item) => item.id
  );

  // Regroupement des données à envoyer
  const data = JSON.stringify({ contact, products });

  // Définition des options de la requête
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };

  // Envoi de la requête & suppression des clés/valeurs du local storage si réussite de la requête
  fetch("http://localhost:3000/api/products/order", options)
    .then((response) => response.json())
    .then((data) => {
      localStorage.clear();
      window.location.replace(`confirmation.html?id=${data.orderId}`);
    })
    .catch((error) => {
      console.log(error);
      alert("Une erreur est survenue lors de la requête");
    });
});
