'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase'
import { FaGraduationCap, FaBook, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [courses, setCourses] = useState<any[]>([])
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { user: currentUser } = await auth.getUser()

        if (!currentUser) {
            router.push('/auth/login')
            return
        }

        setUser(currentUser)

        // Get profile
        const { data: profileData } = await db.getProfile(currentUser.id)
        setProfile(profileData)

        // Load data based on role
        if (profileData?.role === 'instructor') {
            loadInstructorData(currentUser.id)
        } else {
            loadStudentData(currentUser.id)
        }
    }

    const loadInstructorData = async (userId: string) => {
        const { data } = await db.getCourses({ published: undefined })
        const instructorCourses = data?.filter((c: any) => c.instructor_id === userId) || []
        setCourses(instructorCourses)
        setLoading(false)
    }

    const loadStudentData = async (userId: string) => {
        const { data } = await db.getUserEnrollments(userId)
        setEnrollments(data || [])
        setLoading(false)
    }

    const handleLogout = async () => {
        await auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
                <div className="text-2xl text-pink-600 font-semibold animate-pulse">กำลังโหลด...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 text-gray-900">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <FaGraduationCap className="text-3xl text-pink-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
                                Eduflow
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/courses" className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium transition-colors">
                                คอร์สเรียน
                            </Link>
                            <Link href="/profile" className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium transition-colors">
                                <FaUser className="inline mr-2" />
                                โปรไฟล์
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                <FaSignOutAlt className="inline mr-2" />
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">
                        สวัสดี, <span className="text-pink-600">{profile?.full_name}</span>!
                    </h1>
                    <p className="text-gray-700 text-lg">
                        {profile?.role === 'instructor' ? 'จัดการคอร์สเรียนของคุณ' : 'เรียนรู้ไปกับเรา'}
                    </p>
                </div>

                {/* Instructor Dashboard */}
                {profile?.role === 'instructor' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">คอร์สของฉัน</h2>
                            <Link
                                href="/instructor/create-course"
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 font-medium flex items-center space-x-2 transition-all"
                            >
                                <FaPlus />
                                <span>สร้างคอร์สใหม่</span>
                            </Link>
                        </div>

                        {courses.length === 0 ? (
                            <div className="glass p-12 rounded-3xl text-center border border-white/50 shadow-md">
                                <FaBook className="text-6xl text-pink-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4 text-lg">คุณยังไม่มีคอร์สเรียน</p>
                                <Link
                                    href="/instructor/create-course"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 font-medium transition-all"
                                >
                                    สร้างคอร์สแรกของคุณ
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="glass p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all border border-white/60 bg-white/60">
                                        {course.thumbnail && (
                                            <div className="relative h-48 mb-4 rounded-xl overflow-hidden shadow-sm">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                        )}
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{course.description}</p>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.published
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                {course.published ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                                            </span>
                                            <span className="text-gray-500 text-sm font-medium">{course.lessons?.length || 0} บทเรียน</span>
                                        </div>
                                        <Link
                                            href={`/instructor/edit-course/${course.id}`}
                                            className="block w-full text-center px-4 py-2.5 bg-white border border-pink-200 text-pink-600 rounded-xl hover:bg-pink-50 hover:border-pink-300 font-semibold transition-colors"
                                        >
                                            แก้ไขคอร์ส
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Student Dashboard */}
                {profile?.role === 'student' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">คอร์สของฉัน</h2>

                        {enrollments.length === 0 ? (
                            <div className="glass p-12 rounded-3xl text-center border border-white/50 shadow-md">
                                <FaBook className="text-6xl text-pink-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4 text-lg">คุณยังไม่ได้ลงทะเบียนคอร์สใดๆ</p>
                                <Link
                                    href="/courses"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 font-medium transition-all"
                                >
                                    เลือกคอร์สเรียน
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrollments.map((enrollment) => {
                                    const course = enrollment.course
                                    const totalLessons = course.lessons?.length || 0
                                    const completedLessons = enrollment.progress?.length || 0
                                    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

                                    return (
                                        <div key={enrollment.id} className="glass p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all border border-white/60 bg-white/60">
                                            {course.thumbnail && (
                                                <div className="relative h-48 mb-4 rounded-xl overflow-hidden shadow-sm">
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
                                            <p className="text-gray-600 mb-4 text-sm font-medium">
                                                โดย {course.instructor?.full_name}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="mb-5">
                                                <div className="flex justify-between text-sm text-gray-600 mb-1 font-medium">
                                                    <span>ความคืบหน้า</span>
                                                    <span className="text-pink-600">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <Link
                                                href={`/learn/${course.id}`}
                                                className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-md hover:scale-[1.02] font-semibold transition-all"
                                            >
                                                {progress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
