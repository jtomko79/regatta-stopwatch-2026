import { ready, create } from '../lib/live-server/handlers.mjs';
export default async function handler(req,res){if(req.method==='POST')return create(req,res);if(req.method==='GET')return ready(req,res);res.setHeader('Allow','GET, POST');res.status(405).json({error:'Method not allowed'})}
