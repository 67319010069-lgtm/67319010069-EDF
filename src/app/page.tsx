import Link from 'next/link'
import { FaGraduationCap, FaBook, FaUsers, FaStar } from 'react-icons/fa'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-50 to-pink-100">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FaGraduationCap className="text-3xl text-pink-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                                Eduflow
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium"
                            >
                                เข้าสู่ระบบ
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-medium"
                            >
                                สมัครสมาชิก
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-600 bg-clip-text text-transparent">
                        เรียนรู้ทุกที่ ทุกเวลา
                    </h1>
                    <p className="text-xl text-gray-800 mb-8">
                        แพลตฟอร์มการเรียนออนไลน์ที่ครบครัน พร้อมคอร์สเรียนคุณภาพจากผู้สอนมืออาชีพ
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/courses"
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 font-semibold text-lg"
                        >
                            เริ่มเรียนเลย
                        </Link>
                        <Link
                            href="/auth/signup?role=instructor"
                            className="px-8 py-4 glass border-2 border-pink-500 text-pink-500 rounded-xl hover:shadow-xl hover:scale-105 font-semibold text-lg"
                        >
                            สอนกับเรา
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="glass p-8 rounded-2xl hover:shadow-2xl hover:scale-105">
                        <div className="text-4xl text-pink-500 mb-4">
                            <FaBook />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">คอร์สหลากหลาย</h3>
                        <p className="text-gray-800">
                            เลือกเรียนจากคอร์สมากมาย ครอบคลุมทุกหมวดหมู่ที่คุณสนใจ
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl hover:shadow-2xl hover:scale-105">
                        <div className="text-4xl text-pink-600 mb-4">
                            <FaUsers />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">ผู้สอนมืออาชีพ</h3>
                        <p className="text-gray-800">
                            เรียนกับผู้เชี่ยวชาญในแต่ละสาขา พร้อมประสบการณ์จริง
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl hover:shadow-2xl hover:scale-105">
                        <div className="text-4xl text-pink-600 mb-4">
                            <FaStar />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">เรียนได้ทุกที่</h3>
                        <p className="text-gray-800">
                            รองรับทุกอุปกรณ์ เรียนได้ทั้งมือถือและคอมพิวเตอร์
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="glass-dark rounded-3xl p-12">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-5xl font-bold mb-2">1,000+</div>
                            <div className="text-gray-300">คอร์สเรียน</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50,000+</div>
                            <div className="text-gray-300">ผู้เรียน</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="text-gray-300">ผู้สอน</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">4.8/5</div>
                            <div className="text-gray-300">คะแนนเฉลี่ย</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-gray-700">
                <p>&copy; 2024 Eduflow. สงวนลิขสิทธิ์.</p>
            </footer>
        </div>
    )
}
