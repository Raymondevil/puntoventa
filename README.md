# 🍔 George Burger - Menú Digital 

## Descripción del Proyecto
Sistema de pedidos online para George Burger, un negocio de hamburguesas que ofrece hamburguesas, hotdogs, sincronizadas, tortas y burros. La aplicación permite a los clientes hacer pedidos desde su celular, gestiona una base de datos de clientes y envía los pedidos por WhatsApp.

## 🌐 URLs de Acceso
- **Aplicación Web**: https://3000-itvd8mbiqgz2jbtsnyx6z-6532622b.e2b.dev
- **API Menu**: https://3000-itvd8mbiqgz2jbtsnyx6z-6532622b.e2b.dev/api/menu
- **API Extras**: https://3000-itvd8mbiqgz2jbtsnyx6z-6532622b.e2b.dev/api/extras

## ✨ Funcionalidades Implementadas
- ✅ **Menú Digital Completo**: 5 categorías (hamburguesas, hotdogs, sincronizadas, tortas, burros)
- ✅ **Selección de Ingredientes Extra**: Carne, quesos, tocino, camarón, etc. con precios individuales
- ✅ **Verduras y Aderezos**: Preseleccionados por defecto (jitomate, cebolla, crema, etc.)
- ✅ **Selección de Cantidades**: Para cada producto del menú
- ✅ **Opciones de Entrega**: Domicilio (+$20) o Recoger en tienda
- ✅ **Formulario de Cliente**: Nombre, WhatsApp, dirección (si es domicilio)
- ✅ **Base de Datos**: Almacena clientes, pedidos y historial
- ✅ **Integración WhatsApp**: Envío automático de pedidos al número +523111235595
- ✅ **Vista Previa del Mensaje**: Muestra el texto que se enviará por WhatsApp
- ✅ **Bebidas**: Opción de agregar bebidas ($30 c/u)
- ✅ **Carrito de Compras**: Manejo completo del pedido antes de enviar
- ✅ **Diseño Responsivo**: Funciona perfecto en celulares Android

## 🏗️ Arquitectura de Datos
### Base de Datos (Cloudflare D1 SQLite)
- **customers**: Almacena información de clientes
- **orders**: Registra todos los pedidos realizados  
- **menu_items**: Catálogo completo de productos (56 items)
- **extra_ingredients**: Ingredientes adicionales con precios
- **order_items**: Detalles de cada item en los pedidos
- **beverages**: Registro de bebidas pedidas

### Productos del Menú
- **30 Hamburguesas**: Desde Sencilla ($50) hasta Super Costeña ($130)
- **13 Hotdogs**: Desde De Pierna ($48) hasta Hawaiano Especial ($89)  
- **5 Sincronizadas**: Desde Sencilla ($51) hasta Matona/Costeña ($125)
- **4 Tortas**: Desde Sencilla ($50) hasta Cubana ($101)
- **4 Burros**: Desde Sencillo ($50) hasta Costeño ($106)

### Ingredientes Extra (13 tipos)
- Carne ($34), Carnes Frías ($13), Q. Asadero ($13)
- Salchicha para Asar ($44), Camarón ($46), Tocino ($15)
- Y más con precios específicos

## 📱 Guía de Uso
1. **Seleccionar Categoría**: Toca las pestañas (Hamburguesas, Hotdogs, etc.)
2. **Elegir Producto**: Ve los precios base y ingredientes incluidos  
3. **Personalizar**: 
   - Agregar ingredientes extra (con costo)
   - Seleccionar verduras (incluidas, preseleccionadas)
   - Elegir aderezos (incluidos, preseleccionados)
   - Ajustar cantidad
4. **Agregar al Carrito**: El producto se suma al pedido
5. **Opciones de Entrega**: 
   - 🏃 Recoger en tienda (gratis)
   - 🏠 Entrega a domicilio (+$20)
6. **Datos del Cliente**: Llenar nombre y WhatsApp (+ dirección si es domicilio)
7. **Bebidas** (opcional): Agregar bebidas ($30 c/u)
8. **Hacer Pedido**: Se genera el mensaje y se puede enviar por WhatsApp

## 📋 Funcionalidades Pendientes de Implementar
- ⏳ **Gestión de Inventario**: Control de productos disponibles
- ⏳ **Horarios de Atención**: Validación de horarios de servicio  
- ⏳ **Múltiples Ubicaciones**: Soporte para varias sucursales
- ⏳ **Métodos de Pago**: Integración con pagos digitales
- ⏳ **Sistema de Notificaciones**: SMS o push notifications
- ⏳ **Panel de Administración**: Para gestionar pedidos y menú
- ⏳ **Reportes de Ventas**: Dashboard con estadísticas

## 🛠️ Stack Tecnológico  
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), TailwindCSS
- **Backend**: Hono Framework (TypeScript)
- **Base de Datos**: Cloudflare D1 (SQLite distribuido)
- **Deployment**: Cloudflare Pages/Workers
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Estado del Deployment
- **Estado**: ✅ Activo y funcional
- **Plataforma**: Sandbox de desarrollo
- **Última Actualización**: 2025-09-19

## 📞 Configuración de WhatsApp
- **Número de Destino**: +523111235595
- **Formato del Mensaje**: Incluye detalles completos del pedido
- **Funcionalidades**: 
  - Información del cliente
  - Detalles de productos y cantidades
  - Ingredientes extra seleccionados  
  - Verduras y aderezos elegidos
  - Total con desglose de precios
  - Tipo de entrega y dirección

## 🔄 Próximos Pasos Recomendados
1. **Pruebas de Usuario**: Probar el flujo completo desde un celular Android
2. **Optimización de Velocidad**: Mejorar tiempos de carga
3. **Validación de Datos**: Más validaciones en formularios
4. **Gestión de Errores**: Mejor manejo de errores de red
5. **Deploy a Producción**: Configurar dominio personalizado en Cloudflare

---

**Desarrollado con ❤️ para George Burger** 🍔