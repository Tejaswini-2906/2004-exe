import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {title:"2004.exe",description:"A tiny early-2000s music desktop."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>}