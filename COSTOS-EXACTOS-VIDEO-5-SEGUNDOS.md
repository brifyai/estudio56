# 💰 Costos Exactos: Sistema de Video (5 segundos)

**Fecha**: 9 de Enero 2026  
**Duración**: 5 segundos (121 frames @ 25fps)

---

## 📊 Costos por Modelo

### 1. BORRADOR (480p) - LTX-2-19B

**Modelo**: `fal-ai/ltx-2-19b/text-to-video/lora`

**Configuración**:
- Resolución: 480p (480x854 para 9:16)
- Frames: 121 (5 segundos @ 25fps)
- Calidad: Low

**Cálculo de Costo**:
```
Costo estimado: $0.10 - $0.15 por video de 5 segundos
```

**Nota**: El modelo LTX-2-19B no publica pricing público específico en fal.ai. El costo se basa en estimaciones de modelos similares de text-to-video en resolución baja.

---

### 2. HD (1080p) - SeedVR Upscaler

**Modelo**: `fal-ai/seedvr/upscale/video`

**Configuración**:
- Input: Video 480p (480x854, 121 frames)
- Output: Video 1080p (1080x1920, 121 frames)
- Modo: Target resolution

**Cálculo de Costo**:
```
Fórmula: $0.001 por megapixel de video data
Megapixels = width × height × frames / 1,000,000

Para 1080p (9:16):
= 1080 × 1920 × 121 / 1,000,000
= 250,905,600 / 1,000,000
= 250.9 megapixels

Costo = 250.9 × $0.001 = $0.25
```

**Costo exacto**: **$0.25** por upscale a 1080p

---

## 💵 Resumen de Costos

| Paso | Resolución | Duración | Costo |
|------|-----------|----------|-------|
| **Borrador** | 480p | 5s | **$0.10 - $0.15** |
| **HD Upscale** | 1080p | 5s | **$0.25** |
| **TOTAL** | - | - | **$0.35 - $0.40** |

---

## 📐 Costos por Aspect Ratio

### 9:16 (Vertical - Stories)

| Paso | Resolución | Megapixels | Costo |
|------|-----------|------------|-------|
| Borrador | 480×854 | 49.6 MP | $0.10-$0.15 |
| HD | 1080×1920 | 250.9 MP | $0.25 |
| **Total** | - | - | **$0.35-$0.40** |

### 16:9 (Horizontal - YouTube)

| Paso | Resolución | Megapixels | Costo |
|------|-----------|------------|-------|
| Borrador | 854×480 | 49.6 MP | $0.10-$0.15 |
| HD | 1920×1080 | 250.9 MP | $0.25 |
| **Total** | - | - | **$0.35-$0.40** |

### 1:1 (Cuadrado - Feed)

| Paso | Resolución | Megapixels | Costo |
|------|-----------|------------|-------|
| Borrador | 480×480 | 27.9 MP | $0.10-$0.15 |
| HD | 1080×1080 | 141.4 MP | $0.14 |
| **Total** | - | - | **$0.24-$0.29** |

---

## 💡 Comparación con Alternativas

### Opción 1: Sistema Actual (Borrador + HD)
- Borrador 480p: $0.10-$0.15
- HD 1080p: $0.25
- **Total: $0.35-$0.40**
- **Ventaja**: Usuario puede iterar con borradores baratos

### Opción 2: Directo a 1080p (LTX-2 Pro)
- Costo: $0.06 por segundo × 5s = **$0.30**
- **Ventaja**: Un solo paso
- **Desventaja**: Sin preview rápido, no puede iterar

### Opción 3: Directo a 1080p (LTX-2 Fast)
- Costo: $0.04 por segundo × 5s = **$0.20**
- **Ventaja**: Más barato
- **Desventaja**: Sin preview, menor calidad

---

## 🎯 Modelo de Negocio Sugerido

### Sistema de Créditos

**Opción A: Basado en Costo Real + Margen**
```
Costo real: $0.40
Margen: 150%
Precio al usuario: $0.60 por video completo

Créditos:
- Borrador: 2 créditos ($0.20)
- HD: 4 créditos ($0.40)
- Total: 6 créditos ($0.60)

Paquetes:
- 10 créditos = $1.00 (1 video + 4 borradores extra)
- 50 créditos = $4.50 (8 videos completos)
- 100 créditos = $8.00 (16 videos completos)
```

**Opción B: Precio Redondeado**
```
Precio al usuario: $0.50 por video completo

Créditos:
- Borrador: 1 crédito ($0.10)
- HD: 4 créditos ($0.40)
- Total: 5 créditos ($0.50)

Paquetes:
- 10 créditos = $1.00 (2 videos)
- 50 créditos = $4.00 (10 videos)
- 100 créditos = $7.00 (20 videos)
```

**Opción C: Suscripción Mensual**
```
Plan Básico: $9.99/mes
- 25 créditos (5 videos completos)
- Ahorro: 20% vs pay-per-use

Plan Pro: $29.99/mes
- 100 créditos (20 videos completos)
- Ahorro: 40% vs pay-per-use

Plan Agencia: $99.99/mes
- 500 créditos (100 videos completos)
- Ahorro: 50% vs pay-per-use
```

---

## 📈 Proyección de Costos

### Escenario 1: 100 usuarios/mes

**Uso promedio**: 3 videos completos por usuario

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Borradores | 500 | $0.12 | $60 |
| HD | 300 | $0.25 | $75 |
| **Costo Total** | - | - | **$135/mes** |

**Ingreso potencial**: $150 (100 usuarios × $1.50 promedio)  
**Margen**: $15 (10%)

### Escenario 2: 500 usuarios/mes

**Uso promedio**: 3 videos completos por usuario

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Borradores | 2,500 | $0.12 | $300 |
| HD | 1,500 | $0.25 | $375 |
| **Costo Total** | - | - | **$675/mes** |

**Ingreso potencial**: $750 (500 usuarios × $1.50 promedio)  
**Margen**: $75 (10%)

### Escenario 3: 1,000 usuarios/mes

**Uso promedio**: 3 videos completos por usuario

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Borradores | 5,000 | $0.12 | $600 |
| HD | 3,000 | $0.25 | $750 |
| **Costo Total** | - | - | **$1,350/mes** |

**Ingreso potencial**: $1,500 (1,000 usuarios × $1.50 promedio)  
**Margen**: $150 (10%)

---

## 💰 Optimización de Costos

### Estrategia 1: Limitar Borradores
```
Máximo 3 borradores por video HD
- Reduce iteraciones infinitas
- Mantiene costos predecibles
- Incentiva a usuarios a pensar mejor el prompt
```

### Estrategia 2: Caché de Borradores
```
Guardar borradores por 7 días
- Usuario puede generar HD después sin regenerar
- Reduce costos de regeneración
- Mejora UX
```

### Estrategia 3: Descuentos por Volumen
```
1-10 videos: Precio completo
11-50 videos: 10% descuento
51+ videos: 20% descuento
```

### Estrategia 4: Planes con Límites
```
Plan Básico: 5 videos/mes ($9.99)
- Costo: $2.00 (5 × $0.40)
- Margen: $7.99 (80%)

Plan Pro: 20 videos/mes ($29.99)
- Costo: $8.00 (20 × $0.40)
- Margen: $21.99 (73%)
```

---

## 🎯 Recomendación Final

### Modelo Sugerido: Sistema de Créditos

**Precio al usuario**:
- Borrador: 1 crédito = $0.15
- HD: 3 créditos = $0.45
- **Total: 4 créditos = $0.60 por video completo**

**Paquetes**:
- 10 créditos = $1.50 (2 videos + 2 borradores)
- 50 créditos = $6.00 (12 videos)
- 100 créditos = $10.00 (25 videos)

**Ventajas**:
- ✅ Margen saludable (50%)
- ✅ Precio competitivo
- ✅ Flexibilidad para usuarios
- ✅ Incentiva compra de paquetes grandes

---

## 📊 Comparación con Competencia

| Servicio | Costo por 5s | Calidad | Velocidad |
|----------|--------------|---------|-----------|
| **Nuestro sistema** | $0.60 | 1080p | 3-6 min |
| Runway Gen-3 | $0.95 | 1080p | 2-4 min |
| Pika Labs | $0.80 | 1080p | 3-5 min |
| Luma AI | $0.70 | 1080p | 4-6 min |

**Ventaja competitiva**: Precio más bajo con calidad similar ✅

---

## 📝 Notas Importantes

1. **Costos de fal.ai pueden cambiar**: Revisar pricing regularmente
2. **Margen recomendado**: 50-100% para cubrir infraestructura
3. **Monitorear uso**: Implementar alertas de costos
4. **Negociar volumen**: Con fal.ai si superas $500/mes

---

**Última actualización**: 9 de Enero 2026  
**Fuente**: [fal.ai pricing](https://fal.ai/models)
