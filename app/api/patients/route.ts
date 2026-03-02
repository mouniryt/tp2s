import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'patients.json')

function getPatients() {
    if (!fs.existsSync(filePath)) {
        // Ensure directory exists
        const dirPath = path.dirname(filePath)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify([]))
        return []
    }
    const fileContent = fs.readFileSync(filePath, 'utf8')
    try {
        return JSON.parse(fileContent)
    } catch (error) {
        return []
    }
}

function savePatients(patients: any[]) {
    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2))
}

export async function GET() {
    try {
        const patients = getPatients()
        return NextResponse.json({ success: true, patients })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const patients = getPatients()

        const newPatient = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        }

        patients.push(newPatient)
        savePatients(patients)

        return NextResponse.json({ success: true, patient: newPatient })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const { id, ...updates } = data

        const patients = getPatients()
        const index = patients.findIndex((p: any) => p.id === id)

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 })
        }

        patients[index] = { ...patients[index], ...updates, updatedAt: new Date().toISOString() }
        savePatients(patients)

        return NextResponse.json({ success: true, patient: patients[index] })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
        }

        let patients = getPatients()
        const filtered = patients.filter((p: any) => p.id !== id)

        if (patients.length === filtered.length) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 })
        }

        savePatients(filtered)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
    }
}
