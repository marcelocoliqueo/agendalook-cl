# 📧 Guía de Entregabilidad de Emails

## 🎯 Mejores Prácticas para Evitar Spam

### 1. Configuración Técnica

#### Headers Recomendados
```javascript
headers: {
  'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>',
  'X-Priority': '3',
  'X-MSMail-Priority': 'Normal',
  'Importance': 'normal',
  'Precedence': 'bulk',
  'X-Auto-Response-Suppress': 'OOF, AutoReply'
}
```

#### Configuración de Remitente
```javascript
{
  from: 'Agendalook <onboarding@resend.dev>',
  replyTo: 'soporte@agendalook.cl',
  to: [email],
  subject: 'Asunto claro y descriptivo'
}
```

### 2. Contenido del Email

#### ✅ Hacer
- **Asunto claro**: "¡Bienvenido a Agendalook! Confirma tu cuenta"
- **Remitente consistente**: Siempre usar "Agendalook"
- **Contenido relevante**: Información útil para el usuario
- **Link de baja**: Incluir opción de darse de baja
- **Información de contacto**: Email y sitio web reales
- **Contenido balanceado**: Texto e imágenes equilibrados

#### ❌ Evitar
- **Palabras spam**: "GRATIS", "GANA", "URGENTE", "$$$"
- **Mayúsculas excesivas**: "¡CONFIRMA TU CUENTA!"
- **Múltiples signos**: "!!!", "???"
- **Links sospechosos**: URLs acortadas o dudosas
- **Imágenes únicamente**: Sin texto alternativo

### 3. Configuración de Dominio

#### Para Producción
1. **Verificar dominio** en Resend
2. **Configurar SPF**: `v=spf1 include:_spf.resend.com ~all`
3. **Configurar DKIM**: Seguir instrucciones de Resend
4. **Configurar DMARC**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@agendalook.cl`

#### Ejemplo de Registros DNS
```txt
# SPF Record
agendalook.cl. IN TXT "v=spf1 include:_spf.resend.com ~all"

# DMARC Record
_dmarc.agendalook.cl. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@agendalook.cl; pct=100; sp=quarantine; adkim=r; aspf=r;"
```

### 4. Lista de Verificación

#### ✅ Antes de Enviar
- [ ] Email verificado en Resend
- [ ] Dominio configurado (para producción)
- [ ] Headers anti-spam incluidos
- [ ] Link de baja presente
- [ ] Información de contacto válida
- [ ] Asunto claro y descriptivo
- [ ] Contenido relevante y útil
- [ ] Balance texto/imagen apropiado

#### ✅ Monitoreo
- [ ] Revisar tasas de entrega
- [ ] Monitorear bounces
- [ ] Revisar quejas de spam
- [ ] Actualizar lista de emails inválidos

### 5. Configuración en Resend

#### Dashboard de Resend
1. **Verificar dominio** en la sección "Domains"
2. **Configurar webhooks** para eventos de entrega
3. **Monitorear métricas** de entregabilidad
4. **Configurar supresión** de emails bouncados

#### Webhooks Recomendados
```javascript
// Eventos a monitorear
- email.delivered
- email.bounced
- email.complained
- email.opened
- email.clicked
```

### 6. Pruebas de Entregabilidad

#### Herramientas de Prueba
- **Mail Tester**: mail-tester.com
- **GlockApps**: glockapps.com
- **250ok**: 250ok.com
- **Sender Score**: senderscore.org

#### Checklist de Prueba
- [ ] Puntuación alta en Mail Tester (>8/10)
- [ ] Sin palabras spam detectadas
- [ ] Headers técnicos correctos
- [ ] Links funcionando
- [ ] Imágenes con alt text
- [ ] Responsive design

### 7. Mejoras Implementadas

#### En el Código Actual
```javascript
// Headers anti-spam
headers: {
  'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>',
  'X-Priority': '3',
  'X-MSMail-Priority': 'Normal',
  'Importance': 'normal'
}

// Reply-to configurado
replyTo: 'soporte@agendalook.cl'

// Meta tags en HTML
<meta name="description" content="Confirma tu cuenta en Agendalook">

// Link de baja en footer
<a href="mailto:unsubscribe@agendalook.cl">Darse de baja</a>
```

### 8. Troubleshooting

#### Problema: Emails van a spam
**Solución:**
1. Verificar configuración SPF/DKIM
2. Revisar contenido por palabras spam
3. Mejorar reputación del dominio
4. Usar dominio verificado

#### Problema: Baja tasa de entrega
**Solución:**
1. Limpiar lista de emails
2. Implementar doble opt-in
3. Mejorar contenido del email
4. Monitorear bounces

#### Problema: Emails no se envían
**Solución:**
1. Verificar API key de Resend
2. Revisar límites de cuota
3. Verificar configuración de dominio
4. Revisar logs de error

### 9. Métricas a Monitorear

#### KPIs Importantes
- **Tasa de entrega**: >95%
- **Tasa de apertura**: >20%
- **Tasa de clics**: >2%
- **Tasa de bounce**: <2%
- **Tasa de spam**: <0.1%

### 10. Recursos Adicionales

#### Documentación
- [Resend Deliverability Guide](https://resend.com/docs/deliverability)
- [Email Best Practices](https://resend.com/docs/best-practices)
- [Domain Verification](https://resend.com/docs/domains)

#### Herramientas
- [Mail Tester](https://mail-tester.com)
- [Sender Score](https://senderscore.org)
- [MXToolbox](https://mxtoolbox.com)

---

**Nota**: La entregabilidad mejora con el tiempo y el uso consistente. Mantén una buena reputación enviando contenido relevante y monitoreando las métricas regularmente. 