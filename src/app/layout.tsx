import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Eduflow - แพลตฟอร์มการเรียนรู้ออนไลน์',
    description: 'เรียนรู้และแบ่งปันความรู้กับ Eduflow - แพลตฟอร์มดิจิทัลสำหรับการศึกษาออนไลน์ของคุณ',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
