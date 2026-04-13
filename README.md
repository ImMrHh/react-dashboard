# CEAM VR Lab Analytics Dashboard

Dashboard analítico privado para el Laboratorio VR del Centro Escolar Anglo Mexicano, construido con React + Vite + Tailwind CSS.

## Características

### 📊 Vistas Principales
- **Resumen**: KPIs generales, tendencias mensuales y proyecciones de crecimiento
- **Materias**: Análisis por materia académica con gráficos y estadísticas
- **Profesores**: Participación docente y estadísticas de uso
- **Cancelaciones**: Seguimiento de sesiones canceladas y tasas
- **Planeación**: Sesiones de planificación y coordinación
- **Escuelas Visitantes**: Demostraciones a instituciones externas

### 🔐 Autenticación
- Sistema PIN de 6 dígitos
- Sesiones almacenadas en `sessionStorage`
- Roles: `coordinacion` o `admin`
- Cierre de sesión seguro

### 📈 Análisis de Datos
- **KPIs Precisos**:
  - Sesiones VR (todos los registros confirmados)
  - Clases Impartidas (TipoSesion === 'Clase')
  - Profesores Activos (máximo 20)
  - Horas VR (sesiones × 3)
  - Instituciones Visitantes (demostraciones)
  - Materias Participantes

- **Proyecciones**:
  - Ciclo 2: +50% de Ciclo 1
  - Ciclo 3: +50% de Ciclo 2
  - Límite de profesores: 20 máximo

### 🎯 Filtros Avanzados
- Ciclo completo (por defecto)
- Últimos 3 meses
- Rango personalizado con date pickers
- Normalización automática de fechas

### 🎨 Diseño
- Tema oscuro institucional
- Colores: `#0f3a7d` (primario), `#0ea5e9` (acento)
- Totalmente responsive para iPad
- Gráficos con Recharts
- Animaciones CSS suaves

## Stack Técnico

```
Frontend:
- React 18.2
- Vite 5.0
- Tailwind CSS 3.3
- Recharts 2.10 (gráficos)
- Lucide React (iconos)

Construcción:
- Vite (desarrollo y build)
- PostCSS + Autoprefixer

Datos:
- API Cloudflare Workers
- Paginación automática
- Bearer token auth
```

## Estructura del Proyecto

```
ceam-vr-lab-dashboard/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── PINScreen.jsx
│   │   ├── tabs/
│   │   │   ├── OverviewTab.jsx
│   │   │   ├── MateriasTab.jsx
│   │   │   ├── ProfesoresTab.jsx
│   │   │   ├── CancelacionesTab.jsx
│   │   │   ├── PlaneacionTab.jsx
│   │   │   └── EscuelasVisitantesTab.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FilterControls.jsx
│   │   └── KPICard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useData.js
│   ├── utils/
│   │   └── calculations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore
```

## Instalación

### Requisitos
- Node.js 16+ (recomendado 18+)
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/ImMrHh/react-dashboard
cd react-dashboard

# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Desarrollo

### Variables de Entorno
No se necesitan variables de entorno. El token se almacena en `sessionStorage` tras autenticación.

### Endpoints API
- **Autenticación**: `https://vr-lab-auth.6z5fznmp4m.workers.dev/auth`
- **Datos**: `https://vr-lab-auth.6z5fznmp4m.workers.dev/data`

### Desarrollo Local
```bash
npm run dev
```
Abre http://localhost:3000 en tu navegador.

## Construcción

```bash
npm run build
```

Genera carpeta `dist/` lista para Cloudflare Pages.

## Despliegue en Cloudflare Pages

### Configuración automática
El repositorio en `https://github.com/ImMrHh/react-dashboard` se despliega automáticamente a través de Cloudflare Pages.

**Rama**: `main`
**Build Command**: `npm install && npm run build`
**Build Output Directory**: `dist/`

### Pasos manuales de despliegue
1. Push cambios a la rama `main`
2. Cloudflare Pages detecta cambios automáticamente
3. Se ejecuta build y despliegue
4. Dashboard disponible en: https://react-dashboard-ctc.pages.dev

### Verificar despliegue
```bash
# Ver logs en Cloudflare Dashboard
# https://dash.cloudflare.com → Pages → react-dashboard
```

## Campos de Datos Esperados

El API retorna registros con estos campos:

```javascript
{
  Profesor: string,
  Grupo: string,
  Materia: string,
  Fecha: string (YYYY-MM-DD o variante),
  Hora: string,
  Actividad: string,
  Aprendizaje: string,
  Observaciones: string,
  Period: string,
  DayOfWeek: string,
  SlotKey: string,
  Status: 'confirmed' | 'cancelled',
  TipoSesion: 'Clase' | 'Demo' | 'Planeación'
}
```

## Cálculos de KPIs

### Sesiones VR
```
Todos los registros donde Status === 'confirmed'
```

### Clases Impartidas
```
Registros donde Status === 'confirmed' Y TipoSesion === 'Clase'
```

### Profesores Activos
```
Cantidad de profesores únicos en registros de Clase
Máximo: 20
```

### Horas VR
```
Sesiones VR × 3 (cada sesión = 3 horas)
```

### Instituciones Visitantes
```
Cantidad de valores únicos en campo Grupo donde TipoSesion === 'Demo'
```

### Materias Participantes
```
Cantidad de valores únicos en campo Materia donde TipoSesion === 'Clase'
```

## Proyecciones de Crecimiento

```
Ciclo 1: Datos reales
Ciclo 2: Ciclo 1 × 1.5 (50% incremento)
Ciclo 3: Ciclo 2 × 1.5 (50% incremento)

Profesores Activos: Capped en máximo 20
```

## Normalización de Fechas

Todas las comparaciones de fechas se normalizan al formato `YYYY-MM-DD`:

```javascript
const normalized = new Date(fecha).toISOString().split('T')[0];
```

Esto maneja automáticamente variaciones de formato en los datos.

## Filtros

### Ciclo Completo
Muestra todos los datos disponibles (por defecto)

### Últimos 3 Meses
Filtra registros de los últimos 3 meses desde hoy

### Rango Personalizado
Selecciona fechas específicas (desde / hasta)

## Rendimiento

- Carga de datos paginada automáticamente
- Gráficos optimizados con Recharts
- Lazy loading de componentes de tabs
- CSS-in-JS para máximo rendimiento

## Seguridad

- ✅ Tokens en `sessionStorage` (no en localStorage)
- ✅ Bearer token para API calls
- ✅ HTTPS requerido en producción
- ✅ Validación de rol (coordinacion/admin)
- ✅ Logout limpia sesión completamente

## Navegadores Soportados

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iPad (iOS 14+)

## Troubleshooting

### "Error fetching data"
- Verificar conexión a internet
- Validar token PIN
- Revisar status de API en Cloudflare Dashboard

### "PIN inválido"
- Confirmar PIN de 6 dígitos
- Verificar endpoint de autenticación

### Gráficos no cargan
- Verificar datos en tab Resumen
- Revisar console del navegador (F12)

## Desarrollo Futuro

- [ ] Exportar datos a CSV/PDF
- [ ] Dashboard en tiempo real
- [ ] Comparativa entre ciclos
- [ ] Alertas personalizables
- [ ] Análisis predictivo

## Contribuir

Este dashboard es de uso privado de CEAM. Para cambios:
1. Crear rama desde `main`
2. Implementar cambios
3. Testing en desarrollo
4. Pull request para review

## Licencia

Privado - Centro Escolar Anglo Mexicano

## Soporte

Para problemas contactar a:
- Coordinación VR Lab
- Administración de CEAM

---

**Dashboard Version**: 1.0.0  
**Última actualización**: 2024  
**Hosted by**: Cloudflare Pages
