import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * API para subir logo del negocio
 * POST /api/upload/logo
 *
 * Body: FormData con campo 'logo'
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

export async function POST(request: NextRequest) {
  try {
    // Obtener usuario autenticado
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener FormData
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Tipo de archivo no permitido',
          allowedTypes: ['PNG', 'JPG', 'WEBP', 'SVG']
        },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'El archivo es demasiado grande',
          maxSize: '5MB',
          currentSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
        },
        { status: 400 }
      );
    }

    // Generar nombre único del archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('business-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // No sobrescribir si existe
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      return NextResponse.json(
        { error: 'Error al subir el archivo', details: uploadError.message },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('business-assets')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Error al obtener URL pública' },
        { status: 500 }
      );
    }

    // Actualizar perfil del profesional con la URL del logo
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      console.error('Error finding professional:', profError);
      return NextResponse.json(
        { error: 'No se encontró el perfil profesional' },
        { status: 404 }
      );
    }

    // Actualizar logo_url
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        logo_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', professional.id);

    if (updateError) {
      console.error('Error updating professional:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
      message: 'Logo subido exitosamente'
    });

  } catch (error) {
    console.error('Error in upload logo API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para eliminar logo anterior
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener URL del logo actual
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, logo_url')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      return NextResponse.json(
        { error: 'No se encontró el perfil' },
        { status: 404 }
      );
    }

    if (!professional.logo_url) {
      return NextResponse.json(
        { message: 'No hay logo para eliminar' },
        { status: 200 }
      );
    }

    // Extraer el path del archivo de la URL
    const urlParts = professional.logo_url.split('/');
    const filePath = `logos/${urlParts[urlParts.length - 1]}`;

    // Eliminar de Storage
    const { error: deleteError } = await supabase.storage
      .from('business-assets')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting from storage:', deleteError);
    }

    // Actualizar BD para quitar logo_url
    await supabase
      .from('professionals')
      .update({
        logo_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', professional.id);

    return NextResponse.json({
      success: true,
      message: 'Logo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error in delete logo API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
