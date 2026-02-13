'use client'

import { useEffect } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
            <div className="glass p-12 rounded-3xl shadow-xl text-center max-w-md">
                <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-600 mb-8">
                    ขออภัย เกิดปัญหาบางอย่างขึ้นในการโหลดหน้านี้
                </p>
                <button
                    onClick={reset}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 font-medium transition-all"
                >
                    ลองใหม่อีกครั้ง
                </button>
            </div>
        </div>
    )
}
