# Mejora: Nombres de Niveles de Realidad 1.0 y 1.5

## Cambios Realizados

Se actualizaron los nombres de los dos primeros niveles del regulador de realidad para hacerlos más intuitivos y fáciles de entender para usuarios chilenos.

## Cambios Específicos

### Nivel 1.0 ★
**ANTES:**
- Label: "CCTV / Seguridad" 📸
- Perfil Técnico: "Evidencia / Seguridad"

**DESPUÉS:**
- Label: "Celular Antiguo" 📱
- Perfil Técnico: "Celular 2010 / Muy pixelado"

### Nivel 1.5 ★
**ANTES:**
- Label: "Cámara Espía" 📱
- Perfil Técnico: "Captura 'In fraganti'"

**DESPUÉS:**
- Label: "Celular Viejo" 📱
- Perfil Técnico: "Celular 2015 / Granulado"

## Razones del Cambio

### Más Intuitivo
- "Celular Antiguo" y "Celular Viejo" son términos que todos entienden
- "CCTV/Seguridad" y "Cámara Espía" pueden sonar confusos o negativos

### Progresión Lógica
La nueva nomenclatura crea una narrativa clara de evolución tecnológica:
```
1.0 ★ - Celular Antiguo 📱    (2010, muy pixelado)
1.5 ★ - Celular Viejo 📱      (2015, granulado)
2.0 ★ - Celular Básico 📱     (2018, aceptable)
2.5 ★ - Auténtico Local 🏪    (actual, natural)
```

### Más Amigable
- Evita connotaciones negativas de "espía" o "seguridad"
- Mantiene el concepto de baja calidad pero de forma más neutral
- Fácil de entender para cualquier usuario

## Beneficios

✅ **Claridad**: Usuarios entienden inmediatamente qué esperar
✅ **Coherencia**: Progresión lógica de celular antiguo → viejo → básico
✅ **Neutralidad**: Sin connotaciones negativas
✅ **Accesibilidad**: Lenguaje cotidiano y familiar

## Progresión Completa Actualizada

```
1.0 ★ - Celular Antiguo 📱      (Muy pixelado, 480p)
1.5 ★ - Celular Viejo 📱        (Granulado, 720p) ← PREDETERMINADO
2.0 ★ - Celular Básico 📱       (Aceptable, 1080p)
2.5 ★ - Auténtico Local 🏪      (Natural, moderno) ← PUNTO DULCE
3.0 ★ - Semi-Pro 📷             (DSLR, profesional)
3.5 ★ - Comercial 🏢            (Estudio, comercial)
4.0 ★ - Editorial ✨            (Revista, editorial)
4.5 ★ - Premium Ad 💎           (Alta gama, ads)
5.0 ★ - Cinematográfico 🏆      (Cine, lujo)
```

## Archivos Modificados
- `services/realityMapper.ts` (líneas 89-108)
- `App.tsx` (líneas 218, 958)

## Impacto en Usuario
- El cambio es solo cosmético en la UI
- No afecta la generación de imágenes
- Mejora la comprensión del sistema
- Mantiene el nivel 1.5 como predeterminado

## Fecha
8 de enero de 2026
