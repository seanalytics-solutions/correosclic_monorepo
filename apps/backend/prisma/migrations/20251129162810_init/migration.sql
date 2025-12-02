-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'usuario',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "token_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "rol" TEXT NOT NULL DEFAULT 'usuario',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellido" VARCHAR(30) NOT NULL,
    "numero" VARCHAR(10),
    "estado" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "fraccionamiento" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "codigoPostal" VARCHAR(5) NOT NULL,
    "imagen" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
    "stripeCustomerId" TEXT,
    "usuarioId" INTEGER,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "descripcion" VARCHAR(120) NOT NULL,
    "altura" REAL,
    "largo" REAL,
    "ancho" REAL,
    "peso" REAL,
    "precio" DECIMAL(10,2) NOT NULL,
    "inventario" INTEGER NOT NULL DEFAULT 0,
    "color" VARCHAR(40) NOT NULL,
    "marca" VARCHAR(60) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "vendedor" VARCHAR(80) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "vendidos" INTEGER NOT NULL DEFAULT 0,
    "sku" VARCHAR(60) NOT NULL,
    "idPerfil" INTEGER,
    "id_category" INTEGER,
    "sellerId" INTEGER,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,
    "direccionId" INTEGER,
    "estatus_pago" TEXT,
    "calle" TEXT,
    "numero_int" TEXT,
    "numero_exterior" TEXT,
    "cp" TEXT,
    "ciudad" TEXT,
    "nombre" TEXT,
    "last4" TEXT,
    "brand" TEXT,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_producto" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "n_guia" TEXT,

    CONSTRAINT "pedido_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "misdireccione" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "calle" VARCHAR(100) NOT NULL,
    "colonia_fraccionamiento" VARCHAR(100) NOT NULL,
    "numero_interior" INTEGER,
    "numero_exterior" INTEGER,
    "numero_celular" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(5) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "mas_info" VARCHAR(100),
    "usuario_id" INTEGER,

    CONSTRAINT "misdireccione_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "diaTransaccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionContent" (
    "id" SERIAL NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER,
    "transactionId" INTEGER,

    CONSTRAINT "TransactionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorito" (
    "id" SERIAL NOT NULL,
    "fecha_agregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER,
    "productoId" INTEGER,

    CONSTRAINT "favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "profileId" INTEGER,
    "productoId" INTEGER,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "sucursal" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productos" TEXT NOT NULL,
    "fecha_creacion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" DATE NOT NULL,
    "profileId" INTEGER,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "type" TEXT NOT NULL DEFAULT 'other',
    "resolution" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order_id" INTEGER,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "stripeCardId" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficinas" (
    "id_oficina" SERIAL NOT NULL,
    "clave_oficina_postal" VARCHAR(5) NOT NULL,
    "clave_cuo" VARCHAR(5) NOT NULL,
    "clave_inmueble" VARCHAR(5) NOT NULL,
    "clave_inegi" VARCHAR(10) NOT NULL,
    "clave_entidad" VARCHAR(2) NOT NULL,
    "nombre_entidad" VARCHAR(50) NOT NULL,
    "nombre_municipio" VARCHAR(50) NOT NULL,
    "tipo_cuo" TEXT NOT NULL,
    "nombre_cuo" VARCHAR(100) NOT NULL,
    "domicilio" VARCHAR(200) NOT NULL,
    "codigo_postal" VARCHAR(5) NOT NULL,
    "clave_unica_zona" TEXT,
    "telefono" VARCHAR(20) NOT NULL,
    "pais" VARCHAR(50) NOT NULL DEFAULT 'México',
    "latitud" DECIMAL(65,30) NOT NULL,
    "longitud" DECIMAL(65,30) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "horario_atencion" VARCHAR(150),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oficinas_pkey" PRIMARY KEY ("id_oficina")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "proveedor" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "correo_asociado" TEXT,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" SERIAL NOT NULL,
    "placas" TEXT NOT NULL,
    "volumen_carga" DECIMAL(10,2) NOT NULL,
    "num_ejes" INTEGER NOT NULL,
    "num_llantas" INTEGER NOT NULL,
    "fecha_alta" TIMESTAMP(3) NOT NULL,
    "tarjeta_circulacion" TEXT NOT NULL,
    "tipo_vehiculo" INTEGER NOT NULL,
    "curp_conductor" TEXT,
    "clave_oficina" TEXT NOT NULL,
    "zona_asignada" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'disponible',

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_vehiculos" (
    "id" SERIAL NOT NULL,
    "tipo_vehiculo" TEXT NOT NULL,
    "capacidad_kg" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tipos_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_vehiculo_sucursal" (
    "id" SERIAL NOT NULL,
    "tipo_vehiculo" INTEGER NOT NULL,
    "tipo_oficina" TEXT NOT NULL,

    CONSTRAINT "tipo_vehiculo_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conductores" (
    "id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "licencia_vigente" BOOLEAN NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "fecha_alta" TIMESTAMP(3) NOT NULL,
    "disponibilidad" BOOLEAN NOT NULL,
    "clave_oficina" TEXT NOT NULL,

    CONSTRAINT "conductores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" SERIAL NOT NULL,
    "estado_envio" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega_programada" DATE NOT NULL,
    "nombre_receptor" TEXT,
    "evidencia_entrega" TEXT,
    "motivo_fallo" TEXT,
    "fecha_entregado" DATE,
    "fecha_fallido" DATE,
    "id_guia" TEXT NOT NULL,
    "id_unidad" INTEGER,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guias" (
    "id_guia" TEXT NOT NULL,
    "numero_de_rastreo" TEXT NOT NULL,
    "situacion_actual" TEXT NOT NULL,
    "alto_cm" DECIMAL(5,2) NOT NULL,
    "largo_cm" DECIMAL(5,2) NOT NULL,
    "ancho_cm" DECIMAL(5,2) NOT NULL,
    "peso_kg" DECIMAL(4,2) NOT NULL,
    "valor_declarado" DECIMAL(10,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "fecha_entrega_estimada" TIMESTAMP(3),
    "key_pdf" TEXT,
    "id_remitente" TEXT,
    "id_destinatario" TEXT,

    CONSTRAINT "guias_pkey" PRIMARY KEY ("id_guia")
);

-- CreateTable
CREATE TABLE "contactos_guias" (
    "id_contacto" TEXT NOT NULL,
    "id_usuario" TEXT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "numero_interior" TEXT,
    "asentamiento" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT,
    "lat" DECIMAL(65,30),
    "lng" DECIMAL(65,30),
    "referencia" TEXT,

    CONSTRAINT "contactos_guias_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" SERIAL NOT NULL,
    "kg_min" DECIMAL(5,2) NOT NULL,
    "kg_max" DECIMAL(5,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" SERIAL NOT NULL,
    "zone_name" VARCHAR(50) NOT NULL,
    "min_distance" INTEGER NOT NULL,
    "max_distance" INTEGER,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitud_vendedor" (
    "id" SERIAL NOT NULL,
    "nombre_tienda" TEXT NOT NULL,
    "categoria_tienda" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion_fiscal" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "img_uri" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "solicitud_vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "create_seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "RFC" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user" TEXT,
    "ip_last_login" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "create_seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "created_coupons" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "created_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifted_coupons" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "gifted_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_historial" (
    "id" SERIAL NOT NULL,
    "nombre_conductor" VARCHAR(255) NOT NULL,
    "curp" VARCHAR(18) NOT NULL,
    "placas_unidad" VARCHAR(20) NOT NULL,
    "oficina_salida" VARCHAR(5) NOT NULL,
    "clave_cuo_destino" VARCHAR(10),
    "clave_oficina_actual" VARCHAR(10),
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_llegada_destino" TIMESTAMP(3),
    "fecha_finalizacion" TIMESTAMP(3),

    CONSTRAINT "asignaciones_historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_zones" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "international_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" VARCHAR(3),
    "zone_id" INTEGER NOT NULL,

    CONSTRAINT "international_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_tariffs" (
    "id" SERIAL NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "max_kg" DOUBLE PRECISION,
    "base_price" DOUBLE PRECISION,
    "iva_percent" DOUBLE PRECISION,
    "additional_per_kg" DOUBLE PRECISION,

    CONSTRAINT "international_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paquetes" (
    "id" SERIAL NOT NULL,
    "estatus" VARCHAR(20) NOT NULL DEFAULT 'En proceso',
    "calle" VARCHAR(250) NOT NULL,
    "colonia" VARCHAR(250) NOT NULL,
    "cp" VARCHAR(5) NOT NULL,
    "indicaciones" VARCHAR,
    "numero_guia" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "evidencia" VARCHAR,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_paquetes" (
    "id" SERIAL NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPaqueteId" INTEGER,

    CONSTRAINT "asignacion_paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_guias" (
    "id_movimiento" TEXT NOT NULL,
    "id_guia" TEXT NOT NULL,
    "id_sucursal" VARCHAR NOT NULL,
    "id_ruta" VARCHAR NOT NULL,
    "estado" VARCHAR NOT NULL,
    "localizacion" VARCHAR NOT NULL,
    "fecha_movimiento" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "movimientos_guias_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "incidencias_guias" (
    "id_incidencia" TEXT NOT NULL,
    "id_guia" TEXT NOT NULL,
    "tipo_incidencia" VARCHAR NOT NULL,
    "descripcion" VARCHAR,
    "fecha_incidencia" TIMESTAMPTZ NOT NULL,
    "id_usuario_responsable" VARCHAR NOT NULL,

    CONSTRAINT "incidencias_guias_pkey" PRIMARY KEY ("id_incidencia")
);

-- CreateTable
CREATE TABLE "_complaint_products" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_complaint_products_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_correo_key" ON "user"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usuarioId_key" ON "Profile"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "facturas"("numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "oficinas_clave_cuo_key" ON "oficinas"("clave_cuo");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_placas_key" ON "unidades"("placas");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_tarjeta_circulacion_key" ON "unidades"("tarjeta_circulacion");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_vehiculos_tipo_vehiculo_key" ON "tipos_vehiculos"("tipo_vehiculo");

-- CreateIndex
CREATE UNIQUE INDEX "conductores_curp_key" ON "conductores"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "conductores_rfc_key" ON "conductores"("rfc");

-- CreateIndex
CREATE UNIQUE INDEX "guias_numero_de_rastreo_key" ON "guias"("numero_de_rastreo");

-- CreateIndex
CREATE UNIQUE INDEX "create_seller_email_key" ON "create_seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "international_zones_code_key" ON "international_zones"("code");

-- CreateIndex
CREATE UNIQUE INDEX "international_countries_name_key" ON "international_countries"("name");

-- CreateIndex
CREATE INDEX "_complaint_products_B_index" ON "_complaint_products"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "create_seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "misdireccione"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_producto" ADD CONSTRAINT "pedido_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_producto" ADD CONSTRAINT "pedido_producto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "misdireccione" ADD CONSTRAINT "misdireccione_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContent" ADD CONSTRAINT "TransactionContent_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContent" ADD CONSTRAINT "TransactionContent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_tipo_vehiculo_fkey" FOREIGN KEY ("tipo_vehiculo") REFERENCES "tipos_vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_curp_conductor_fkey" FOREIGN KEY ("curp_conductor") REFERENCES "conductores"("curp") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_clave_oficina_fkey" FOREIGN KEY ("clave_oficina") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_zona_asignada_fkey" FOREIGN KEY ("zona_asignada") REFERENCES "oficinas"("clave_cuo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_vehiculo_sucursal" ADD CONSTRAINT "tipo_vehiculo_sucursal_tipo_vehiculo_fkey" FOREIGN KEY ("tipo_vehiculo") REFERENCES "tipos_vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conductores" ADD CONSTRAINT "conductores_clave_oficina_fkey" FOREIGN KEY ("clave_oficina") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_id_remitente_fkey" FOREIGN KEY ("id_remitente") REFERENCES "contactos_guias"("id_contacto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "contactos_guias"("id_contacto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "created_coupons" ADD CONSTRAINT "created_coupons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_countries" ADD CONSTRAINT "international_countries_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_tariffs" ADD CONSTRAINT "international_tariffs_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_paquetes" ADD CONSTRAINT "asignacion_paquetes_idPaqueteId_fkey" FOREIGN KEY ("idPaqueteId") REFERENCES "paquetes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_guias" ADD CONSTRAINT "movimientos_guias_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias_guias" ADD CONSTRAINT "incidencias_guias_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_complaint_products" ADD CONSTRAINT "_complaint_products_A_fkey" FOREIGN KEY ("A") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_complaint_products" ADD CONSTRAINT "_complaint_products_B_fkey" FOREIGN KEY ("B") REFERENCES "pedido_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
