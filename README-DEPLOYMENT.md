# Guía de Despliegue para Luminous

## 🚀 Opciones de Despliegue

### 1. Render (Recomendado)
- **Archivo**: `render.yaml` incluido
- **Pasos**:
  1. Conecta tu repositorio de GitHub a Render
  2. Render detectará automáticamente el archivo `render.yaml`
  3. El despliegue será automático

### 2. Netlify
- **Archivo**: `netlify.toml` incluido
- **Pasos**:
  1. Conecta tu repositorio a Netlify
  2. La configuración se aplicará automáticamente
  3. URL disponible inmediatamente

### 3. Vercel
- **Archivo**: `vercel.json` incluido
- **Pasos**:
  1. Instala Vercel CLI: `npm i -g vercel`
  2. Ejecuta: `vercel`
  3. Sigue las instrucciones

### 4. Docker/Containerización
- **Archivos**: `Dockerfile` y `nginx.conf` incluidos
- **Pasos**:
  ```bash
  docker build -t luminous-app .
  docker run -p 80:80 luminous-app
  ```

## 📋 Pre-requisitos

- Node.js 18+
- npm o yarn
- Git repository conectado

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint del código
npm run lint
```

## 🌟 Variables de Entorno

Actualmente la aplicación no requiere variables de entorno específicas, pero está preparada para integración con Supabase cuando sea necesario.

## 📱 Características

- ✅ Aplicación React + Vite optimizada
- ✅ Tailwind CSS con sistema de diseño personalizado
- ✅ Componentes shadcn/ui
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Tipografías Google Fonts (Poppins, Raleway)
- ✅ Imágenes optimizadas
- ✅ Routing configurado

## 🎨 Paleta de Colores Luminous

- **Amarillo Brillante**: #FFEB3B (Creatividad y energía)
- **Naranja Vibrante**: #FF5722 (Pasión y dinamismo)
- **Azul Claro**: #00BCD4 (Calma y claridad mental)
- **Verde Pastel**: #8BC34A (Bienestar y armonía)
- **Neutro**: #F5F5F5 (Balance y neutralidad)

## 🚨 Notas Importantes

1. **Routing**: Configurado para SPA con fallback a index.html
2. **Assets**: Las imágenes están optimizadas y en el directorio correcto
3. **Performance**: Configuración de caché y compresión incluida
4. **Seguridad**: Headers de seguridad configurados

## 📞 Soporte

Para dudas sobre el despliegue, consulta la documentación específica de cada plataforma:
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)