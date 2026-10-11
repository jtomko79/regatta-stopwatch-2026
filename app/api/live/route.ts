import { create } from '@/lib/live-api';
export const dynamic='force-dynamic';
export const POST=create;

export async function GET(){const {env}=await import('cloudflare:workers');try{const row=await env.DB!.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='live_rooms'").first();return Response.json({ready:!!row,serverNow:Date.now()},{status:row?200:503,headers:{'Cache-Control':'no-store'}})}catch{return Response.json({ready:false},{status:503})}}
