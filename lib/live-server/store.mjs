// Upstash/Vercel KV (Redis REST) store for live rooms. Works without any npm dependency.
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL||'';
const TOKEN=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN||'';
export const TTL=60*60*24*30; // rooms expire 30 days after the last change
export const configured=()=>!!(URL_&&TOKEN);
async function redis(cmd){const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOKEN,'Content-Type':'application/json'},body:JSON.stringify(cmd)});const j=await r.json();if(j.error)throw Error(j.error);return j.result}
const key=id=>'live:'+id;
export async function ping(){return (await redis(['PING']))==='PONG'}
export async function getRoom(id){const raw=await redis(['GET',key(id)]);return raw?JSON.parse(raw):null}
export async function createRoom(id,room){await redis(['SET',key(id),JSON.stringify(room),'EX',TTL,'NX'])}
// compare-and-set on revision: returns true when stored, false when someone else changed the room first
const CAS=`local raw=redis.call('GET',KEYS[1]) if not raw then return 0 end local cur=cjson.decode(raw) if tostring(cur.revision)~=ARGV[1] then return 0 end redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3]) return 1`;
export async function casRoom(id,expectedRevision,room){return (await redis(['EVAL',CAS,1,key(id),String(expectedRevision),JSON.stringify(room),String(TTL)]))===1}
