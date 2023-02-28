const cartItemsSection = document.getElementById('cart__items');

// Récupérer les données du panier dans le local storage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Pour chaque élément du panier, créer les éléments HTML correspondants
cart.forEach(item => {
  fetch(`http://localhost:3000/api/products/${item.id}`)
    .then(response => response.json())
    .then(productData => {
      // Créer les éléments HTML correspondants
      const article = document.createElement('article');
      article.classList.add('cart__item');
      article.setAttribute('data-id', item.id);
      article.setAttribute('data-color', item.color);

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('cart__item__img');

      const img = document.createElement('img');
      img.setAttribute('src', productData.imageUrl);
      img.setAttribute('alt', productData.description);
      imgDiv.appendChild(img);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('cart__item__content');

      const descDiv = document.createElement('div');
      descDiv.classList.add('cart__item__content__description');

      const h2 = document.createElement('h2');
      h2.textContent = productData.name;
      descDiv.appendChild(h2);

      const p1 = document.createElement('p');
      p1.textContent = item.color;
      descDiv.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = `${productData.price} €`;
      descDiv.appendChild(p2);

      const settingsDiv = document.createElement('div');
      settingsDiv.classList.add('cart__item__content__settings');

      const quantityDiv = document.createElement('div');
      quantityDiv.classList.add('cart__item__content__settings__quantity');

      const p3 = document.createElement('p');
      p3.textContent = 'Qté : ';
      quantityDiv.appendChild(p3);

      const input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('class', 'itemQuantity');
      input.setAttribute('name', 'itemQuantity');
      input.setAttribute('min', '1');
      input.setAttribute('max', '100');
      input.setAttribute('value', item.quantity);
      quantityDiv.appendChild(input);

      //Ajout de l'EventListener pour mettre à jour la quantité
      input.addEventListener('change', function(event) {
        const newQuantity = parseInt(event.target.value);
        if (newQuantity <= 0) {
          return;
        }
        const article = event.target.closest('.cart__item');
        const itemId = article.dataset.id;
        const itemColor = article.dataset.color;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === itemId && cart[i].color === itemColor) {
            cart[i].quantity = newQuantity;
            break;
          }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotalPrice(cart);
      });

      const deleteDiv = document.createElement('div');
      deleteDiv.classList.add('cart__item__content__settings__delete');

      const deleteP = document.createElement('p');
      deleteP.classList.add('deleteItem');
      deleteP.textContent = 'Supprimer';
      deleteDiv.appendChild(deleteP);

      //Ajout de l'événement d'écoute pour la suppresion 
      deleteP.addEventListener('click', function(event) {
        const article = event.target.closest('.cart__item');
        const productId = article.dataset.id;
        const productColor = article.dataset.color;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === productId && cart[i].color === productColor) {
            cart.splice(i, 1);
            break;
          }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        article.remove();
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
    .catch(error => console.log(error));
});

// Récupération des éléments DOM pour les spans
const totalQuantityElement = document.getElementById('totalQuantity');
const totalPriceElement = document.getElementById('totalPrice');

// Fonction qui calcule le prix total pour chaque produit dans le panier
async function getTotalPrice(cart) {
  let totalPrice = 0;

  // Boucle sur chaque produit dans le panier
  for (const item of cart) {
    // Appel fetch pour récupérer les informations du produit à partir de son ID
    const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
    const product = await response.json();
    
    // Ajout du prix du produit au prix total, en tenant compte de sa quantité
    totalPrice += parseFloat(product.price) * parseInt(item.quantity);
  }

  // Mise à jour des spans avec les valeurs calculées
  const totalQuantity = cart.reduce((acc, item) => acc + parseInt(item.quantity), 0);
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice.toFixed(2) + ' €';
}

// Appel de la fonction pour calculer le prix total
getTotalPrice(cart);


async function updateTotalPrice() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalPrice = 0;

  for (const item of cart) {
    const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
    const product = await response.json();
    totalPrice += parseFloat(product.price) * parseInt(item.quantity);
  }

  const totalQuantity = cart.reduce((acc, item) => acc + parseInt(item.quantity), 0);
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice.toFixed(2) + ' €';
}