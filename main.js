const express = require('express');
const fs = require('fs');
const { get } = require('http');
const { stringify } = require('querystring');

const app = express();

const PORT = 8080;

class Contenedor {
    nombreArchivo;

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async leerArchivo() {
        const registros = await fs.promises.readFile(`${this.nombreArchivo}`,'utf-8');
        return JSON.parse(registros);
    }

    async grabarArchivo(productos) {
        const registros = JSON.stringify(productos,null,'\t');
        await fs.promises.writeFile(nombreArchivo,registros);
    } 

    async getAll() {
        const productos = await this.leerArchivo();
        return productos;
    }
 
    async getById(id) {
        const productos = await this.leerArchivo();
        const indice = productos.findIndex((unProducto) => unProducto.id === id);

        if(indice < 0) {
            return null;
        }

        return productos[indice];
    }

    async save(dato) {

        if(!dato.title || !dato.price || typeof dato.title!== 'string' || typeof dato.price !== 'number')
            throw new Error('Datos incorrectos');

        const newId = 1;
        const newProducto = {};

        const productos = await this.leerArchivo();

        if (productos.length === 0) {
            dato.id = newId;
        }
        else {
            dato.id = productos[productos.length-1].id +1;
        }

        const altaProducto = {
            title: dato.title,
            price: dato.price,
            id: dato.id
        }
  
        productos.push(altaProducto);
        await this.grabarArchivo(productos);
        return dato.id;
   }

    async deleteAll() {
        await this.grabarArchivo([]);
        return;
    }

    async deleteById (idaBorrar) {
        const productos = await this.leerArchivo();
   
        const indice = productos.findIndex((unProducto) => unProducto.id === idaBorrar)
        if(indice < 0) {
            return indice;
        }

        productos.splice(indice,1);
        await this.grabarArchivo(productos);
        return indice;
    }  
}
const nombreArchivo = 'productos.txt';
const contenedor1 = new Contenedor (nombreArchivo);
let contvisitas = 0;
app.get('/', (req, res) => {
    contvisitas++;
    res.send(`Bienvenido - Visitante Numero ${contvisitas}`)
});

app.get('/productos', async (req, res)  => {
    const productos = await contenedor1.getAll();
    const MostrarProductos = productos.map((producto) => {
        return `Producto: ${producto.title} - Precio: ${producto.price} - ID: ${producto.id} `
    })
    console.log(MostrarProductos);
    res.send(MostrarProductos);
});

const calculaidalazar = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

app.get('/productoRandom/', async (req, res) => {
    const id = calculaidalazar(1,8)
    const producto = await contenedor1.getById(id)
    const MostrarProductos = `Producto: ${producto.title} - Precio: ${producto.price} - ID: ${producto.id}`
    res.send(MostrarProductos)
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
