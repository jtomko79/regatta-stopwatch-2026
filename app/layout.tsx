import type { Metadata } from 'next';
export const metadata:Metadata={title:'Regatta Stopwatch',description:'Časomiera regaty a živý odpočet pre posádky',icons:{icon:'/icon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="sk"><body>{children}</body></html>}
