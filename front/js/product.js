//Création de la section 'items' affiché sur l'index

const itemsSection = document.getElementById("items");
    
//Appel à l'api pour récupérer l'ensemble des produits

fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
      const article = document.createElement("article");
      const link = document.createElement("a");
        link.setAttribute("href", `./product.html?id=${product._id}`);
      const image = document.createElement("img");
        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.name);
      const productName = document.createElement("h3");
        productName.classList.add("productName");
        productName.textContent = product.name;
      const productDescription = document.createElement("p");
        productDescription.classList.add("productDescription");
        productDescription.textContent = product.description;

      link.appendChild(article);
      article.appendChild(image);
      article.appendChild(productName);
      article.appendChild(productDescription);
      itemsSection.appendChild(link);
    });
  });

//Récupération de l'id du produit séléctionné via onClick via l'URL

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

//Appel fetch à l'api sur la page product pour un produit unique

fetch(`http://localhost:3000/api/products/${productId}`)
  .then(response => response.json())
  .then(product => {
    // Mettre à jour les éléments HTML avec les détails du produit
    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;
    
    // Mettre à jours l'élément HTML correspondant à l'image et son alt
    const image = document.getElementById('image');
    image.setAttribute('src', product.imageUrl);
    image.setAttribute('alt', product.name);

    // Ajouter les options de couleur à la liste déroulante
    const colorsSelect = document.getElementById('colors');
    product.colors.forEach(color => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      colorsSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Une erreur s\'est produite :', error);
  });


  //Création d'un tableau vide dans le LocalStorage si il n'y pas déjà un panier
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', '[]');
  }

  //Fonction permettant de vérifier que la quantité d'un produit ajouté est dans le bon interval / Réutiliséé dans cart.js
  function isValidQuantity(quantity) {
    return quantity >= 1 && quantity <= 100;
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    //Récupération de la couleur sélectionnée par l'utilisateur
    const colorElement = document.getElementById('colors');
    const selectedColor = colorElement.value;
  
    //Récupération de la quantité sélectionnée par l'utilisateur
    const quantityElement = document.getElementById('quantity');
    const selectedQuantity = parseInt(quantityElement.value);
  
    // Vérifier que le produit a bien une couleur qui est différente de 0 
    if (selectedColor === "") {
      alert('Veuillez renseigner une couleur pour ajouter ce produit au panier');
    } else {
      // Vérifier que la quantité est comprise entre 1 et 100
      if (!isValidQuantity(selectedQuantity)) {
        alert('Veuillez indiquer une quantité comprise entre 1 et 100');
      } else {
        let found = false;
        // Parcourir le tableau cart pour vérifier si le produit est déjà présent
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === productId && cart[i].color === selectedColor) {
            cart[i].quantity = parseInt(cart[i].quantity) + selectedQuantity;
            found = true;
            break;
          }
        }
        // Si le produit n'a pas été trouvé, l'ajouter au panier
        if (!found) {
          const newItem = {
            id: productId,
            color: selectedColor,
            quantity: selectedQuantity,
          };
          cart.push(newItem);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  }
  


   
