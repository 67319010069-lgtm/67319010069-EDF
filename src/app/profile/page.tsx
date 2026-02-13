'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase'
import { FaGraduationCap, FaUser, FaEnvelope, FaIdBadge, FaEdit, FaSignOutAlt, FaArrowLeft, FaCheck } from 'react-icons/fa'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const [editAvatar, setEditAvatar] = useState('')
    const [uploading, setUploading] = useState(false)

    // 20 Preset Avatars (DiceBear)
    const presetAvatars = Array.from({ length: 20 }, (_, i) =>
        `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix${i}&backgroundColor=b6e3f4`
    )

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const { user: currentUser } = await auth.getUser()

            if (!currentUser) {
                router.push('/auth/login')
                return
            }

            setUser(currentUser)

            const { data: profileData } = await db.getProfile(currentUser.id)
            setProfile(profileData)
            setEditName(profileData?.full_name || '')
            setEditAvatar(profileData?.avatar_url || '')

        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await auth.signOut()
        router.push('/auth/login')
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]

        try {
            const { data: publicUrl, error } = await import('@/lib/supabase').then(m => m.storage.uploadAvatar(user.id, file))

            if (error) throw error

            if (publicUrl) {
                setEditAvatar(publicUrl)
            }
        } catch (error) {
            console.error('Error uploading avatar:', error)
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
        } finally {
            setUploading(false)
        }
    }

    const handleSaveProfile = async () => {
        setLoading(true)
        try {
            const { error } = await db.updateProfile(user.id, {
                full_name: editName,
                avatar_url: editAvatar
            })

            if (error) throw error

            setProfile({ ...profile, full_name: editName, avatar_url: editAvatar })
            setIsEditing(false)
            alert('บันทึกข้อมูลเรียบร้อยแล้ว')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
                <div className="text-2xl text-pink-500 font-semibold animate-pulse">กำลังโหลดข้อมูล...</div>
            </div>
        )
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
                        <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:text-pink-500 font-medium flex items-center space-x-2">
                            <FaArrowLeft />
                            <span>กลับแดชบอร์ด</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>

                        <div className="relative z-10">

                            {!isEditing ? (
                                // VIEW MODE
                                <div className="flex flex-col items-center">
                                    <div className="w-40 h-40 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white overflow-hidden">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt={profile.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-6xl text-pink-400" />
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile?.full_name || 'ผู้ใช้งาน'}</h1>
                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold mb-8 ${profile?.role === 'instructor'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-pink-100 text-pink-600'
                                        }`}>
                                        {profile?.role === 'instructor' ? 'ผู้สอน' : 'นักเรียน'}
                                    </span>

                                    <div className="w-full max-w-md space-y-4 bg-white/50 p-6 rounded-2xl mb-8">
                                        <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mr-4">
                                                <FaEnvelope />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">อีเมล</p>
                                                <p className="font-medium text-gray-800">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mr-4">
                                                <FaIdBadge />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">เริ่มใช้งานเมื่อ</p>
                                                <p className="font-medium text-gray-800">
                                                    {new Date(user?.created_at).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full max-w-md">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-pink-300 hover:text-pink-500 transition-all font-medium flex items-center justify-center gap-2 group"
                                        >
                                            <FaEdit className="group-hover:scale-110 transition-transform" />
                                            <span>แก้ไขข้อมูลส่วนตัว</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium flex items-center justify-center gap-2"
                                        >
                                            <FaSignOutAlt />
                                            <span>ออกจากระบบ</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // EDIT MODE
                                <div className="flex flex-col items-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">แก้ไขข้อมูลส่วนตัว</h2>

                                    <div className="grid md:grid-cols-2 gap-8 w-full">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-40 h-40 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-pink-400 overflow-hidden relative group">
                                                {editAvatar ? (
                                                    <img
                                                        src={editAvatar}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaUser className="text-6xl text-pink-400" />
                                                )}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                                                        อัปโหลด...
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                                <label className="cursor-pointer py-2 px-4 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 text-center font-medium transition-colors">
                                                    <span>อัปโหลดรูปภาพ</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                            </div>

                                            <div className="mt-6 w-full">
                                                <h3 className="text-sm font-semibold text-gray-500 mb-3 text-center">หรือเลือกรูปการ์ตูนน่ารักๆ</h3>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {presetAvatars.map((avatar, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setEditAvatar(avatar)}
                                                            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${editAvatar === avatar ? 'border-pink-500 ring-2 ring-pink-200' : 'border-transparent hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Section */}
                                        <div className="flex flex-col justify-center">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ - นามสกุล</label>
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900"
                                                        placeholder="กรอกชื่อ-นามสกุลของคุณ"
                                                    />
                                                </div>

                                                <div className="pt-4 flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false)
                                                            setEditName(profile?.full_name || '')
                                                            setEditAvatar(profile?.avatar_url || '')
                                                        }}
                                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
                                                    >
                                                        ยกเลิก
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                                                    >
                                                        บันทึกข้อมูล
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
