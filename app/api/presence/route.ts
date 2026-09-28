import { Redis } from "@upstash/redis";
export const runtime = "nodejs";
const memory = new Map<string, number>();
function getRedis(){ return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null; }
export async function GET(req: Request){
  const id = new URL(req.url).searchParams.get("id") || crypto.randomUUID();
  const now = Date.now();
  const redis = getRedis();
  if(redis){
    await redis.zadd("presence", {score: now, member:id});
    await redis.zremrangebyscore("presence", 0, now-60000);
    const count = await redis.zcard("presence");
    return Response.json({count, persistent:true});
  }
  for(const [k,t] of memory) if(t < now-60000) memory.delete(k);
  memory.set(id, now);
  return Response.json({count:memory.size, persistent:false});
}