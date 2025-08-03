# Agendalook.cl

Plataforma de agendamiento para servicios de belleza. Conecta profesionales con sus clientes de manera elegante y eficiente.

## 🎨 Características

- **Landing page moderna** con diseño femenino y elegante
- **Sistema de autenticación** con Supabase Auth
- **Dashboard profesional** para gestionar servicios y reservas
- **Páginas públicas personalizadas** para cada negocio
- **Formulario de reserva intuitivo** con proceso paso a paso
- **Diseño responsive** mobile-first
- **Notificaciones por email** automáticas

## 🚀 Tecnologías

- **Frontend**: Next.js 14 con App Router
- **Backend**: Supabase (Auth + Database)
- **Estilos**: TailwindCSS
- **Iconos**: Lucide React
- **Tipografía**: Poppins + Playfair Display

## 🎯 Funcionalidades del MVP

### Para Profesionales
- ✅ Registro e inicio de sesión
- ✅ Dashboard con estadísticas
- ✅ Gestión de servicios (nombre, duración, precio)
- ✅ Configuración de horarios de trabajo
- ✅ Visualización de reservas recibidas
- ✅ Página pública personalizada

### Para Clientes
- ✅ Página pública del negocio
- ✅ Selección de servicios disponibles
- ✅ Reserva con fecha y hora
- ✅ Formulario de contacto simple
- ✅ Confirmación de reserva

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd agendalook
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Panel profesional
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── [businessSlug]/   # Páginas públicas de negocios
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizables
│   └── ui/              # Componentes de UI
├── lib/                 # Utilidades y configuración
│   ├── supabase.ts      # Configuración de Supabase
│   └── utils.ts         # Utilidades generales
└── types/               # Tipos de TypeScript
```

## 🎨 Paleta de Colores

- **Primary**: Rosa/Magenta (#d946ef)
- **Coral**: Naranja coral (#f97316)
- **Lavender**: Lavanda (#a855f7)
- **Gold**: Dorado suave (#f59e0b)
- **Neutral**: Grises para texto y fondos

## 📱 Páginas Principales

### Landing Page (`/`)
- Logo y branding
- Hero section con tagline
- Características del producto
- Call-to-action para registro

### Autenticación
- **Login** (`/login`): Formulario de inicio de sesión
- **Register** (`/register`): Formulario de registro

### Dashboard (`/dashboard`)
- Vista general con estadísticas
- Gestión de servicios
- Configuración de horarios
- Lista de reservas

### Página Pública (`/[businessSlug]`)
- Información del negocio
- Servicios disponibles
- Proceso de reserva paso a paso
- Formulario de contacto

## 🔧 Configuración de Supabase

### Tablas necesarias:

1. **professionals**
```sql
CREATE TABLE professionals (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_slug TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **services**
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- en minutos
  price INTEGER NOT NULL, -- en centavos
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **bookings**
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Próximas Funcionalidades

- [ ] Integración con WhatsApp
- [ ] Sistema de pagos online
- [ ] Notificaciones push
- [ ] Calificaciones y reseñas
- [ ] Galería de trabajos
- [ ] Sistema de fidelización
- [ ] Reportes y analytics

## 📄 Licencia

Este proyecto es privado y propiedad de Agendalook.cl

---

**Desarrollado con ❤️ para profesionales de la belleza**
