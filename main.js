async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {
    
    const productsHTML = document.querySelector(".products");

    let html = "";
    
        for (const product of db.products) {
            const buttonAdd = product.quantity
            ? `<i class='bx bx-plus'id='${product.id}'></i>` 
            : "<span class='soldOut'>Agotado👎</span>"
        html += `
            <div class="product">
               <div class="product_img">
                  <img src="${product.image}" alt"imagen" />
               </div>
              <div class="product_info">
                  <h4>${product.name} | <span><b>Stock</b>: ${product.quantity}</span></h4>
                  <h5>
                    $${product.price}
                    ${buttonAdd}
                  </h5>
              </div>
                
            </div>
            `;
        }

        productsHTML.innerHTML = html;
}

function handleShowCart() {
    const iconCartHTML = document.querySelector('.bx-cart');
    const cartHTML = document.querySelector('.cart');
  
    iconCartHTML.addEventListener("click", function () {
        cartHTML.classList.toggle("cart_show");
    });
}

function addRToCartfromProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
       if (e.target.classList.contains("bx-plus")) {
           const id = Number(e.target.id);
  
           const productFind = db.products.find(
               (product) => product.id === id
          );
  
          if (db.cart[productFind.id]) {
              if (productFind.quantity === db.cart[productFind.id].amount)
                  return alert("No hay más Disponibles☹️");
  
             db.cart[productFind.id].amount++ ;   
          } else {
              db.cart[productFind.id] = { ...productFind, amount: 1 };
          }
  
          window.localStorage.setItem("cart", JSON.stringify(db.cart));
          printProductsInCart(db);
          printTotal(db);
          handlePrintAmountProducts(db);
       }
    });
}

function printProductsInCart(db) {
    const cartProducts = document.querySelector(".cart_products");

    let html = "";
  
    for (const product in db.cart) {
      const { quantity, price, name, image, id, amount } = db.cart[product];
  
      html += `
      <div class="cart_product">
        <div class="cart_product--img">
           <img src="${image}" alt="imagen" />
        </div>
         <div class="cart_product--body">
            <h4>${name} | $${price}</h4>
            <p>Stock: ${quantity}</p>
              
            <div class="cart_product--body-op" id='${id}'>
              <i class='bx bx-minus'></i>
            <span>${amount} unit</span>
              <i class='bx bx-plus'></i>
              <i class='bx bx-trash'></i>
            </div>
        </div>   
      </div>
      `;
    }
  
     cartProducts.innerHTML = html;
}

function handleProductsInCart(db) {
    const cartProducts = document.querySelector(".cart_products");

    cartProducts.addEventListener("click", function (e) {
       if (e.target.classList.contains("bx-plus")) {
          const id = Number(e.target.parentElement.id);
  
          const productFind = db.products.find(
              (product) => product.id === id
          );
  
          if (productFind.quantity === db.cart[productFind.id].amount)
              return alert("No hay más Disponibles☹️")
  
          db.cart[id].amount++;
       }
  
       if (e.target.classList.contains("bx-minus")) {
          const id = Number(e.target.parentElement.id);
          if ( db.cart[id].amount === 1) {
              const response = confirm(
                  'Estas seguro de quitar este producto 😭'
              );
              if (!response) return;
              delete db.cart[id];
          } else {
              db.cart[id].amount--;
          }
       }
  
       if (e.target.classList.contains("bx-trash")) {
          const id = Number(e.target.parentElement.id);
          // const response = confirm(
          //     'Estas seguro de quitar este producto 😭'
          // );
          // if (!response) return;
          delete db.cart[id];
       }
  
       window.localStorage.setItem('cart', JSON.stringify(db.cart))
       printProductsInCart(db);
       printTotal(db);
       handlePrintAmountProducts(db);
    });
}

function printTotal(db) {
    const infoTotal = document.querySelector(".info_total");
    const infoAmount = document.querySelector(".info_amount");
  
    let totalProducts = 0;
    let amountProducts = 0;
  
    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }
  
    infoAmount.textContent = amountProducts + " units";
    infoTotal.textContent = "$" + totalProducts + ".00";
}

function handleTotal(db) {
    const btnBuy = document.querySelector(".btn_buy");

    btnBuy.addEventListener("click", function () {
      if(!Object.values(db.cart).length) 
         return alert('No has agreagado nada 🤔');
  
      const response = confirm('Estas listo para tu compra😊');
      if (!response) return;
  
      const currentProducts = [];
  
      for (const product of db.products) {
          const productCart = db.cart[product.id]
          if (product.id === productCart?.id) {
              currentProducts.push({
                  ...product,
                  quantity: product.quantity - productCart.amount
              });
          } else {
              currentProducts.push(product);
          }
      }
  
         db.products = currentProducts;
         db.cart = {}
  
         window.localStorage.setItem("products", JSON.stringify(db.products));
         window.localStorage.setItem("cart", JSON.stringify(db.cart));
  
         printTotal(db);
         printProductsInCart(db); 
         printProducts(db);
         handlePrintAmountProducts(db);
    });
}

function handlePrintAmountProducts(db) {
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;
  
    for (const product in db.cart) {
      amount += db.cart[product].amount;
    }
  
    amountProducts.textContent = amount;
}

async function main() {
    const db = {
        products:
            JSON.parse(window.localStorage.getItem("products")) ||
          (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    };
    
  printProducts(db);
  handleShowCart();
  addRToCartfromProducts(db);
  printProductsInCart(db);
  handleProductsInCart(db);
  printTotal(db);  
  handleTotal(db);
  handlePrintAmountProducts(db);

  const darkMode = document.querySelector('#darkMode');
  const body = document.querySelector('body');

 load();

  darkMode.addEventListener('click', e =>{
    body.classList.toggle('darkmode');
    store(body.classList.contains('darkmode'))
  });

  function load() {
    const darkmode = localStorage.getItem('darkmode');

    if(!darkmode){
        store('false');
    }else if(darkmode == 'true') {
        body.classList.add('darkmode'); 
    }
  }

  function store(value) {
localStorage.setItem('darkmode', value);
  }
}

main();
