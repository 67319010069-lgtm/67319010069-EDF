'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase'
import { FaGraduationCap, FaArrowLeft, FaSave, FaPlus, FaTrash, FaImage } from 'react-icons/fa'

const categories = ['โปรแกรมมิ่ง', 'ธุรกิจ', 'ดิจิทัลมาร์เก็ตติ้ง', 'ดีไซน์', 'ภาษา', 'อื่นๆ']
const lessonTypes = [
    { value: 'video', label: 'วิดีโอ' },
    { value: 'text', label: 'ข้อความ' },
    { value: 'pdf', label: 'PDF' },
    { value: 'audio', label: 'เสียง' }
]

export default function CreateCoursePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Course data
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState(categories[0])
    const [price, setPrice] = useState(0)
    const [thumbnail, setThumbnail] = useState('')
    const [published, setPublished] = useState(false)
    const [lessons, setLessons] = useState<any[]>([])

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { user: currentUser } = await auth.getUser()

        if (!currentUser) {
            router.push('/auth/login')
            return
        }

        const { data: profile } = await db.getProfile(currentUser.id)

        if (profile?.role !== 'instructor') {
            router.push('/dashboard')
            return
        }

        setUser(currentUser)
    }

    const addLesson = () => {
        setLessons([...lessons, {
            tempId: Date.now(),
            title: '',
            type: 'video',
            content: '',
            url: '',
            duration: '',
            order: lessons.length
        }])
    }

    const updateLesson = (index: number, field: string, value: any) => {
        const updated = [...lessons]
        updated[index][field] = value
        setLessons(updated)
    }

    const removeLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!title || !description || !category) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน')
            setLoading(false)
            return
        }

        try {
            // Create course
            const { data: course, error: courseError } = await db.createCourse({
                title,
                description,
                category,
                price,
                instructor_id: user.id,
                thumbnail,
                published
            })

            if (courseError) throw courseError

            // Create lessons
            for (const lesson of lessons) {
                if (lesson.title) {
                    await db.createLesson({
                        course_id: course.id,
                        title: lesson.title,
                        type: lesson.type,
                        content: lesson.content,
                        url: lesson.url,
                        duration: lesson.duration,
                        order: lesson.order
                    })
                }
            }

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
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
                        <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:text-pink-500 font-medium">
                            <FaArrowLeft className="inline mr-2" />
                            กลับ
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">สร้างคอร์สใหม่</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Info */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">ข้อมูลคอร์ส</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ชื่อคอร์ส *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    placeholder="เช่น การเขียนโปรแกรม Python สำหรับผู้เริ่มต้น"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    คำอธิบาย *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    placeholder="อธิบายเกี่ยวกับคอร์สของคุณ..."
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมวดหมู่ *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ราคา (บาท)
                                    </label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL รูปปก
                                </label>
                                <div className="flex space-x-2">
                                    <FaImage className="text-gray-400 mt-3" />
                                    <input
                                        type="url"
                                        value={thumbnail}
                                        onChange={(e) => setThumbnail(e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                                    เผยแพร่คอร์สทันที (ถ้าไม่เลือกจะเป็นแบบร่าง)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Lessons */}
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">บทเรียน</h2>
                            <button
                                type="button"
                                onClick={addLesson}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center space-x-2"
                            >
                                <FaPlus />
                                <span>เพิ่มบทเรียน</span>
                            </button>
                        </div>

                        {lessons.length === 0 && (
                            <p className="text-gray-600 text-center py-8">ยังไม่มีบทเรียน คลิกปุ่มด้านบนเพื่อเพิ่ม</p>
                        )}

                        <div className="space-y-4">
                            {lessons.map((lesson, index) => (
                                <div key={lesson.tempId} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">บทเรียนที่ {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                                placeholder="ชื่อบทเรียน"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={lesson.type}
                                                onChange={(e) => updateLesson(index, 'type', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                {lessonTypes.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        {lesson.type === 'text' ? (
                                            <textarea
                                                value={lesson.content}
                                                onChange={(e) => updateLesson(index, 'content', e.target.value)}
                                                placeholder="เนื้อหาบทเรียน"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <input
                                                type="url"
                                                value={lesson.url}
                                                onChange={(e) => updateLesson(index, 'url', e.target.value)}
                                                placeholder="URL ของไฟล์ (วิดีโอ, PDF, เสียง)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                                            placeholder="ระยะเวลา (เช่น 10:30)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            ยกเลิก
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-semibold disabled:opacity-50 flex items-center space-x-2"
                        >
                            <FaSave />
                            <span>{loading ? 'กำลังบันทึก...' : 'สร้างคอร์ส'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
