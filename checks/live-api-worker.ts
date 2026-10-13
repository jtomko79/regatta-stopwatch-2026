import { create, read, action } from '../lib/live-api';
export default {async fetch(req:Request){const parts=new URL(req.url).pathname.split('/').filter(Boolean);if(parts.length===2)return create(req);return parts[3]==='action'?action(req,parts[2]):read(parts[2]);}};
