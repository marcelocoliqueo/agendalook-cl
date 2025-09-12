# 🧪 Tarjetas de Prueba MercadoPago Chile

## 📋 Tarjetas Oficiales de Prueba

### **Visa (Recomendada)**
- **Número:** `4168 8188 4444 7115`
- **CVV:** `123`
- **Vencimiento:** `11/30`
- **Tipo:** Visa

### **Mastercard**
- **Número:** `5416 7526 0258 2580`
- **CVV:** `123`
- **Vencimiento:** `11/30`
- **Tipo:** Mastercard

### **American Express**
- **Número:** `3757 781744 61804`
- **CVV:** `1234`
- **Vencimiento:** `11/30`
- **Tipo:** American Express

### **Mastercard Débito**
- **Número:** `5241 0198 2664 6950`
- **CVV:** `123`
- **Vencimiento:** `11/30`
- **Tipo:** Mastercard Débito

### **Visa Débito**
- **Número:** `4023 6535 2391 4373`
- **CVV:** `123`
- **Vencimiento:** `11/30`
- **Tipo:** Visa Débito

## 🎯 Estados de Pago por Nombre del Titular

### **APRO** - Pago Aprobado ✅
- **Nombre:** `APRO`
- **RUT:** `11111111-1`
- **Resultado:** Pago exitoso

### **OTHE** - Rechazado por Error General ❌
- **Nombre:** `OTHE`
- **RUT:** `11111111-1`
- **Resultado:** Error general

### **CONT** - Pendiente de Pago ⏳
- **Nombre:** `CONT`
- **RUT:** `11111111-1`
- **Resultado:** Pendiente

### **CALL** - Rechazado con Validación 📞
- **Nombre:** `CALL`
- **RUT:** `11111111-1`
- **Resultado:** Requiere autorización

### **FUND** - Fondos Insuficientes 💰
- **Nombre:** `FUND`
- **RUT:** `11111111-1`
- **Resultado:** Sin fondos

### **SECU** - Código de Seguridad Inválido 🔒
- **Nombre:** `SECU`
- **RUT:** `11111111-1`
- **Resultado:** CVV inválido

### **EXPI** - Problema de Fecha 📅
- **Nombre:** `EXPI`
- **RUT:** `11111111-1`
- **Resultado:** Tarjeta expirada

### **FORM** - Error de Formulario 📝
- **Nombre:** `FORM`
- **RUT:** `11111111-1`
- **Resultado:** Error de datos

## 🚀 Cómo Usar

1. **Para pruebas exitosas:** Usa `APRO` como nombre del titular
2. **Para probar errores:** Usa los otros nombres según el error deseado
3. **RUT:** Siempre usar `123456789` para pruebas
4. **CVV:** Usar `123` (excepto Amex que usa `1234`)

## ⚠️ Importante

- **Solo usar estas tarjetas oficiales**
- **No usar tarjetas reales**
- **No inventar números de tarjeta**
- **Usar solo en ambiente de sandbox**
