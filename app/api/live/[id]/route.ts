import { read } from '@/lib/live-api';
export const dynamic='force-dynamic';
export async function GET(req:Request,{params}:any){return read((await params).id)}
