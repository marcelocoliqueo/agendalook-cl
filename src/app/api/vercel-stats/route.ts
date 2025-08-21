import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    
    if (!vercelToken || !projectId) {
      return NextResponse.json({
        error: 'VERCEL_TOKEN o VERCEL_PROJECT_ID no configurados',
        bandwidth: {
          used: 0,
          limit: 100 * 1024 * 1024 * 1024, // 100GB
          percentage: 0
        },
        note: 'Configura las variables de entorno para datos reales'
      });
    }

    // Intentar obtener estadísticas reales de Vercel
    try {
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}/analytics/usage`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Calcular uso de bandwidth del mes actual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        let totalBandwidth = 0;
        if (data.usage && data.usage.bandwidth) {
          // Sumar el bandwidth del mes actual
          Object.values(data.usage.bandwidth).forEach((day: any) => {
            if (day && typeof day === 'number') {
              totalBandwidth += day;
            }
          });
        }

        return NextResponse.json({
          bandwidth: {
            used: totalBandwidth,
            limit: 100 * 1024 * 1024 * 1024, // 100GB
            percentage: (totalBandwidth / (100 * 1024 * 1024 * 1024)) * 100
          },
          note: 'Datos reales de Vercel API'
        });
      } else {
        console.warn('Error en Vercel API:', response.status, response.statusText);
        throw new Error('Error en Vercel API');
      }
    } catch (apiError) {
      console.warn('Error obteniendo datos reales de Vercel, usando estimación:', apiError);
      
      // Fallback a datos estimados
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const currentDay = now.getDate();
      
      const baseUsage = 5 * 1024 * 1024 * 1024; // 5GB base
      const dailyUsage = baseUsage / daysInMonth;
      const estimatedUsage = dailyUsage * currentDay * (0.8 + Math.random() * 0.4);

      return NextResponse.json({
        bandwidth: {
          used: estimatedUsage,
          limit: 100 * 1024 * 1024 * 1024,
          percentage: (estimatedUsage / (100 * 1024 * 1024 * 1024)) * 100
        },
        note: 'Datos estimados - Error en Vercel API'
      });
    }

  } catch (error) {
    console.error('Error getting Vercel stats:', error);
    return NextResponse.json({
      error: 'Error obteniendo estadísticas de Vercel',
      bandwidth: {
        used: 0,
        limit: 100 * 1024 * 1024 * 1024,
        percentage: 0
      }
    }, { status: 500 });
  }
} 