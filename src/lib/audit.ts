import { config } from "@/lib/config";
import { prisma } from "@/lib/db";

export async function writeAudit(params: {
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  actorId?: string;
  ip?: string;
}) {
  const entry = {
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    before: params.before as object | undefined,
    after: params.after as object | undefined,
    actorId: params.actorId,
    ip: params.ip,
  };

  if (config.database) {
    await prisma.auditLog.create({ data: entry });
  } else {
    console.info("[AUDIT:DEMO]", entry.action, entry.entityType, entry.entityId ?? "");
  }
}
