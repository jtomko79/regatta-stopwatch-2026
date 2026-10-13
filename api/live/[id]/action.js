import { action } from '../../../lib/live-server/handlers.mjs';
export default async function handler(req,res){if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'})}return action(req,res,String(req.query.id||''))}
