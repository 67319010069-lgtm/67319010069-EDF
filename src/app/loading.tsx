export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <div className="text-xl text-pink-500 font-semibold animate-pulse">กำลังโหลด...</div>
            </div>
        </div>
    )
}
