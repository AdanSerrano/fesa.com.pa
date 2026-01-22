/**
 * Web Application Firewall (WAF) Básico
 *
 * Implementa detección y bloqueo de:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - Path Traversal
 * - Command Injection
 * - LDAP Injection
 * - XML/XXE Injection
 * - Requests malformados
 * - User-Agents maliciosos
 *
 * NOTA: Este es un WAF básico de software. Para producción bancaria,
 * se recomienda complementar con Cloudflare WAF, AWS WAF, o similar.
 */

import { logWAFTriggered, type SecurityLogContext } from "./logger";
import { recordSecurityEvent } from "./alerts";
import { blockIP } from "./rate-limiter";

// ============================================================================
// TIPOS
// ============================================================================

export interface WAFResult {
  allowed: boolean;
  rule?: string;
  category?: WAFCategory;
  payload?: string;
  score: number;
}

export type WAFCategory =
  | "sql_injection"
  | "xss"
  | "path_traversal"
  | "command_injection"
  | "ldap_injection"
  | "xml_injection"
  | "malicious_user_agent"
  | "malformed_request"
  | "protocol_violation"
  | "scanner_detection"
  | "bot_detection";

export interface WAFRule {
  id: string;
  name: string;
  category: WAFCategory;
  pattern: RegExp;
  score: number;
  enabled: boolean;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// Umbral de puntuación para bloqueo
const BLOCK_THRESHOLD = 10;

// Umbral para bloqueo automático de IP
const AUTO_BLOCK_THRESHOLD = 25;
const AUTO_BLOCK_DURATION = 30 * 60 * 1000; // 30 minutos

// Contador de violaciones por IP
const violationCounts = new Map<string, { count: number; score: number; resetTime: number }>();

// ============================================================================
// REGLAS DE DETECCIÓN
// ============================================================================

export const WAF_RULES: WAFRule[] = [
  // ========================================================================
  // SQL INJECTION
  // ========================================================================
  {
    id: "sqli_union",
    name: "SQL Injection - UNION",
    category: "sql_injection",
    pattern: /(\bunion\b[\s\S]*\bselect\b)|(\bselect\b[\s\S]*\bfrom\b[\s\S]*\bwhere\b)/i,
    score: 15,
    enabled: true,
  },
  {
    id: "sqli_comment",
    name: "SQL Injection - Comments",
    category: "sql_injection",
    pattern: /(--|#|\/\*|\*\/|;--)/i,
    score: 8,
    enabled: true,
  },
  {
    id: "sqli_quotes",
    name: "SQL Injection - Quote manipulation",
    category: "sql_injection",
    pattern: /('|\"|`)\s*(or|and)\s*('|\"|`|\d)/i,
    score: 12,
    enabled: true,
  },
  {
    id: "sqli_keywords",
    name: "SQL Injection - Dangerous keywords",
    category: "sql_injection",
    pattern: /(\bdrop\b|\btruncate\b|\bdelete\b|\binsert\b|\bupdate\b|\balter\b)[\s\S]*(\btable\b|\bfrom\b|\binto\b)/i,
    score: 15,
    enabled: true,
  },
  {
    id: "sqli_functions",
    name: "SQL Injection - SQL Functions",
    category: "sql_injection",
    pattern: /(\bsleep\b|\bbenchmark\b|\bwaitfor\b|\bdelay\b|\bload_file\b|\boutfile\b)\s*\(/i,
    score: 15,
    enabled: true,
  },
  {
    id: "sqli_hex",
    name: "SQL Injection - Hex encoding",
    category: "sql_injection",
    pattern: /0x[0-9a-f]{8,}/i,
    score: 10,
    enabled: true,
  },

  // ========================================================================
  // XSS (Cross-Site Scripting)
  // ========================================================================
  {
    id: "xss_script",
    name: "XSS - Script tags",
    category: "xss",
    pattern: /<\s*script[^>]*>|<\/\s*script\s*>/i,
    score: 15,
    enabled: true,
  },
  {
    id: "xss_event_handlers",
    name: "XSS - Event handlers",
    category: "xss",
    pattern: /\b(on\w+)\s*=\s*(['"])?[^'"]*\2/i,
    score: 12,
    enabled: true,
  },
  {
    id: "xss_javascript_uri",
    name: "XSS - JavaScript URI",
    category: "xss",
    pattern: /javascript\s*:/i,
    score: 15,
    enabled: true,
  },
  {
    id: "xss_data_uri",
    name: "XSS - Data URI",
    category: "xss",
    pattern: /data\s*:\s*(text\/html|application\/javascript)/i,
    score: 12,
    enabled: true,
  },
  {
    id: "xss_vbscript",
    name: "XSS - VBScript",
    category: "xss",
    pattern: /vbscript\s*:/i,
    score: 15,
    enabled: true,
  },
  {
    id: "xss_expression",
    name: "XSS - CSS Expression",
    category: "xss",
    pattern: /expression\s*\(/i,
    score: 12,
    enabled: true,
  },
  {
    id: "xss_svg",
    name: "XSS - SVG",
    category: "xss",
    pattern: /<\s*svg[^>]*\s+on\w+\s*=/i,
    score: 12,
    enabled: true,
  },
  {
    id: "xss_iframe",
    name: "XSS - iframe injection",
    category: "xss",
    pattern: /<\s*iframe[^>]*>/i,
    score: 10,
    enabled: true,
  },

  // ========================================================================
  // PATH TRAVERSAL
  // ========================================================================
  {
    id: "path_traversal_basic",
    name: "Path Traversal - Basic",
    category: "path_traversal",
    pattern: /\.\.[\/\\]/,
    score: 12,
    enabled: true,
  },
  {
    id: "path_traversal_encoded",
    name: "Path Traversal - URL Encoded",
    category: "path_traversal",
    pattern: /(%2e%2e|%252e%252e|%c0%ae|%c1%9c)[%\/\\]/i,
    score: 15,
    enabled: true,
  },
  {
    id: "path_traversal_null",
    name: "Path Traversal - Null byte",
    category: "path_traversal",
    pattern: /%00|\\x00/i,
    score: 15,
    enabled: true,
  },
  {
    id: "path_sensitive_files",
    name: "Path Traversal - Sensitive files",
    category: "path_traversal",
    pattern: /(\/etc\/passwd|\/etc\/shadow|\.htaccess|\.htpasswd|web\.config|\.env)/i,
    score: 15,
    enabled: true,
  },

  // ========================================================================
  // COMMAND INJECTION
  // ========================================================================
  {
    id: "cmd_injection_basic",
    name: "Command Injection - Basic",
    category: "command_injection",
    pattern: /[;&|`$]\s*(cat|ls|dir|type|wget|curl|nc|bash|sh|cmd|powershell)/i,
    score: 15,
    enabled: true,
  },
  {
    id: "cmd_injection_pipe",
    name: "Command Injection - Pipe",
    category: "command_injection",
    pattern: /\|\s*(cat|ls|dir|type|wget|curl|nc|bash|sh|cmd|powershell)/i,
    score: 15,
    enabled: true,
  },
  {
    id: "cmd_injection_backtick",
    name: "Command Injection - Backtick",
    category: "command_injection",
    pattern: /`[^`]*`/,
    score: 10,
    enabled: true,
  },
  {
    id: "cmd_injection_subshell",
    name: "Command Injection - Subshell",
    category: "command_injection",
    pattern: /\$\([^)]+\)/,
    score: 10,
    enabled: true,
  },

  // ========================================================================
  // LDAP INJECTION
  // ========================================================================
  {
    id: "ldap_injection",
    name: "LDAP Injection",
    category: "ldap_injection",
    pattern: /[()&|!*\\]/g,
    score: 8,
    enabled: true,
  },

  // ========================================================================
  // XML/XXE INJECTION
  // ========================================================================
  {
    id: "xxe_entity",
    name: "XXE - Entity declaration",
    category: "xml_injection",
    pattern: /<!ENTITY\s+/i,
    score: 15,
    enabled: true,
  },
  {
    id: "xxe_system",
    name: "XXE - SYSTEM keyword",
    category: "xml_injection",
    pattern: /SYSTEM\s+["']/i,
    score: 15,
    enabled: true,
  },
  {
    id: "xxe_cdata",
    name: "XXE - CDATA with payload",
    category: "xml_injection",
    pattern: /<!\[CDATA\[.*?(javascript|vbscript|data:)/i,
    score: 12,
    enabled: true,
  },

  // ========================================================================
  // USER AGENTS MALICIOSOS
  // ========================================================================
  {
    id: "ua_sqlmap",
    name: "Malicious UA - SQLMap",
    category: "malicious_user_agent",
    pattern: /sqlmap/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_nikto",
    name: "Malicious UA - Nikto",
    category: "malicious_user_agent",
    pattern: /nikto/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_nessus",
    name: "Malicious UA - Nessus",
    category: "malicious_user_agent",
    pattern: /nessus/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_acunetix",
    name: "Malicious UA - Acunetix",
    category: "malicious_user_agent",
    pattern: /acunetix/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_nmap",
    name: "Malicious UA - Nmap",
    category: "malicious_user_agent",
    pattern: /nmap/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_masscan",
    name: "Malicious UA - Masscan",
    category: "malicious_user_agent",
    pattern: /masscan/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_dirbuster",
    name: "Malicious UA - DirBuster",
    category: "malicious_user_agent",
    pattern: /dirbuster/i,
    score: 20,
    enabled: true,
  },
  {
    id: "ua_gobuster",
    name: "Malicious UA - GoBuster",
    category: "malicious_user_agent",
    pattern: /gobuster/i,
    score: 20,
    enabled: true,
  },

  // ========================================================================
  // SCANNER DETECTION
  // ========================================================================
  {
    id: "scanner_wordpress",
    name: "Scanner - WordPress probing",
    category: "scanner_detection",
    pattern: /(wp-admin|wp-login|wp-content|xmlrpc\.php)/i,
    score: 8,
    enabled: true,
  },
  {
    id: "scanner_php",
    name: "Scanner - PHP probing",
    category: "scanner_detection",
    pattern: /(phpinfo|phpmyadmin|adminer|\.php\?)/i,
    score: 8,
    enabled: true,
  },
  {
    id: "scanner_admin",
    name: "Scanner - Admin probing",
    category: "scanner_detection",
    pattern: /(\/admin\/|\/administrator\/|\/manager\/)/i,
    score: 5,
    enabled: true,
  },
  {
    id: "scanner_git",
    name: "Scanner - Git exposure",
    category: "scanner_detection",
    pattern: /\.git\/(config|HEAD|index|objects)/i,
    score: 15,
    enabled: true,
  },
  {
    id: "scanner_env",
    name: "Scanner - Env file exposure",
    category: "scanner_detection",
    pattern: /\.env(\.|$)/i,
    score: 15,
    enabled: true,
  },

  // ========================================================================
  // PROTOCOL VIOLATIONS
  // ========================================================================
  {
    id: "protocol_http_splitting",
    name: "Protocol - HTTP Response Splitting",
    category: "protocol_violation",
    pattern: /(%0d%0a|%0d|%0a|\r\n|\r|\n)/i,
    score: 12,
    enabled: true,
  },
];

// ============================================================================
// FUNCIONES DE ANÁLISIS
// ============================================================================

/**
 * Analiza una cadena con todas las reglas WAF
 */
function analyzeString(input: string): { rule: WAFRule; match: string }[] {
  const matches: { rule: WAFRule; match: string }[] = [];

  for (const rule of WAF_RULES) {
    if (!rule.enabled) continue;

    const match = input.match(rule.pattern);
    if (match) {
      matches.push({
        rule,
        match: match[0].substring(0, 100), // Limitar tamaño del match
      });
    }
  }

  return matches;
}

/**
 * Actualiza el contador de violaciones para una IP
 */
function updateViolationCount(ip: string, score: number): void {
  const now = Date.now();
  const record = violationCounts.get(ip);

  if (!record || now > record.resetTime) {
    violationCounts.set(ip, {
      count: 1,
      score,
      resetTime: now + 60 * 60 * 1000, // Reset después de 1 hora
    });
  } else {
    record.count++;
    record.score += score;
  }
}

/**
 * Verifica si una IP debe ser bloqueada automáticamente
 */
async function checkAutoBlock(ip: string, context: SecurityLogContext): Promise<void> {
  const record = violationCounts.get(ip);

  if (record && record.score >= AUTO_BLOCK_THRESHOLD) {
    await blockIP(ip, AUTO_BLOCK_DURATION, "WAF auto-block: Multiple violations");

    recordSecurityEvent("waf_triggered", {
      ...context,
      metadata: {
        ...context.metadata,
        autoBlocked: true,
        totalScore: record.score,
        violationCount: record.count,
      },
    });

    // Reset contador después de bloqueo
    violationCounts.delete(ip);
  }
}

// ============================================================================
// API PÚBLICA
// ============================================================================

/**
 * Analiza un request completo
 */
export async function analyzeRequest(
  request: {
    path: string;
    query?: Record<string, string | string[]>;
    body?: unknown;
    headers?: Record<string, string>;
    userAgent?: string;
  },
  context: SecurityLogContext
): Promise<WAFResult> {
  let totalScore = 0;
  const violations: { rule: WAFRule; match: string }[] = [];

  // Analizar path
  const pathMatches = analyzeString(decodeURIComponent(request.path));
  violations.push(...pathMatches);

  // Analizar query parameters
  if (request.query) {
    for (const [key, value] of Object.entries(request.query)) {
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        const queryMatches = analyzeString(decodeURIComponent(v));
        violations.push(...queryMatches);
      }
      // También analizar las keys
      const keyMatches = analyzeString(decodeURIComponent(key));
      violations.push(...keyMatches);
    }
  }

  // Analizar body (si es string o objeto serializable)
  if (request.body) {
    const bodyString =
      typeof request.body === "string"
        ? request.body
        : JSON.stringify(request.body);
    const bodyMatches = analyzeString(bodyString);
    violations.push(...bodyMatches);
  }

  // Analizar User-Agent
  if (request.userAgent) {
    const uaMatches = analyzeString(request.userAgent);
    violations.push(...uaMatches);
  }

  // Calcular score total
  totalScore = violations.reduce((sum, v) => sum + v.rule.score, 0);

  // Si hay violaciones, loguear y actualizar contadores
  if (violations.length > 0) {
    const highestSeverity = violations.reduce(
      (max, v) => (v.rule.score > max.rule.score ? v : max),
      violations[0]
    );

    // Actualizar contador de violaciones
    if (context.ip) {
      updateViolationCount(context.ip, totalScore);
    }

    // Loguear si supera cierto umbral
    if (totalScore >= 5) {
      logWAFTriggered(
        context,
        highestSeverity.rule.name,
        violations.map((v) => `${v.rule.id}: ${v.match}`).join("; ")
      );

      // Registrar evento para alertas
      recordSecurityEvent(
        highestSeverity.rule.category === "sql_injection"
          ? "injection_attempt"
          : highestSeverity.rule.category === "xss"
          ? "xss_attempt"
          : "waf_triggered",
        context
      );
    }

    // Verificar auto-bloqueo
    if (context.ip) {
      await checkAutoBlock(context.ip, context);
    }

    // Determinar si bloquear
    if (totalScore >= BLOCK_THRESHOLD) {
      return {
        allowed: false,
        rule: highestSeverity.rule.name,
        category: highestSeverity.rule.category,
        payload: highestSeverity.match,
        score: totalScore,
      };
    }
  }

  return {
    allowed: true,
    score: totalScore,
  };
}

/**
 * Versión rápida para analizar solo el path
 */
export function analyzePath(path: string): WAFResult {
  const violations = analyzeString(decodeURIComponent(path));
  const totalScore = violations.reduce((sum, v) => sum + v.rule.score, 0);

  if (totalScore >= BLOCK_THRESHOLD && violations.length > 0) {
    const highest = violations.reduce(
      (max, v) => (v.rule.score > max.rule.score ? v : max),
      violations[0]
    );

    return {
      allowed: false,
      rule: highest.rule.name,
      category: highest.rule.category,
      payload: highest.match,
      score: totalScore,
    };
  }

  return { allowed: true, score: totalScore };
}

/**
 * Analiza solo el User-Agent
 */
export function analyzeUserAgent(userAgent: string | null): WAFResult {
  if (!userAgent) {
    return { allowed: true, score: 0 };
  }

  const violations = analyzeString(userAgent).filter(
    (v) => v.rule.category === "malicious_user_agent"
  );

  const totalScore = violations.reduce((sum, v) => sum + v.rule.score, 0);

  if (violations.length > 0) {
    return {
      allowed: false,
      rule: violations[0].rule.name,
      category: "malicious_user_agent",
      payload: userAgent.substring(0, 100),
      score: totalScore,
    };
  }

  return { allowed: true, score: 0 };
}

/**
 * Obtiene las reglas WAF
 */
export function getWAFRules(): WAFRule[] {
  return [...WAF_RULES];
}

/**
 * Habilita/deshabilita una regla
 */
export function setRuleEnabled(ruleId: string, enabled: boolean): boolean {
  const rule = WAF_RULES.find((r) => r.id === ruleId);
  if (!rule) return false;

  rule.enabled = enabled;
  return true;
}

/**
 * Obtiene estadísticas del WAF
 */
export function getWAFStats(): {
  totalRules: number;
  enabledRules: number;
  blockedIPs: number;
  violationsByCategory: Record<string, number>;
} {
  const violationsByCategory: Record<string, number> = {};

  for (const rule of WAF_RULES) {
    violationsByCategory[rule.category] =
      (violationsByCategory[rule.category] || 0);
  }

  return {
    totalRules: WAF_RULES.length,
    enabledRules: WAF_RULES.filter((r) => r.enabled).length,
    blockedIPs: violationCounts.size,
    violationsByCategory,
  };
}

/**
 * Limpia el historial de violaciones
 */
export function clearViolationHistory(): void {
  violationCounts.clear();
}
