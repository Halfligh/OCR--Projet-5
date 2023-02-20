const itemsSection = document.getElementById("items");
    
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


const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

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