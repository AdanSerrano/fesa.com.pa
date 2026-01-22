/**
 * Cliente de Redis para servicios de seguridad
 *
 * En producción, conecta a Redis para:
 * - Rate limiting distribuido
 * - Almacenamiento de sesiones de seguridad
 * - Cache de bloqueos de IP
 * - Almacenamiento de tokens de seguridad
 *
 * Soporta dos formas de configuración:
 * 1. REDIS_URL (recomendado para Upstash): rediss://default:password@host:port
 * 2. Variables separadas: REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, etc.
 */

import Redis from "ioredis";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

/**
 * Obtiene la configuración de Redis
 * Prioriza REDIS_URL (formato Upstash) sobre variables separadas
 */
function getRedisConfig(): string | object | null {
  // Opción 1: URL completa (Upstash, Redis Cloud, etc.)
  // Formato: rediss://default:password@host:port
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  // Opción 2: Variables separadas
  if (process.env.REDIS_HOST) {
    return {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || "0", 10),
      tls: process.env.REDIS_TLS === "true" ? {} : undefined,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      commandTimeout: 5000,
      keyPrefix: "security:",
    };
  }

  // No hay configuración de Redis
  return null;
}

// ============================================================================
// SINGLETON DE REDIS
// ============================================================================

let redisClient: Redis | null = null;
let isRedisAvailable = false;

/**
 * Obtiene o crea la instancia de Redis
 */
export function getRedisClient(): Redis | null {
  const config = getRedisConfig();

  // Sin configuración de Redis
  if (!config) {
    return null;
  }

  if (!redisClient) {
    try {
      // Si es string (URL), usar directamente
      if (typeof config === "string") {
        redisClient = new Redis(config);
      } else {
        // Si es objeto de configuración
        redisClient = new Redis({
          ...config,
          lazyConnect: true,
          enableOfflineQueue: false,
        });
      }

      redisClient.on("connect", () => {
        isRedisAvailable = true;
        console.log("[REDIS] Connected successfully");
      });

      redisClient.on("error", (err) => {
        isRedisAvailable = false;
        console.error("[REDIS] Connection error:", err.message);
      });

      redisClient.on("close", () => {
        isRedisAvailable = false;
        console.log("[REDIS] Connection closed");
      });

      // Intentar conectar
      redisClient.connect().catch((err) => {
        console.error("[REDIS] Failed to connect:", err.message);
        isRedisAvailable = false;
      });
    } catch (error) {
      console.error("[REDIS] Failed to create client:", error);
      return null;
    }
  }

  return redisClient;
}

/**
 * Verifica si Redis está disponible
 */
export function isRedisConnected(): boolean {
  return isRedisAvailable && redisClient?.status === "ready";
}

/**
 * Cierra la conexión de Redis (para cleanup)
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isRedisAvailable = false;
  }
}

// ============================================================================
// HELPERS PARA OPERACIONES COMUNES
// ============================================================================

/**
 * Obtiene un valor con manejo de errores
 */
export async function redisGet(key: string): Promise<string | null> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return null;

  try {
    return await client.get(key);
  } catch (error) {
    console.error("[REDIS] GET error:", error);
    return null;
  }
}

/**
 * Establece un valor con expiración
 */
export async function redisSet(
  key: string,
  value: string,
  expirationSeconds?: number
): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return false;

  try {
    if (expirationSeconds) {
      await client.setex(key, expirationSeconds, value);
    } else {
      await client.set(key, value);
    }
    return true;
  } catch (error) {
    console.error("[REDIS] SET error:", error);
    return false;
  }
}

/**
 * Incrementa un contador con expiración
 */
export async function redisIncr(
  key: string,
  expirationSeconds?: number
): Promise<number | null> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return null;

  try {
    const count = await client.incr(key);
    if (expirationSeconds && count === 1) {
      await client.expire(key, expirationSeconds);
    }
    return count;
  } catch (error) {
    console.error("[REDIS] INCR error:", error);
    return null;
  }
}

/**
 * Obtiene el TTL de una key
 */
export async function redisTTL(key: string): Promise<number | null> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return null;

  try {
    return await client.ttl(key);
  } catch (error) {
    console.error("[REDIS] TTL error:", error);
    return null;
  }
}

/**
 * Elimina una key
 */
export async function redisDel(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error("[REDIS] DEL error:", error);
    return false;
  }
}

/**
 * Agrega un elemento a un set con score (para sorted sets)
 */
export async function redisZAdd(
  key: string,
  score: number,
  member: string
): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return false;

  try {
    await client.zadd(key, score, member);
    return true;
  } catch (error) {
    console.error("[REDIS] ZADD error:", error);
    return false;
  }
}

/**
 * Cuenta elementos en un rango de tiempo (para rate limiting avanzado)
 */
export async function redisZCount(
  key: string,
  minScore: number,
  maxScore: number
): Promise<number | null> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return null;

  try {
    return await client.zcount(key, minScore, maxScore);
  } catch (error) {
    console.error("[REDIS] ZCOUNT error:", error);
    return null;
  }
}

/**
 * Elimina elementos antiguos de un sorted set
 */
export async function redisZRemRangeByScore(
  key: string,
  minScore: number,
  maxScore: number
): Promise<boolean> {
  const client = getRedisClient();
  if (!client || !isRedisConnected()) return false;

  try {
    await client.zremrangebyscore(key, minScore, maxScore);
    return true;
  } catch (error) {
    console.error("[REDIS] ZREMRANGEBYSCORE error:", error);
    return false;
  }
}
