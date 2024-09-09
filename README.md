## INSTALL HEROICONS - ICONOS
npm install lucide-react
https://lucide.dev/icons/

npm install @heroicons/react                            // Importar los iconos en el archivo que se necesite       
Ej: import { BeakerIcon } from '@heroicons/react/solid'

# TailwindCSS Formater
npm install -D prettier prettier-plugin-tailwindcss



## INSTALL EXTENSIONES bcrypt - PARA ENCRIPTAR CONTRASEÑAS
npm install bcrypt                                      // Encriptar contraseñas

## INSTALL PRISMA.ORM IN NEXT.JS - BASE DE DATOS
npm install prisma --save-dev                           // Instalar Prisma
npx prisma init --datasource-provider postgresql        // Inicializa prisma
npx prisma migrate dev --name nombre_de_tu_migracion    // Crea una migración
npx prisma migrate deploy                               // Ejecuta la migración
npx prisma studio                                       // Abre el panel de prisma

## EJECUTAR SEMILLA O SEED.JS - PRISMA
# Agregar al package.json:
"prisma": {
"seed": "node prisma/seed.js"
},

npx prisma db seed                                      // Ejecuta la semilla

## DESDE ACÁ SON TODOS COMPONENTES PARA FUNCIONALIDAD Y DISEÑO.

## INSTALL REACT-DATA-TABLE-COMPONENT - PARA LAS TABLAS
npm install react-data-table-component                  // Instalar DataTables

## INSTALL NEXT-AUTH - PARA LA AUTENTICACIÓN
npm install next-auth                                   // Inicializar Autenticación
## INSTALL REACT HOOK FORM - PARA LOS FORMULARIOS
npm install react-hook-form                             // Inicializar Formularios

## INSTALL SWEETALERT2
npm install sweetalert2