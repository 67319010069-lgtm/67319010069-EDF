'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/supabase'
import { FaGraduationCap, FaEnvelope, FaLock, FaUser } from 'react-icons/fa'

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultRole = searchParams.get('role') || 'student'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState(defaultRole)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
            setLoading(false)
            return
        }

        const { data, error: signUpError } = await auth.signUp(email, password, fullName, role)

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Redirect to dashboard
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <FaGraduationCap className="text-5xl text-pink-500" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                            Eduflow
                        </span>
                    </Link>
                    <p className="text-gray-800 mt-2">สร้างบัญชีเพื่อเริ่มต้นการเรียนรู้</p>
                </div>

                {/* Signup Form */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                ชื่อ-นามสกุล
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    placeholder="สมชาย ใจดี"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                อีเมล
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                ประเภทบัญชี
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-3 px-4 rounded-lg font-medium border-2 ${role === 'student'
                                        ? 'bg-pink-600 text-white border-pink-600'
                                        : 'bg-white text-gray-800 border-gray-300 hover:border-pink-600'
                                        }`}
                                >
                                    ผู้เรียน
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('instructor')}
                                    className={`py-3 px-4 rounded-lg font-medium border-2 ${role === 'instructor'
                                        ? 'bg-pink-600 text-white border-pink-600'
                                        : 'bg-white text-gray-800 border-gray-300 hover:border-pink-600'
                                        }`}
                                >
                                    ผู้สอน
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-800">
                            มีบัญชีอยู่แล้ว?{' '}
                            <Link href="/auth/login" className="text-pink-600 font-semibold hover:underline">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
