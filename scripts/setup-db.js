const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Manually load .env if not loaded (simple parser)
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            const value = match[2].trim().replace(/^["']/, '').replace(/["']$/, '')
            if (!process.env[key]) {
                process.env[key] = value
            }
        }
    })
}

const prisma = new PrismaClient()

async function main() {
    console.log('Start setting up Supabase database...')

    const sqlPath = path.join(__dirname, '..', 'supabase-setup.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    try {
        // Try executing as one block first
        await prisma.$executeRawUnsafe(sql)
        console.log('Successfully executed setup script.')
    } catch (e) {
        console.error('Error executing as one block. Trying to split by sections...')
        console.error(e.message)

        // Fallback: Split by "-- ============================================" comments 
        const sections = sql.split('-- ============================================')

        for (const section of sections) {
            if (!section.trim()) continue;
            try {
                await prisma.$executeRawUnsafe(section)
                console.log('Executed a section.')
            } catch (innerError) {
                console.log('Error executing section (might be expected if already exists):', innerError.message.split('\n')[0])
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
