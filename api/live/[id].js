import { read } from '../../lib/live-server/handlers.mjs';
export default async function handler(req,res){if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'})}return read(req,res,String(req.query.id||''))}
