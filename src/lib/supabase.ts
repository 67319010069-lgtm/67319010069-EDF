import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
    signUp: async (email: string, password: string, fullName: string, role: string = 'student') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                    password: password // Store for trigger
                }
            }
        })
        return { data, error }
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    },

    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    }
}

// Database helpers
export const db = {
    // Profiles
    getProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        return { data, error }
    },

    updateProfile: async (userId: string, updates: any) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
        return { data, error }
    },

    // Courses
    getCourses: async (filters?: { category?: string, search?: string, published?: boolean }) => {
        let query = supabase.from('courses').select(`
      *,
      instructor:profiles!instructor_id(full_name, avatar_url),
      lessons(id),
      reviews(rating)
    `)

        if (filters?.published !== undefined) {
            query = query.eq('published', filters.published)
        }
        if (filters?.category) {
            query = query.eq('category', filters.category)
        }
        if (filters?.search) {
            query = query.ilike('title', `%${filters.search}%`)
        }

        const { data, error } = await query.order('created_at', { ascending: false })
        return { data, error }
    },

    getCourse: async (courseId: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select(`
        *,
        instructor:profiles!instructor_id(full_name, avatar_url, email),
        lessons(*),
        reviews(id, rating, comment, created_at, user:profiles(full_name, avatar_url))
      `)
            .eq('id', courseId)
            .single()
        return { data, error }
    },

    createCourse: async (course: any) => {
        const { data, error } = await supabase
            .from('courses')
            .insert(course)
            .select()
            .single()
        return { data, error }
    },

    updateCourse: async (courseId: string, updates: any) => {
        const { data, error } = await supabase
            .from('courses')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', courseId)
            .select()
            .single()
        return { data, error }
    },

    deleteCourse: async (courseId: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId)
        return { error }
    },

    // Lessons
    createLesson: async (lesson: any) => {
        const { data, error } = await supabase
            .from('lessons')
            .insert(lesson)
            .select()
            .single()
        return { data, error }
    },

    updateLesson: async (lessonId: string, updates: any) => {
        const { data, error } = await supabase
            .from('lessons')
            .update(updates)
            .eq('id', lessonId)
            .select()
            .single()
        return { data, error }
    },

    deleteLesson: async (lessonId: string) => {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId)
        return { error }
    },

    // Enrollments
    getEnrollment: async (userId: string, courseId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single()
        return { data, error }
    },

    getUserEnrollments: async (userId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
        *,
        course:courses(*, instructor:profiles!instructor_id(full_name), lessons(id))
      `)
            .eq('user_id', userId)
            .order('enrolled_at', { ascending: false })
        return { data, error }
    },

    createEnrollment: async (userId: string, courseId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .insert({ user_id: userId, course_id: courseId })
            .select()
            .single()
        return { data, error }
    },

    updateProgress: async (enrollmentId: string, completedLessonIds: string[]) => {
        const { data, error } = await supabase
            .from('enrollments')
            .update({ progress: completedLessonIds })
            .eq('id', enrollmentId)
            .select()
            .single()
        return { data, error }
    },

    // Reviews
    createReview: async (review: any) => {
        const { data, error } = await supabase
            .from('reviews')
            .insert(review)
            .select()
            .single()
        return { data, error }
    },

    updateReview: async (reviewId: string, updates: any) => {
        const { data, error } = await supabase
            .from('reviews')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', reviewId)
            .select()
            .single()
        return { data, error }
    },

    getUserReview: async (userId: string, courseId: string) => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single()
        return { data, error }
    }
}

// Storage helpers
export const storage = {
    uploadAvatar: async (userId: string, file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}.${fileExt}`
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true })

        if (error) return { data: null, error }

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        return { data: publicUrl, error: null }
    },

    uploadThumbnail: async (courseId: string, file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${courseId}.${fileExt}`
        const { data, error } = await supabase.storage
            .from('thumbnails')
            .upload(fileName, file, { upsert: true })

        if (error) return { data: null, error }

        const { data: { publicUrl } } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(fileName)

        return { data: publicUrl, error: null }
    },

    uploadCourseFile: async (courseId: string, file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${courseId}/${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage
            .from('course-files')
            .upload(fileName, file)

        if (error) return { data: null, error }

        const { data: { publicUrl } } = supabase.storage
            .from('course-files')
            .getPublicUrl(fileName)

        return { data: publicUrl, error: null }
    }
}
