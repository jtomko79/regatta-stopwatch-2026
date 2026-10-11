import { action } from '@/lib/live-api';
export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:any){return action(req,(await params).id)}
