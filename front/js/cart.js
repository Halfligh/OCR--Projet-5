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

      const deleteDiv = document.createElement('div');
      deleteDiv.classList.add('cart__item__content__settings__delete');

      const deleteP = document.createElement('p');
      deleteP.classList.add('deleteItem');
      deleteP.textContent = 'Supprimer';
      deleteDiv.appendChild(deleteP);

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
