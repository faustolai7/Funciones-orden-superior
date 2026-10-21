class Producto {
    constructor(nombre, categoria, precio, stock) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }

    vender(cantidad) {
        if (cantidad <= 0 || cantidad > this.stock) {
            return 0;
        }
        this.stock = this.stock - cantidad;
        return this.precio * cantidad;
    }
}


function obtenerCatalogoDesdeLaPagina() {
    const titulos = document.querySelectorAll("main figcaption");
    return Array.from(titulos, (titulo) => titulo.textContent.trim());
}


function obtenerPreciosDesdeLaPagina() {
    const precios = document.querySelectorAll("main figure p");
    return Array.from(precios, (precio) => Number(precio.textContent.replace(/[^0-9]/g, "")));
}


function obtenerCategoria() {
    const titulo = document.querySelector("main h1");
    return titulo ? titulo.textContent.trim() : "Productos";
}


function pedirTexto(mensaje) {
    const respuesta = prompt(mensaje);
    return respuesta === null ? null : respuesta.trim();
}


function normalizar(texto) {
    return texto.trim().toLowerCase().replace(/\s+/g, " ");
}


function mostrarReporte(titulo, lista) {
    console.log(`--- ${titulo} (${lista.length} productos) ---`);
    for (const producto of lista) {
        console.log(`Producto: ${producto}`);
    }
}


function crearInventario(catalogo, precios, categoria) {
    if (catalogo.length < 3) {
        console.warn("Hacen falta al menos 3 productos en la página para crear el inventario.");
        return [];
    }

    const producto1 = new Producto(catalogo[0], categoria, precios[0], 5);
    const producto2 = new Producto(catalogo[1], categoria, precios[1], 1);
    const producto3 = new Producto(catalogo[2], categoria, precios[2], 8);

    return [producto1, producto2, producto3];
}


function mostrarVenta(producto, cantidad) {
    const stockAntes = producto.stock;
    const total = producto.vender(cantidad);

    if (total === 0) {
        console.log(`No se pudo vender ${cantidad} de "${producto.nombre}". Stock disponible: ${producto.stock}`);
    } else {
        console.log(`Venta: ${cantidad} x "${producto.nombre}" = $${total}. Stock: ${stockAntes} -> ${producto.stock}`);
    }
}


function verificarInventario(inventario) {
    if (inventario.length === 0) {
        return;
    }

    console.log("--- Verificación de la clase Producto ---");
    for (const producto of inventario) {
        console.log(`${producto.nombre} | ${producto.categoria} | $${producto.precio} | stock: ${producto.stock}`);
    }

    mostrarVenta(inventario[0], 2);
    mostrarVenta(inventario[1], 2);
    mostrarVenta(inventario[2], 3);
}


function retirarUltimoProducto(catalogo) {
    if (catalogo.length === 0) {
        console.log("El catálogo está vacío, no hay nada para eliminar.");
        return;
    }
    const eliminado = catalogo.pop();
    console.log(`Se ha eliminado el elemento: ${eliminado}`);
}

function agregarAlFinal(catalogo) {
    const nombre = pedirTexto("Nuevo ingreso: ¿qué producto querés agregar al final del catálogo?");
    if (!nombre) {
        console.log("No se agregó ningún producto.");
        return;
    }
    if (catalogo.map(normalizar).includes(normalizar(nombre))) {
        console.log(`"${nombre}" ya está en el catálogo, no se agrega de nuevo.`);
        return;
    }
    catalogo.push(nombre);
    console.log(`Se agregó al final: ${nombre}`);
}

function agregarAlPrincipio(catalogo) {
    const nombre = pedirTexto("Destacado: ¿qué producto querés poner primero en el catálogo?");
    if (!nombre) {
        console.log("No se destacó ningún producto.");
        return;
    }
    if (catalogo.map(normalizar).includes(normalizar(nombre))) {
        console.log(`"${nombre}" ya está en el catálogo, no se destaca de nuevo.`);
        return;
    }
    catalogo.unshift(nombre);
    console.log(`Se agregó al principio: ${nombre}`);
}

function atenderPedido(catalogo, inventario) {
    const pedido = pedirTexto(
        "¿Qué producto querés pedir? Escribí el nombre completo:\n\n" + catalogo.join("\n")
    );
    if (!pedido) {
        console.log("El cliente no pidió ningún producto.");
        return;
    }

    const catalogoNormalizado = catalogo.map(normalizar);
    const pedidoNormalizado = normalizar(pedido);

    if (catalogoNormalizado.includes(pedidoNormalizado)) {
        const indice = catalogoNormalizado.indexOf(pedidoNormalizado);
        console.log(`El cliente pidió: ${catalogo[indice]} (posición ${indice} del catálogo)`);

        const producto = inventario.find((item) => normalizar(item.nombre) === pedidoNormalizado);
        if (producto) {
            const textoCantidad = pedirTexto(`¿Cuántas unidades de "${producto.nombre}" querés? (stock: ${producto.stock})`);
            const cantidad = Number(textoCantidad);
            if (textoCantidad && Number.isInteger(cantidad)) {
                mostrarVenta(producto, cantidad);
            } else {
                console.log("Cantidad inválida, no se registró la venta.");
            }
        }
    } else {
        alert(`Lo sentimos, "${pedido}" no está disponible.`);
    }
}

function reemplazarProducto(catalogo) {
    if (catalogo.length === 0) {
        console.log("El catálogo está vacío, no hay nada para reemplazar.");
        return;
    }

    const textoIndice = pedirTexto(
        `Reemplazar: ingresá el índice del producto (de 0 a ${catalogo.length - 1}):`
    );
    const indice = Number(textoIndice);

    if (!textoIndice || !Number.isInteger(indice) || indice < 0 || indice >= catalogo.length) {
        console.log("Índice inválido, no se reemplazó ningún producto.");
        return;
    }

    const nuevoNombre = pedirTexto(`¿Cuál es el nuevo producto para la posición ${indice}?`);
    if (!nuevoNombre) {
        console.log("No se ingresó un nombre nuevo, no se reemplazó ningún producto.");
        return;
    }

    const reemplazado = catalogo.splice(indice, 1, nuevoNombre);
    console.log(`Posición ${indice}: se reemplazó "${reemplazado[0]}" por "${nuevoNombre}"`);
}


function filtrarPorPrecioMaximo(inventario) {
    if (inventario.length === 0) {
        console.log("No hay inventario para filtrar.");
        return;
    }

    const textoPrecio = pedirTexto("Filtrar: ¿cuál es el precio máximo que querés pagar?");
    const precioMaximo = Number(textoPrecio);

    if (!textoPrecio || isNaN(precioMaximo) || precioMaximo <= 0) {
        console.log("Precio inválido, no se aplicó ningún filtro.");
        return;
    }

    const accesibles = inventario.filter((producto) => producto.precio <= precioMaximo);

    console.log(`--- Productos de hasta $${precioMaximo} (${accesibles.length}) ---`);
    if (accesibles.length === 0) {
        console.log("Ningún producto del inventario cumple con ese precio.");
        return;
    }

    accesibles.forEach((producto) => {
        console.log(`${producto.nombre} | $${producto.precio} | stock: ${producto.stock}`);
    });
}


function mostrarResumenInventario(inventario) {
    if (inventario.length === 0) {
        console.log("No hay inventario para resumir.");
        return;
    }

    const valorTotal = inventario.reduce((total, producto) => total + producto.precio * producto.stock, 0);
    const unidadesTotales = inventario.reduce((total, producto) => total + producto.stock, 0);

    console.log("--- Resumen del inventario ---");
    console.log(`Unidades en stock: ${unidadesTotales}`);
    console.log(`Valor total del stock: $${valorTotal}`);

    if (inventario.some((producto) => producto.stock === 0)) {
        const agotados = inventario
            .filter((producto) => producto.stock === 0)
            .map((producto) => producto.nombre);
        console.log(`Atención, productos sin stock: ${agotados.join(", ")}`);
    } else {
        console.log("Todos los productos tienen stock disponible.");
    }
}


function iniciarSimulador() {
    const categoria = obtenerCategoria();
    const catalogo = obtenerCatalogoDesdeLaPagina();

    if (catalogo.length === 0) {
        console.warn("No se encontraron productos en esta página.");
        return;
    }

    console.log(`Simulador de stock: ${categoria}`);
    mostrarReporte("Catálogo inicial", catalogo);

    const precios = obtenerPreciosDesdeLaPagina();
    const inventario = crearInventario(catalogo, precios, categoria);
    verificarInventario(inventario);

    const menu =
        `Stock de ${categoria} - ¿Qué querés hacer?\n\n` +
        "1 - Retirar el último producto\n" +
        "2 - Agregar un producto al final\n" +
        "3 - Agregar un producto destacado al principio\n" +
        "4 - Pedir un producto (cliente)\n" +
        "5 - Reemplazar un producto por índice\n" +
        "6 - Ver el catálogo\n" +
        "7 - Filtrar productos por precio máximo\n" +
        "8 - Ver resumen del inventario\n" +
        "0 - Salir";

    let opcion = pedirTexto(menu);

    while (opcion !== null && opcion !== "0") {
        switch (opcion) {
            case "1":
                retirarUltimoProducto(catalogo);
                break;
            case "2":
                agregarAlFinal(catalogo);
                break;
            case "3":
                agregarAlPrincipio(catalogo);
                break;
            case "4":
                atenderPedido(catalogo, inventario);
                break;
            case "5":
                reemplazarProducto(catalogo);
                break;
            case "6":
                mostrarReporte("Catálogo actual", catalogo);
                break;
            case "7":
                filtrarPorPrecioMaximo(inventario);
                break;
            case "8":
                mostrarResumenInventario(inventario);
                break;
            default:
                console.log(`Opción "${opcion}" no válida. Elegí un número del 0 al 8.`);
        }
        opcion = pedirTexto(menu);
    }

    mostrarReporte("Catálogo final", catalogo);
}

iniciarSimulador();
