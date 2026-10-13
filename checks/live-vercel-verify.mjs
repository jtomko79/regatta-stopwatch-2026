// Exercises the Vercel live API handlers against an in-memory fake of the Redis REST API.
import assert from 'node:assert/strict';
process.env.KV_REST_API_URL='http://fake-redis';process.env.KV_REST_API_TOKEN='t';
const mem=new Map();globalThis.fetch=async(url,init)=>{const cmd=JSON.parse(init.body);let result=null;const [op,k,...rest]=cmd;if(op==='PING')result='PONG';else if(op==='GET')result=mem.get(k)??null;else if(op==='SET'){if(rest.includes('NX')&&mem.has(k))result=null;else{mem.set(k,rest[0]);result='OK'}}else if(op==='EVAL'){const [,,,key,rev,val]=cmd;const raw=mem.get(key);if(!raw)result=0;else if(String(JSON.parse(raw).revision)!==rev)result=0;else{mem.set(key,val);result=1}}return {json:async()=>({result})}};
const H=await import('../lib/live-server/handlers.mjs');
const call=async(fn,{method='GET',body,headers={},query={}}={})=>{let status=200,out;const req={method,body,headers:{host:'app.test',...headers},query};const res={status(s){status=s;return res},setHeader(){return res},json(d){out=d}};await fn(req,res,query.id);return {status,body:out}};
const snapshot={name:'Test live',crews:[{id:'a',boatName:'Aurora'},{id:'b',boatName:'Blue'},{id:'c',boatName:'Cora'}],active:{id:'race1',state:'PRESTART',preDeadline:Date.now()+500,remaining:1000,preRemaining:500,finishes:[]}};
assert.equal((await call(H.ready)).status,200);
const cre=await call(H.create,{method:'POST',body:{snapshot}});assert.equal(cre.status,201);const {id,ownerKey}=cre.body;assert.ok(id&&ownerKey);
let r=await call(H.read,{query:{id}});assert.equal(r.body.active.state,'PRESTART');assert.equal(r.body.crews[0].sailNumber,'');
await new Promise(r=>setTimeout(r,600));r=await call(H.read,{query:{id}});assert.equal(r.body.active.state,'COUNTDOWN','prestart advances to countdown');
await new Promise(r=>setTimeout(r,1100));r=await call(H.read,{query:{id}});assert.equal(r.body.active.state,'RACING','countdown advances to racing');
// crew claims and records finishes, naming boats
const key='device-key-1234567890abcdef';const claim=await call(H.action,{method:'POST',query:{id},body:{action:'claim',clientKey:key,crewId:'b'}});assert.equal(claim.status,200,JSON.stringify(claim.body));const claimId=claim.body.claimId;assert.ok(claimId);
const t0=Date.now();let f=await call(H.action,{method:'POST',query:{id},body:{action:'finish',clientKey:key,claimId,raceId:'race1',requestId:'f1',capturedAt:t0}});assert.equal(f.status,200);assert.equal(f.body.active.finishes[0].crewId,'b','first finish is the recorder');
f=await call(H.action,{method:'POST',query:{id},body:{action:'finish',clientKey:key,claimId,raceId:'race1',requestId:'f2',capturedAt:t0+100,crewId:'a'}});assert.equal(f.body.active.finishes[1].crewId,'a','named boat');
f=await call(H.action,{method:'POST',query:{id},body:{action:'finish',clientKey:key,claimId,raceId:'race1',requestId:'f3',capturedAt:t0+200,crewId:'a'}});assert.equal(f.body.active.finishes[2].crewId,null,'already finished boat is not reassigned');
f=await call(H.action,{method:'POST',query:{id},body:{action:'finish',clientKey:key,claimId,raceId:'race1',requestId:'f3',capturedAt:t0+200}});assert.equal(f.body.active.finishes.length,3,'idempotent');
// another device cannot claim; owner can release
const other=await call(H.action,{method:'POST',query:{id},body:{action:'claim',clientKey:'other-device-key-0987654321',crewId:'c'}});assert.equal(other.status,409);
const bad=await call(H.action,{method:'POST',query:{id},body:{action:'release'}});assert.equal(bad.status,403,'release without owner key is refused');
const rel=await call(H.action,{method:'POST',query:{id},headers:{authorization:'Bearer '+ownerKey},body:{action:'release'}});assert.equal(rel.status,200);assert.equal(rel.body.claim,null);
// owner sync keeps crew finishes
const sync=await call(H.action,{method:'POST',query:{id},headers:{authorization:'Bearer '+ownerKey},body:{action:'sync',snapshot:{...snapshot,active:{...snapshot.active,state:'RACING',start:t0-5000,finishes:[{id:'o1',ms:1,status:'OK'}]}},removedIds:['f3']}});assert.equal(sync.status,200);assert.deepEqual(sync.body.active.finishes.map(x=>x.id).sort(),['f1','f2','o1']);
assert.equal((await call(H.read,{query:{id:'missing'}})).status,404);
console.log('PASS: vercel live API — readiness, create, prestart/countdown advance, claim, named finishes, idempotency, owner release/sync');
