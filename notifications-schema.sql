-- Sistema de Notificaciones para Agendalook
-- Crear tabla de notificaciones

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'new_booking',
    'booking_confirmed',
    'booking_cancelled',
    'payment_reminder',
    'subscription_grace_period',
    'subscription_suspended',
    'subscription_expired',
    'system_maintenance',
    'welcome_message',
    'service_created',
    'availability_updated'
  )),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_professional_id ON notifications(professional_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Función para crear notificaciones
CREATE OR REPLACE FUNCTION create_notification(
  p_professional_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_priority VARCHAR(20) DEFAULT 'normal',
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_user_id UUID;
BEGIN
  -- Obtener user_id del profesional
  SELECT user_id INTO v_user_id 
  FROM professionals 
  WHERE id = p_professional_id;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Professional not found';
  END IF;
  
  -- Crear la notificación
  INSERT INTO notifications (
    professional_id,
    user_id,
    type,
    title,
    message,
    data,
    priority,
    expires_at
  ) VALUES (
    p_professional_id,
    v_user_id,
    p_type,
    p_title,
    p_message,
    p_data,
    p_priority,
    p_expires_at
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Función para marcar notificación como leída
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications 
  SET is_read = TRUE 
  WHERE id = p_notification_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para marcar todas las notificaciones como leídas
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_professional_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET is_read = TRUE 
  WHERE professional_id = p_professional_id AND is_read = FALSE;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener notificaciones no leídas
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_professional_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM notifications
  WHERE professional_id = p_professional_id 
    AND is_read = FALSE 
    AND is_archived = FALSE
    AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar notificaciones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM notifications 
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND is_read = TRUE;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Políticas RLS para notificaciones
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política para usuarios autenticados pueden ver sus notificaciones
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuarios autenticados pueden actualizar sus notificaciones
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para el sistema puede crear notificaciones
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE notifications IS 'Sistema de notificaciones para profesionales';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificación: new_booking, payment_reminder, etc.';
COMMENT ON COLUMN notifications.priority IS 'Prioridad: low, normal, high, urgent';
COMMENT ON COLUMN notifications.data IS 'Datos adicionales en formato JSON';
COMMENT ON COLUMN notifications.expires_at IS 'Fecha de expiración de la notificación'; 