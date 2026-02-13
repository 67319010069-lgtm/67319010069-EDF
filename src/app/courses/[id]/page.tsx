'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase'
import { FaGraduationCap, FaStar, FaBook, FaUser, FaClock, FaArrowLeft } from 'react-icons/fa'

export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [course, setCourse] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [enrollment, setEnrollment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)

    useEffect(() => {
        loadData()
    }, [courseId])

    const loadData = async () => {
        const { user: currentUser } = await auth.getUser()
        setUser(currentUser)

        const { data: courseData } = await db.getCourse(courseId)
        setCourse(courseData)

        if (currentUser) {
            const { data: enrollmentData } = await db.getEnrollment(currentUser.id, courseId)
            setEnrollment(enrollmentData)
        }

        setLoading(false)
    }

    const handleEnroll = async () => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        setEnrolling(true)
        const { data, error } = await db.createEnrollment(user.id, courseId)

        if (!error) {
            setEnrollment(data)
            router.push(`/learn/${courseId}`)
        }
        setEnrolling(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
                <div className="text-2xl text-pink-500">กำลังโหลด...</div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">ไม่พบคอร์สนี้</h1>
                    <Link href="/courses" className="text-pink-500 hover:underline">
                        กลับไปหน้าคอร์ส
                    </Link>
                </div>
            </div>
        )
    }

    const avgRating = course.reviews?.length > 0
        ? course.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / course.reviews.length
        : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 text-gray-900">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <FaGraduationCap className="text-3xl text-pink-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                                Eduflow
                            </span>
                        </Link>
                        <Link href="/courses" className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium">
                            <FaArrowLeft className="inline mr-2" />
                            กลับ
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Course Header */}
                        <div className="glass p-8 rounded-2xl mb-6">
                            {course.thumbnail && (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}

                            <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
                            <p className="text-lg text-gray-700 mb-6">{course.description}</p>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center space-x-2">
                                    <FaStar className="text-yellow-500" />
                                    <span className="font-semibold">
                                        {avgRating > 0 ? avgRating.toFixed(1) : 'ยังไม่มีรีวิว'}
                                    </span>
                                    {course.reviews?.length > 0 && (
                                        <span className="text-gray-600">({course.reviews.length} รีวิว)</span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <FaBook className="text-pink-500" />
                                    <span>{course.lessons?.length || 0} บทเรียน</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <FaUser className="text-pink-600" />
                                    <span>โดย {course.instructor?.full_name}</span>
                                </div>
                            </div>

                            <div className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-medium">
                                {course.category}
                            </div>
                        </div>

                        {/* Lessons */}
                        <div className="glass p-8 rounded-2xl mb-6">
                            <h2 className="text-2xl font-bold mb-4">เนื้อหาในคอร์ส</h2>
                            <div className="space-y-3">
                                {course.lessons?.map((lesson: any, index: number) => (
                                    <div key={lesson.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-500">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{lesson.title}</h3>
                                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                                    <span className="capitalize">{lesson.type}</span>
                                                    {lesson.duration && (
                                                        <>
                                                            <span>•</span>
                                                            <div className="flex items-center space-x-1">
                                                                <FaClock />
                                                                <span>{lesson.duration}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        {course.reviews?.length > 0 && (
                            <div className="glass p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold mb-4">รีวิวจากผู้เรียน</h2>
                                <div className="space-y-4">
                                    {course.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-pink-500" />
                                                    </div>
                                                    <span className="font-semibold">{review.user?.full_name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-700">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-2xl sticky top-24">
                            <div className="text-4xl font-bold text-pink-500 mb-6">
                                {course.price > 0 ? `฿${course.price}` : 'ฟรี'}
                            </div>

                            {enrollment ? (
                                <Link
                                    href={`/learn/${courseId}`}
                                    className="block w-full text-center px-6 py-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-semibold mb-4"
                                >
                                    เข้าเรียน
                                </Link>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-semibold mb-4 disabled:opacity-50"
                                >
                                    {enrolling ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเรียน'}
                                </button>
                            )}

                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>บทเรียน</span>
                                    <span className="font-semibold">{course.lessons?.length || 0} บท</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ผู้เรียน</span>
                                    <span className="font-semibold">-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ระดับ</span>
                                    <span className="font-semibold">ทุกระดับ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
