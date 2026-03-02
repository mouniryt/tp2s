"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ArrowLeft,
    Save,
    UserPlus,
    Trash2,
    Pencil,
    Plus,
    Search,
    Users,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Patient {
    id: string
    firstName: string
    lastName: string
    age: string
    gender: string
    description: string
    createdAt: string
}

export default function DoctorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [patients, setPatients] = useState<Patient[]>([])
    const [editId, setEditId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        description: "",
    })

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        setFetching(true)
        try {
            const response = await fetch("/api/patients")
            const data = await response.json()
            if (data.success) {
                setPatients(data.patients)
            }
        } catch (error) {
            toast.error("Failed to load patients")
        } finally {
            setFetching(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, gender: value }))
    }

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            age: "",
            gender: "",
            description: "",
        })
        setEditId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = editId ? "PUT" : "POST"
            const body = editId ? { ...formData, id: editId } : formData

            const response = await fetch("/api/patients", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(editId ? "Patient record updated!" : "New patient registered!")
                resetForm()
                fetchPatients()
            } else {
                toast.error(data.error || "Operation failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (patient: Patient) => {
        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            age: patient.age,
            gender: patient.gender,
            description: patient.description,
        })
        setEditId(patient.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this patient record?")) return

        try {
            const response = await fetch(`/api/patients?id=${id}`, { method: "DELETE" })
            const data = await response.json()
            if (data.success) {
                toast.success("Patient deleted")
                fetchPatients()
            }
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const filteredPatients = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Header Area */}
            <div className="bg-background border-b px-4 py-4 md:px-8">
                <div className="mx-auto max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push("/")}
                            className="rounded-full"
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Doctor Portal</h1>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Medical Records Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center bg-muted px-3 py-1.5 rounded-md border border-border">
                            <Search className="size-4 text-muted-foreground mr-2" />
                            <input
                                placeholder="Search patients..."
                                className="bg-transparent text-sm outline-none w-40"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-12 xl:col-span-4">
                    <Card className="border-border shadow-md sticky top-8">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {editId ? <Pencil className="size-5" /> : <Plus className="size-5" />}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{editId ? "Update Record" : "New Patient"}</CardTitle>
                                    <CardDescription>Enter patient details below</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firstName" className="text-xs font-bold uppercase text-muted-foreground">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lastName" className="text-xs font-bold uppercase text-muted-foreground">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="h-9"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="age" className="text-xs font-bold uppercase text-muted-foreground">Age</Label>
                                        <Input
                                            id="age"
                                            name="age"
                                            type="number"
                                            required
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="gender" className="text-xs font-bold uppercase text-muted-foreground">Gender</Label>
                                        <Select onValueChange={handleSelectChange} value={formData.gender} required>
                                            <SelectTrigger id="gender" className="h-9">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <Label htmlFor="description" className="text-xs font-bold uppercase text-muted-foreground">Diagnosis / Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        className="min-h-[120px] resize-none text-sm"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {editId && (
                                        <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                                        {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        {editId ? "Update" : "Register"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-12 xl:col-span-8">
                    <Card className="border-border shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Patient Directory</CardTitle>
                                    <CardDescription>View and manage clinical records</CardDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold">{patients.length}</span>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Entries</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[180px]">Patient Name</TableHead>
                                            <TableHead>Age / Gender</TableHead>
                                            <TableHead className="hidden md:table-cell">Clincal Note</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fetching ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center">
                                                    <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                                                    <p className="text-sm mt-2 text-muted-foreground">Synchronizing records...</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredPatients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                                                    No patient records found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPatients.map((patient) => (
                                                <TableRow key={patient.id} className="group hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{patient.lastName.toUpperCase()} {patient.firstName}</span>
                                                            <span className="text-[10px] text-muted-foreground">ID: {patient.id.slice(-6)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <span className="px-1.5 py-0.5 bg-muted rounded text-[11px] font-bold">{patient.age}y</span>
                                                            <span className={`size-2 rounded-full ${patient.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                            <span className="capitalize text-xs">{patient.gender}</span>
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell max-w-[200px]">
                                                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                                            "{patient.description}"
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => handleEdit(patient)}
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() => handleDelete(patient.id)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
