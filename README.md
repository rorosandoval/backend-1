# Primera entrega de Backend I

## 1️⃣ Requisitos
- Node.js instalado  
- NPM disponible

## 2️⃣ Instalación
1. Clonar o descargar el proyecto.  
2. Instalar dependencias:
```bash
npm install
```
3. Ejecutar el servidor:
```bash
node app.js
```
4. Servidor corriendo en:
```
http://localhost:8080
```

## 3️⃣ Endpoints

### **Productos**
| Método | Ruta | Descripción |
|--------|-----|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/:pid` | Ver un producto específico por ID |
| POST | `/products` | Agregar un nuevo producto (body: `title, description, price, thumbnails, code, category, stock`) |
| PUT | `/products/:pid` | Actualizar producto existente (body con campos a actualizar) |
| DELETE | `/products/:pid` | Eliminar producto por ID |

### **Carritos**
| Método | Ruta | Descripción |
|--------|-----|-------------|
| POST | `/api/carts` | Crear un nuevo carrito (devuelve `id` y `products`) |
| GET | `/api/carts/:cid` | Obtener carrito específico (muestra `id` y `products`) |
| POST | `/api/carts/:cid/product/:pid` | Agregar un producto a un carrito existente |

## 4️⃣ Flujo sugerido de uso

1. **Crear un carrito**  
```http
POST /api/carts
```
Respuesta ejemplo:
```json
{
  "id": "247cad39-7752-48fe-afc9-3e448655a9de",
  "products": []
}
```

2. **Agregar productos al carrito**  
```http
POST /api/carts/:cid/product/:pid
```
Ejemplo:
```
POST /api/carts/247cad39-7752-48fe-afc9-3e448655a9de/product/3
```
Respuesta:
```json
{
  "id": "247cad39-7752-48fe-afc9-3e448655a9de",
  "products": [
    { "product": 3, "quantity": 1 }
  ]
}
```

3. **Consultar carrito**  
```http
GET /api/carts/:cid
```
Respuesta:
```json
{
  "id": "247cad39-7752-48fe-afc9-3e448655a9de",
  "products": [
    { "product": 3, "quantity": 1 }
  ]
}
```

4. **Listar productos disponibles**  
```http
GET /products
```
Respuesta ejemplo:
```json
[
  { "id": 1, "title": "Producto 1", "price": 1000 },
  { "id": 2, "title": "Producto 2", "price": 2000 }
]
```

## 5️⃣ Notas importantes
- Todos los IDs (`cid` y `pid`) son necesarios para agregar o consultar productos en carritos.  
- Para probar rutas `POST`, se recomienda usar **Postman**.  
- Los productos y carritos se almacenan en archivos JSON limpios: `products.json` y `carts.json`.  
- Estructura del carrito: cada carrito tiene un `id` y un array `products` con objetos `{ product: ID, quantity: cantidad }`.

#### Rodrigo Sandoval - 2025