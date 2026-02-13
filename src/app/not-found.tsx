import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
            <div className="glass p-12 rounded-3xl shadow-xl text-center max-w-md">
                <FaExclamationTriangle className="text-6xl text-pink-500 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-800 mb-4">ไม่พบหน้านี้</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    ขออภัย เราไม่พบหน้าที่คุณกำลังค้นหา
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 font-medium inline-block transition-all"
                >
                    กลับสู่หน้าแรก
                </Link>
            </div>
        </div>
    )
}
