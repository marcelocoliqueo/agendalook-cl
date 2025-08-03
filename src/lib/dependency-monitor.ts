interface DependencyVulnerability {
  id: string;
  package: string;
  version: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  recommendation: string;
  published: string;
}

interface DependencyInfo {
  name: string;
  version: string;
  latest: string;
  outdated: boolean;
  vulnerabilities: DependencyVulnerability[];
}

interface DependencyAuditResult {
  totalDependencies: number;
  outdatedDependencies: number;
  vulnerableDependencies: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  dependencies: DependencyInfo[];
  timestamp: string;
}

class DependencyMonitor {
  private static instance: DependencyMonitor;
  private vulnerabilities: DependencyVulnerability[] = [];

  private constructor() {
    this.initializeKnownVulnerabilities();
  }

  static getInstance(): DependencyMonitor {
    if (!DependencyMonitor.instance) {
      DependencyMonitor.instance = new DependencyMonitor();
    }
    return DependencyMonitor.instance;
  }

  private initializeKnownVulnerabilities() {
    // Vulnerabilidades conocidas (en producción, esto vendría de una API)
    this.vulnerabilities = [
      {
        id: 'CVE-2023-1234',
        package: 'react',
        version: '18.0.0',
        severity: 'medium',
        title: 'XSS vulnerability in React',
        description: 'Cross-site scripting vulnerability in React DOM',
        cve: 'CVE-2023-1234',
        cvss: 6.1,
        recommendation: 'Update to React 18.2.0 or later',
        published: '2023-01-15',
      },
      {
        id: 'CVE-2023-5678',
        package: 'next',
        version: '13.0.0',
        severity: 'high',
        title: 'Server-side request forgery in Next.js',
        description: 'SSRF vulnerability in Next.js image optimization',
        cve: 'CVE-2023-5678',
        cvss: 7.5,
        recommendation: 'Update to Next.js 13.4.0 or later',
        published: '2023-03-20',
      },
    ];
  }

  // Obtener información de dependencias del package.json
  async getDependencies(): Promise<DependencyInfo[]> {
    try {
      // En un entorno real, leerías el package.json
      const dependencies: DependencyInfo[] = [
        {
          name: 'react',
          version: '18.2.0',
          latest: '18.2.0',
          outdated: false,
          vulnerabilities: [],
        },
        {
          name: 'next',
          version: '15.4.5',
          latest: '15.4.5',
          outdated: false,
          vulnerabilities: [],
        },
        {
          name: '@supabase/supabase-js',
          version: '2.39.3',
          latest: '2.39.3',
          outdated: false,
          vulnerabilities: [],
        },
        {
          name: 'mercadopago',
          version: '2.8.0',
          latest: '2.8.0',
          outdated: false,
          vulnerabilities: [],
        },
      ];

      // Verificar vulnerabilidades para cada dependencia
      for (const dep of dependencies) {
        dep.vulnerabilities = this.getVulnerabilitiesForPackage(dep.name, dep.version);
      }

      return dependencies;
    } catch (error) {
      console.error('Error getting dependencies:', error);
      return [];
    }
  }

  // Obtener vulnerabilidades para un paquete específico
  getVulnerabilitiesForPackage(packageName: string, version: string): DependencyVulnerability[] {
    return this.vulnerabilities.filter(vuln => 
      vuln.package === packageName && this.isVersionAffected(version, vuln.version)
    );
  }

  // Verificar si una versión está afectada por una vulnerabilidad
  private isVersionAffected(currentVersion: string, vulnerableVersion: string): boolean {
    // Implementación simplificada - en producción usarías una librería como semver
    return currentVersion === vulnerableVersion;
  }

  // Verificar dependencias desactualizadas
  async checkOutdatedDependencies(): Promise<DependencyInfo[]> {
    const dependencies = await this.getDependencies();
    return dependencies.filter(dep => dep.outdated);
  }

  // Obtener vulnerabilidades críticas
  getCriticalVulnerabilities(): DependencyVulnerability[] {
    return this.vulnerabilities.filter(vuln => vuln.severity === 'critical');
  }

  // Obtener vulnerabilidades por severidad
  getVulnerabilitiesBySeverity(severity: DependencyVulnerability['severity']): DependencyVulnerability[] {
    return this.vulnerabilities.filter(vuln => vuln.severity === severity);
  }

  // Auditoría completa de dependencias
  async auditDependencies(): Promise<DependencyAuditResult> {
    console.log('🔍 Iniciando auditoría de dependencias...');

    const dependencies = await this.getDependencies();
    const outdatedDeps = dependencies.filter(dep => dep.outdated);
    const vulnerableDeps = dependencies.filter(dep => dep.vulnerabilities.length > 0);

    const criticalVulns = this.getCriticalVulnerabilities().length;
    const highVulns = this.getVulnerabilitiesBySeverity('high').length;
    const mediumVulns = this.getVulnerabilitiesBySeverity('medium').length;
    const lowVulns = this.getVulnerabilitiesBySeverity('low').length;

    const result: DependencyAuditResult = {
      totalDependencies: dependencies.length,
      outdatedDependencies: outdatedDeps.length,
      vulnerableDependencies: vulnerableDeps.length,
      criticalVulnerabilities: criticalVulns,
      highVulnerabilities: highVulns,
      mediumVulnerabilities: mediumVulns,
      lowVulnerabilities: lowVulns,
      dependencies,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Resultado de auditoría de dependencias:', result);

    return result;
  }

  // Generar reporte de dependencias
  generateDependencyReport(result: DependencyAuditResult): string {
    let report = `# 📦 Reporte de Auditoría de Dependencias\n\n`;
    report += `**Fecha**: ${new Date(result.timestamp).toLocaleString()}\n\n`;
    
    report += `## 📊 Resumen\n\n`;
    report += `- **Total de dependencias**: ${result.totalDependencies}\n`;
    report += `- **Dependencias desactualizadas**: ${result.outdatedDependencies}\n`;
    report += `- **Dependencias vulnerables**: ${result.vulnerableDependencies}\n`;
    report += `- **Vulnerabilidades críticas**: ${result.criticalVulnerabilities}\n`;
    report += `- **Vulnerabilidades altas**: ${result.highVulnerabilities}\n`;
    report += `- **Vulnerabilidades medias**: ${result.mediumVulnerabilities}\n`;
    report += `- **Vulnerabilidades bajas**: ${result.lowVulnerabilities}\n\n`;

    if (result.vulnerableDependencies > 0) {
      report += `## 🚨 Dependencias Vulnerables\n\n`;
      
      result.dependencies.forEach(dep => {
        if (dep.vulnerabilities.length > 0) {
          report += `### ${dep.name}@${dep.version}\n\n`;
          dep.vulnerabilities.forEach(vuln => {
            report += `- **${vuln.severity.toUpperCase()}**: ${vuln.title}\n`;
            report += `  - **CVE**: ${vuln.cve || 'N/A'}\n`;
            report += `  - **CVSS**: ${vuln.cvss || 'N/A'}\n`;
            report += `  - **Descripción**: ${vuln.description}\n`;
            report += `  - **Recomendación**: ${vuln.recommendation}\n\n`;
          });
        }
      });
    }

    if (result.outdatedDependencies > 0) {
      report += `## ⚠️ Dependencias Desactualizadas\n\n`;
      
      result.dependencies.forEach(dep => {
        if (dep.outdated) {
          report += `- **${dep.name}**: ${dep.version} → ${dep.latest}\n`;
        }
      });
      report += `\n`;
    }

    if (result.vulnerableDependencies === 0 && result.outdatedDependencies === 0) {
      report += `## ✅ Todas las dependencias están actualizadas y seguras\n\n`;
    }

    return report;
  }

  // Verificar si hay vulnerabilidades críticas
  hasCriticalVulnerabilities(): boolean {
    return this.getCriticalVulnerabilities().length > 0;
  }

  // Obtener recomendaciones de actualización
  getUpdateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.vulnerabilities.forEach(vuln => {
      if (vuln.severity === 'critical' || vuln.severity === 'high') {
        recommendations.push(`${vuln.package}: ${vuln.recommendation}`);
      }
    });

    return recommendations;
  }
}

export const dependencyMonitor = DependencyMonitor.getInstance();

// Función helper para ejecutar auditoría de dependencias
export async function runDependencyAudit(): Promise<DependencyAuditResult> {
  return await dependencyMonitor.auditDependencies();
}

// Función helper para generar reporte de dependencias
export function generateDependencyReport(result: DependencyAuditResult): string {
  return dependencyMonitor.generateDependencyReport(result);
}

// Función helper para verificar vulnerabilidades críticas
export function hasCriticalDependencyVulnerabilities(): boolean {
  return dependencyMonitor.hasCriticalVulnerabilities();
} 