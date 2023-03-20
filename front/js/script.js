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
