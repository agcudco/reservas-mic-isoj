# =============================================================================
# Dockerfile - Microservicio Eventos (NestJS)
# OWASP Top 10 Compliant
# =============================================================================

# ---------------------------------------------------------------------------
# STAGE 1: Build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo los archivos de dependencias primero (cache layer)
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependencias de producción + build
RUN npm ci --ignore-scripts &&     npm cache clean --force

# Copiar el código fuente
COPY src ./src

# Compilar TypeScript a JavaScript
RUN npm run build

# ---------------------------------------------------------------------------
# STAGE 2: Production
# ---------------------------------------------------------------------------
FROM node:22-alpine AS production

# OWASP A06:2021 - Usar imágenes actualizadas y mínimas
# OWASP A05:2021 - Configuración segura por defecto

# Instalar dumb-init para manejo correcto de señales (PID 1)
RUN apk add --no-cache dumb-init ca-certificates &&     rm -rf /var/cache/apk/*

# OWASP A01:2021 - Crear usuario no privilegiado (no root)
RUN addgroup -g 1001 -S nodejs &&     adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Copiar solo lo necesario desde el builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# OWASP A05:2021 - Solo exponer el puerto necesario
EXPOSE 3000

# OWASP A01:2021 - Cambiar a usuario no privilegiado
USER nestjs

# OWASP A09:2021 - Healthcheck para monitoreo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3     CMD node -e "require('http').get('http://localhost:3000/api-docs', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# OWASP A02:2021 - No hardcodear secretos, usar variables de entorno
CMD ["node", "dist/main"]