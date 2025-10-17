import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * API para verificar disponibilidad de business_slug
 * GET /api/slug/check?slug=mi-negocio
 */

// Función para generar sugerencias de slugs alternativos
function generateSuggestions(baseSlug: string): string[] {
  const suggestions: string[] = [];
  const timestamp = Date.now().toString().slice(-4);

  // Sugerencias con números
  suggestions.push(`${baseSlug}-${timestamp}`);
  suggestions.push(`${baseSlug}-cl`);
  suggestions.push(`${baseSlug}-spa`);
  suggestions.push(`${baseSlug}-studio`);

  // Sugerencias con variaciones
  const words = baseSlug.split('-');
  if (words.length > 1) {
    // Invertir orden
    suggestions.push(words.reverse().join('-'));
    // Solo primer palabra
    suggestions.push(words[0]);
  }

  return suggestions.slice(0, 5); // Máximo 5 sugerencias
}

// Función para validar formato del slug
function validateSlugFormat(slug: string): { valid: boolean; error?: string } {
  // Solo letras minúsculas, números y guiones
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slug || slug.length === 0) {
    return { valid: false, error: 'El slug no puede estar vacío' };
  }

  if (slug.length < 3) {
    return { valid: false, error: 'El slug debe tener al menos 3 caracteres' };
  }

  if (slug.length > 50) {
    return { valid: false, error: 'El slug no puede tener más de 50 caracteres' };
  }

  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'Solo se permiten letras minúsculas, números y guiones (sin espacios ni caracteres especiales)'
    };
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'El slug no puede comenzar o terminar con guión' };
  }

  if (slug.includes('--')) {
    return { valid: false, error: 'El slug no puede tener guiones consecutivos' };
  }

  // Slugs reservados
  const reservedSlugs = [
    'admin', 'api', 'dashboard', 'login', 'register', 'auth',
    'about', 'contact', 'help', 'terms', 'privacy', 'pricing',
    'blog', 'docs', 'support', 'app', 'www', 'ftp', 'mail',
    'agendalook', 'supabase', 'vercel', 'mercadopago'
  ];

  if (reservedSlugs.includes(slug)) {
    return { valid: false, error: 'Este nombre está reservado, por favor elige otro' };
  }

  return { valid: true };
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'El parámetro "slug" es requerido' },
        { status: 400 }
      );
    }

    // Normalizar slug (lowercase, trim)
    const normalizedSlug = slug.toLowerCase().trim();

    // Validar formato
    const formatValidation = validateSlugFormat(normalizedSlug);
    if (!formatValidation.valid) {
      return NextResponse.json({
        available: false,
        reason: 'invalid_format',
        error: formatValidation.error,
        suggestions: []
      });
    }

    // Verificar disponibilidad en base de datos
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('professionals')
      .select('id, business_name')
      .eq('business_slug', normalizedSlug)
      .maybeSingle();

    if (error) {
      console.error('Error checking slug availability:', error);
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad' },
        { status: 500 }
      );
    }

    // Si existe, generar sugerencias
    if (data) {
      const suggestions = generateSuggestions(normalizedSlug);

      return NextResponse.json({
        available: false,
        reason: 'already_taken',
        message: `El link "${normalizedSlug}" ya está en uso`,
        suggestions,
        takenBy: data.business_name // Info adicional (opcional)
      });
    }

    // Disponible
    return NextResponse.json({
      available: true,
      slug: normalizedSlug,
      preview: `https://agendalook.cl/${normalizedSlug}`,
      message: `¡Perfecto! "${normalizedSlug}" está disponible`
    });

  } catch (error) {
    console.error('Error in slug check API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
