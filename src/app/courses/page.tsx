'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '@/lib/supabase'
import { FaGraduationCap, FaSearch, FaStar, FaBook, FaUser } from 'react-icons/fa'

const categories = ['ทั้งหมด', 'โปรแกรมมิ่ง', 'ธุรกิจ', 'ดิจิทัลมาร์เก็ตติ้ง', 'ดีไซน์', 'ภาษา', 'อื่นๆ']

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [filteredCourses, setFilteredCourses] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCourses()
    }, [])

    useEffect(() => {
        filterCourses()
    }, [selectedCategory, searchQuery, courses])

    const loadCourses = async () => {
        const { data } = await db.getCourses({ published: true })

        // Calculate average ratings
        const coursesWithRatings = data?.map((course: any) => {
            const avgRating = course.reviews?.length > 0
                ? course.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / course.reviews.length
                : 0
            return { ...course, avgRating, reviewCount: course.reviews?.length || 0 }
        }) || []

        setCourses(coursesWithRatings)
        setFilteredCourses(coursesWithRatings)
        setLoading(false)
    }

    const filterCourses = () => {
        let filtered = courses

        if (selectedCategory !== 'ทั้งหมด') {
            filtered = filtered.filter(c => c.category === selectedCategory)
        }

        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredCourses(filtered)
    }

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
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium">
                                แดชบอร์ด
                            </Link>
                            <Link href="/profile" className="px-4 py-2 text-gray-800 hover:text-pink-600 font-medium">
                                โปรไฟล์
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">คอร์สเรียนทั้งหมด</h1>

                    {/* Search */}
                    <div className="relative max-w-2xl">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหาคอร์สเรียน..."
                            className="w-full pl-12 pr-4 py-4 glass rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-900"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-lg scale-105'
                                : 'glass text-gray-800 hover:shadow-md hover:scale-105'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="text-2xl text-pink-500">กำลังโหลดคอร์ส...</div>
                    </div>
                )}

                {/* Courses Grid */}
                {!loading && filteredCourses.length === 0 && (
                    <div className="glass p-12 rounded-2xl text-center">
                        <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">ไม่พบคอร์สที่ตรงกับการค้นหา</p>
                    </div>
                )}

                {!loading && filteredCourses.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className="glass p-6 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-pink-300 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                                        <FaBook className="text-6xl text-white opacity-50" />
                                    </div>
                                )}

                                <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900">{course.title}</h3>
                                <p className="text-gray-700 mb-3 line-clamp-2">{course.description}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-1">
                                        <FaStar className="text-yellow-500" />
                                        <span className="font-semibold">
                                            {course.avgRating > 0 ? course.avgRating.toFixed(1) : 'ยังไม่มีรีวิว'}
                                        </span>
                                        {course.reviewCount > 0 && (
                                            <span className="text-gray-600 text-sm">({course.reviewCount})</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-700">{course.lessons?.length || 0} บทเรียน</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                                        <FaUser />
                                        <span>{course.instructor?.full_name}</span>
                                    </div>
                                    <div className="text-lg font-bold text-pink-500">
                                        {course.price > 0 ? `฿${course.price}` : 'ฟรี'}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
