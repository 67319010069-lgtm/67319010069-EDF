'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase'
import { FaGraduationCap, FaCheck, FaBook, FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function LearnPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [user, setUser] = useState<any>(null)
    const [course, setCourse] = useState<any>(null)
    const [enrollment, setEnrollment] = useState<any>(null)
    const [currentLesson, setCurrentLesson] = useState<any>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completedLessons, setCompletedLessons] = useState<string[]>([])
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [courseId])

    const loadData = async () => {
        const { user: currentUser } = await auth.getUser()

        if (!currentUser) {
            router.push('/auth/login')
            return
        }

        setUser(currentUser)

        const { data: courseData } = await db.getCourse(courseId)
        setCourse(courseData)

        const { data: enrollmentData } = await db.getEnrollment(currentUser.id, courseId)

        if (!enrollmentData) {
            router.push(`/courses/${courseId}`)
            return
        }

        setEnrollment(enrollmentData)
        setCompletedLessons(enrollmentData.progress || [])

        if (courseData?.lessons?.length > 0) {
            setCurrentLesson(courseData.lessons[0])
            setCurrentIndex(0)
        }

        setLoading(false)
    }

    const markComplete = async () => {
        if (!currentLesson || completedLessons.includes(currentLesson.id)) return

        const updated = [...completedLessons, currentLesson.id]
        setCompletedLessons(updated)

        await db.updateProgress(enrollment.id, updated)

        // Check if all lessons completed
        if (updated.length === course.lessons.length) {
            setShowReviewForm(true)
        }
    }

    const selectLesson = (lesson: any, index: number) => {
        setCurrentLesson(lesson)
        setCurrentIndex(index)
    }

    const nextLesson = () => {
        if (currentIndex < course.lessons.length - 1) {
            const next = currentIndex + 1
            setCurrentLesson(course.lessons[next])
            setCurrentIndex(next)
        }
    }

    const prevLesson = () => {
        if (currentIndex > 0) {
            const prev = currentIndex - 1
            setCurrentLesson(course.lessons[prev])
            setCurrentIndex(prev)
        }
    }

    const submitReview = async () => {
        if (!user) return

        await db.createReview({
            course_id: courseId,
            user_id: user.id,
            rating,
            comment
        })

        setShowReviewForm(false)
        alert('ขอบคุณสำหรับรีวิว!')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-2xl text-pink-500">กำลังโหลด...</div>
            </div>
        )
    }

    const progress = course?.lessons?.length > 0
        ? (completedLessons.length / course.lessons.length) * 100
        : 0

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Top Bar */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center space-x-2 text-white hover:text-pink-400">
                            <FaArrowLeft />
                            <span>กลับแดชบอร์ด</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="text-white">
                                <span className="text-sm text-gray-400">ความคืบหน้า: </span>
                                <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-60px)]">
                {/* Sidebar - Lessons */}
                <div className="w-80 bg-gray-800 overflow-y-auto border-r border-gray-700">
                    <div className="p-4">
                        <h2 className="text-xl font-bold text-white mb-4">{course?.title}</h2>
                        <div className="space-y-2">
                            {course?.lessons?.map((lesson: any, index: number) => {
                                const isCompleted = completedLessons.includes(lesson.id)
                                const isCurrent = currentLesson?.id === lesson.id

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => selectLesson(lesson, index)}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${isCurrent
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-600'
                                                    }`}>
                                                    {isCompleted ? (
                                                        <FaCheck className="text-xs text-white" />
                                                    ) : (
                                                        <span className="text-xs text-white">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium line-clamp-1">{lesson.title}</div>
                                                    <div className="text-xs opacity-75">{lesson.duration || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-900">
                    <div className="container mx-auto px-6 py-8 max-w-5xl">
                        {currentLesson && (
                            <>
                                <h1 className="text-3xl font-bold text-white mb-6">{currentLesson.title}</h1>

                                {/* Content based on type */}
                                {currentLesson.type === 'video' && currentLesson.url && (
                                    <div className="mb-6 bg-black rounded-lg overflow-hidden">
                                        <video
                                            key={currentLesson.id}
                                            controls
                                            className="w-full"
                                            style={{ maxHeight: '500px' }}
                                        >
                                            <source src={currentLesson.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}

                                {currentLesson.type === 'text' && currentLesson.content && (
                                    <div className="mb-6 bg-gray-800 p-6 rounded-lg text-gray-300 whitespace-pre-wrap">
                                        {currentLesson.content}
                                    </div>
                                )}

                                {currentLesson.type === 'pdf' && currentLesson.url && (
                                    <div className="mb-6">
                                        <iframe
                                            src={currentLesson.url}
                                            className="w-full h-[600px] rounded-lg"
                                            title={currentLesson.title}
                                        />
                                        <a
                                            href={currentLesson.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-4 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                                        >
                                            ดาวน์โหลด PDF
                                        </a>
                                    </div>
                                )}

                                {currentLesson.type === 'audio' && currentLesson.url && (
                                    <div className="mb-6 bg-gray-800 p-6 rounded-lg">
                                        <audio controls className="w-full">
                                            <source src={currentLesson.url} type="audio/mpeg" />
                                            Your browser does not support the audio tag.
                                        </audio>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={prevLesson}
                                        disabled={currentIndex === 0}
                                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <FaArrowLeft />
                                        <span>บทก่อนหน้า</span>
                                    </button>

                                    {!completedLessons.includes(currentLesson.id) && (
                                        <button
                                            onClick={markComplete}
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                        >
                                            <FaCheck />
                                            <span>ทำเสร็จแล้ว</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={nextLesson}
                                        disabled={currentIndex === course.lessons.length - 1}
                                        className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <span>บทถัดไป</span>
                                        <FaArrowRight />
                                    </button>
                                </div>

                                {/* Review Form */}
                                {showReviewForm && (
                                    <div className="bg-gray-800 p-6 rounded-lg">
                                        <h3 className="text-2xl font-bold text-white mb-4">🎉 ยินดีด้วย! คุณเรียนจบแล้ว</h3>
                                        <p className="text-gray-300 mb-4">ช่วยรีวิวคอร์สนี้หน่อยได้ไหม?</p>

                                        <div className="mb-4">
                                            <label className="block text-white mb-2">ให้คะแนน</label>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="text-3xl"
                                                    >
                                                        <FaStar className={star <= rating ? 'text-yellow-500' : 'text-gray-600'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-white mb-2">ความคิดเห็น (ไม่บังคับ)</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500"
                                                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                                            />
                                        </div>

                                        <button
                                            onClick={submitReview}
                                            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-semibold"
                                        >
                                            ส่งรีวิว
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
