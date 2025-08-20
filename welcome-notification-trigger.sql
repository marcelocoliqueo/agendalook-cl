-- Trigger para notificación automática de bienvenida
-- Se ejecuta cuando se inserta un nuevo profesional

CREATE OR REPLACE FUNCTION trigger_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear notificación de bienvenida automáticamente
  PERFORM create_notification(
    NEW.id, -- professional_id
    'welcome_message',
    '¡Bienvenido a Agendalook!',
    '¡Hola ' || NEW.business_name || '! Tu cuenta ha sido activada con el plan ' || COALESCE(NEW.plan, 'free') || '. Comienza a configurar tus servicios y horarios.',
    jsonb_build_object(
      'businessName', NEW.business_name,
      'plan', COALESCE(NEW.plan, 'free'),
      'email', NEW.email
    ),
    'normal',
    NULL -- sin fecha de expiración
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_welcome_notification_trigger ON professionals;
CREATE TRIGGER trigger_welcome_notification_trigger
  AFTER INSERT ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_welcome_notification();

-- Comentario para documentación
COMMENT ON FUNCTION trigger_welcome_notification() IS 'Crea automáticamente una notificación de bienvenida cuando se registra un nuevo profesional'; 