// -----CONSTANTES-----
const items = document.getElementById(`contenedor`)
const itemsCarrito = document.getElementById(`contenedor-carrito`)
const itemsTotal = document.getElementById(`contenedor-total`)
const templateCard = document.getElementById(`template-card`).content
const templateCarrito = document.getElementById(`template-carrito`).content
const templateTotal = document.getElementById(`template-total`).content
const fragment = document.createDocumentFragment()
let carrito = []

// ------EVENTOS------
document.addEventListener(`DOMContentLoaded`, () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        insertarCarrito()
    }   
})

items.addEventListener(`click`, e => {
    agregarCarrito(e)         
})

itemsCarrito.addEventListener(`click`, e => {
   botonesAumDis(e)
})

$(".boton-carrito").on("click", function () {
    $("#contenedor-general-carrito").toggleClass("on")
});


// -----FUNCIONES-----
// consumo el json
const fetchData = async() => {
    try{
        const res = await fetch(`productos.json`)
        const data = await res.json()
        insertarProductos(data)

    } catch (error){}
}

// Inserto los productos al DOM
const insertarProductos = data => {
  data.forEach(producto => {
    templateCard.querySelector(`h5`).textContent = producto.nombre
    templateCard.querySelector(`span`).textContent = producto.descripcion
    templateCard.querySelector(`p`).textContent = producto.precio
    templateCard.querySelector(`img`).setAttribute("src", producto.imagen)
    templateCard.querySelector(`button`).dataset.id = producto.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
}

// Agrego los productos al carrito
const agregarCarrito = e => {
 if(e.target.classList.contains(`btn-outline-secondary`)){
    objetoCarrito(e.target.parentElement)     
}
 e.stopPropagation()
}

const objetoCarrito = objeto => {
   const producto = {  
       id: objeto.querySelector(`button`).dataset.id,     
       nombre: objeto.querySelector(`h5`).textContent,
       precio: objeto.querySelector(`p`).textContent,
       cantidad: 1,
   }

   if(carrito.hasOwnProperty(producto.id)){
       producto.cantidad = carrito[producto.id].cantidad + 1
   }

   carrito[producto.id] = {...producto}
   insertarCarrito()   
   
}


const insertarCarrito = () => {
    itemsCarrito.innerHTML = ""
    Object.values(carrito).forEach(producto => { 
        templateCarrito.querySelector(`span`).textContent = producto.id    
        templateCarrito.querySelector(`h5`).textContent = producto.nombre
        templateCarrito.querySelectorAll(`p`)[0].textContent = `Cantidad: ${producto.cantidad}`
        templateCarrito.querySelector(`.btn-info`).dataset.id = producto.id
        templateCarrito.querySelector(`.btn-danger`).dataset.id = producto.id
        templateCarrito.querySelectorAll(`p`)[1].textContent = producto.cantidad * producto.precio
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    itemsCarrito.appendChild(fragment)
    insertarTotal()
    localStorage.setItem(`carrito`, JSON.stringify(carrito))   
    
}

// Funcion para sumar cantidades y totales

const insertarTotal = () => {
    itemsTotal.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        itemsTotal.innerHTML = `<div><p>No hay combos agregados. <br> El carrito esta vacio, comience a comprar.</p></div>`
      return
    }

    const cantidades = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const precios = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templateTotal.querySelectorAll(`p`)[1].textContent = `Total de productos: ${cantidades}`
    templateTotal.querySelectorAll(`p`)[2].textContent = `Total a pagar: $ ${precios}`

    const clone =  templateTotal.cloneNode(true)
    fragment.appendChild(clone)
    itemsTotal.appendChild(fragment)

    const botonVaciar = document.getElementById(`vaciar-carrito`)
    botonVaciar.addEventListener(`click`, () => {
        carrito = {}
        insertarCarrito()
    })

}

// funcion para aumentar y disminuir cantidades
const botonesAumDis = e => {
    //aumentar
    if (e.target.classList.contains(`btn-info`)){        
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {... producto}
        insertarCarrito()
    }
    //disminuir
    if (e.target.classList.contains(`btn-danger`)){        
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        } 
        insertarCarrito()
    }
    e.stopPropagation()
}

// funcion al darle click cuando se agrega al carrito
function myFunction() {
    $(".popup-wrapper").css("display", "block")
    .fadeIn(800)
    .delay(800)
    .fadeOut(800);
}

// funcion al confirmar la compra
function modalFinal() {
    $(".popup-final").css("display", "block")
}

function cruz (){ 
    $(".popup-final").css("display", "none")
    $(".popup-confirmacion").css("display", "none")
}

function ultimoConfirmar(){
    $(".popup-final").css("display", "none");    
    $(".popup-confirmacion").css("display", "block");
    carrito = {}
    insertarCarrito()                   
}




  