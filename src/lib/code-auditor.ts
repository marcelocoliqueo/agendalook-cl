interface SecurityVulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'sql_injection' | 'xss' | 'csrf' | 'auth_bypass' | 'info_disclosure' | 'insecure_config';
  file: string;
  line: number;
  description: string;
  recommendation: string;
  code?: string;
}

interface AuditResult {
  vulnerabilities: SecurityVulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  timestamp: string;
}

class CodeAuditor {
  private static instance: CodeAuditor;
  private vulnerabilities: SecurityVulnerability[] = [];

  private constructor() {}

  static getInstance(): CodeAuditor {
    if (!CodeAuditor.instance) {
      CodeAuditor.instance = new CodeAuditor();
    }
    return CodeAuditor.instance;
  }

  // Detectar SQL Injection
  detectSQLInjection(code: string, file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    // Patrones peligrosos
    const dangerousPatterns = [
      {
        pattern: /\.query\s*\(\s*['"`][^'"`]*\$\{[^}]*\}[^'"`]*['"`]/g,
        description: 'Posible SQL Injection con template literals',
        recommendation: 'Usar parámetros preparados o ORM',
      },
      {
        pattern: /\.query\s*\(\s*['"`][^'"`]*\s*\+\s*[^'"`]+[^'"`]*['"`]/g,
        description: 'Posible SQL Injection con concatenación',
        recommendation: 'Usar parámetros preparados o ORM',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          vulnerabilities.push({
            id: `sql_injection_${file}_${index}`,
            severity: 'critical',
            type: 'sql_injection',
            file,
            line: index + 1,
            description: pattern.description,
            recommendation: pattern.recommendation,
            code: line.trim(),
          });
        }
      });
    });

    return vulnerabilities;
  }

  // Detectar XSS
  detectXSS(code: string, file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    const dangerousPatterns = [
      {
        pattern: /dangerouslySetInnerHTML\s*=\s*\{[^}]*\}/g,
        description: 'Uso de dangerouslySetInnerHTML sin sanitización',
        recommendation: 'Sanitizar contenido antes de renderizar',
      },
      {
        pattern: /innerHTML\s*=\s*[^;]+/g,
        description: 'Uso directo de innerHTML',
        recommendation: 'Usar textContent o sanitizar contenido',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          vulnerabilities.push({
            id: `xss_${file}_${index}`,
            severity: 'high',
            type: 'xss',
            file,
            line: index + 1,
            description: pattern.description,
            recommendation: pattern.recommendation,
            code: line.trim(),
          });
        }
      });
    });

    return vulnerabilities;
  }

  // Detectar configuraciones inseguras
  detectInsecureConfig(code: string, file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    const dangerousPatterns = [
      {
        pattern: /NODE_ENV\s*=\s*['"]production['"][^}]*debug\s*:\s*true/g,
        description: 'Debug habilitado en producción',
        recommendation: 'Deshabilitar debug en producción',
      },
      {
        pattern: /process\.env\.\w+\s*=\s*['"][^'"]*['"]/g,
        description: 'Variables de entorno hardcodeadas',
        recommendation: 'Usar archivos .env para variables sensibles',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          vulnerabilities.push({
            id: `config_${file}_${index}`,
            severity: 'medium',
            type: 'insecure_config',
            file,
            line: index + 1,
            description: pattern.description,
            recommendation: pattern.recommendation,
            code: line.trim(),
          });
        }
      });
    });

    return vulnerabilities;
  }

  // Detectar bypass de autenticación
  detectAuthBypass(code: string, file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    const dangerousPatterns = [
      {
        pattern: /if\s*\(\s*!session\s*\)\s*\{[^}]*return\s*null/g,
        description: 'Posible bypass de autenticación',
        recommendation: 'Verificar autenticación en todas las rutas protegidas',
      },
      {
        pattern: /auth\.getUser\(\)\s*\.catch/g,
        description: 'Manejo inseguro de errores de autenticación',
        recommendation: 'Manejar errores de autenticación apropiadamente',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          vulnerabilities.push({
            id: `auth_${file}_${index}`,
            severity: 'critical',
            type: 'auth_bypass',
            file,
            line: index + 1,
            description: pattern.description,
            recommendation: pattern.recommendation,
            code: line.trim(),
          });
        }
      });
    });

    return vulnerabilities;
  }

  // Detectar información sensible expuesta
  detectInfoDisclosure(code: string, file: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    const sensitivePatterns = [
      {
        pattern: /console\.log\s*\(\s*process\.env\.\w+/g,
        description: 'Logging de variables de entorno',
        recommendation: 'No loggear información sensible',
      },
      {
        pattern: /password.*=.*['"][^'"]*['"]/g,
        description: 'Contraseñas hardcodeadas',
        recommendation: 'Usar variables de entorno para contraseñas',
      },
      {
        pattern: /api_key.*=.*['"][^'"]*['"]/g,
        description: 'API keys hardcodeadas',
        recommendation: 'Usar variables de entorno para API keys',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      sensitivePatterns.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          vulnerabilities.push({
            id: `info_${file}_${index}`,
            severity: 'high',
            type: 'info_disclosure',
            file,
            line: index + 1,
            description: pattern.description,
            recommendation: pattern.recommendation,
            code: line.trim(),
          });
        }
      });
    });

    return vulnerabilities;
  }

  // Auditoría completa de un archivo
  auditFile(filePath: string, code: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    // Ejecutar todas las detecciones
    vulnerabilities.push(...this.detectSQLInjection(code, filePath));
    vulnerabilities.push(...this.detectXSS(code, filePath));
    vulnerabilities.push(...this.detectInsecureConfig(code, filePath));
    vulnerabilities.push(...this.detectAuthBypass(code, filePath));
    vulnerabilities.push(...this.detectInfoDisclosure(code, filePath));

    return vulnerabilities;
  }

  // Auditoría completa del proyecto
  async auditProject(): Promise<AuditResult> {
    const vulnerabilities: SecurityVulnerability[] = [];
    
    // En un entorno real, aquí escanearías todos los archivos del proyecto
    // Por ahora, simulamos la auditoría
    console.log('🔍 Iniciando auditoría de seguridad del código...');

    // Simular hallazgos (en producción, esto sería real)
    const mockVulnerabilities: SecurityVulnerability[] = [
      {
        id: 'mock_1',
        severity: 'medium',
        type: 'info_disclosure',
        file: 'src/app/api/auth/login/route.ts',
        line: 25,
        description: 'Posible logging de información sensible',
        recommendation: 'Revisar logs de autenticación',
      },
    ];

    vulnerabilities.push(...mockVulnerabilities);

    const summary = {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
    };

    const result: AuditResult = {
      vulnerabilities,
      summary,
      timestamp: new Date().toISOString(),
    };

    // Log del resultado
    console.log('📊 Resultado de auditoría:', result);

    return result;
  }

  // Generar reporte de auditoría
  generateAuditReport(result: AuditResult): string {
    let report = `# 🔒 Reporte de Auditoría de Seguridad\n\n`;
    report += `**Fecha**: ${new Date(result.timestamp).toLocaleString()}\n\n`;
    
    report += `## 📊 Resumen\n\n`;
    report += `- **Total de vulnerabilidades**: ${result.summary.total}\n`;
    report += `- **Críticas**: ${result.summary.critical}\n`;
    report += `- **Altas**: ${result.summary.high}\n`;
    report += `- **Medias**: ${result.summary.medium}\n`;
    report += `- **Bajas**: ${result.summary.low}\n\n`;

    if (result.vulnerabilities.length > 0) {
      report += `## 🚨 Vulnerabilidades Encontradas\n\n`;
      
      result.vulnerabilities.forEach(vuln => {
        report += `### ${vuln.severity.toUpperCase()}: ${vuln.description}\n\n`;
        report += `- **Archivo**: \`${vuln.file}:${vuln.line}\`\n`;
        report += `- **Tipo**: ${vuln.type}\n`;
        report += `- **Recomendación**: ${vuln.recommendation}\n`;
        if (vuln.code) {
          report += `- **Código**: \`${vuln.code}\`\n`;
        }
        report += `\n`;
      });
    } else {
      report += `## ✅ No se encontraron vulnerabilidades críticas\n\n`;
    }

    return report;
  }
}

export const codeAuditor = CodeAuditor.getInstance();

// Función helper para ejecutar auditoría
export async function runSecurityAudit(): Promise<AuditResult> {
  return await codeAuditor.auditProject();
}

// Función helper para generar reporte
export function generateSecurityReport(result: AuditResult): string {
  return codeAuditor.generateAuditReport(result);
} 