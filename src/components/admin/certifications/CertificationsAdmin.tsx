import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Award, Plus, Trash2, ExternalLink, Calendar, CheckCircle } from "lucide-react";

interface CertificationDB {
    _id?: string;
    title: string;
    issuer: string;
    date: string;
    credentialId: string;
    verificationUrl: string;
    image: string;
}

export const CertificationsAdmin = () => {
    const [certs, setCerts] = useState<CertificationDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        try {
            const res = await fetch('/api/certifications');
            const json = await res.json();
            if (json.success) {
                setCerts(json.data);
            }
        } catch (err) {
            toast.error("Failed to fetch certifications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (cert: CertificationDB) => {
        // Validation
        if (!cert.title || !cert.issuer) {
            toast.error("Title and Issuer are required");
            return;
        }

        try {
            // For now, since we don't have a specific PUT /api/certifications/:id in server.ts (we need to check),
            // we might need to implement it. Checking server.ts view...
            // Wait, I didn't verify if PUT/POST/DELETE routes exist for certifications in the previous view. 
            // I only saw GET. 
            // I will implement general save logic, but if routes are missing, I'll need to add them to server.ts.
            // Let's assume standard REST pattern I've been using. If it fails, I'll update server.ts.

            // Checking server.ts snippets from memory/logs:
            // "app.get('/certifications'..." was seen.
            // "app.post" or "app.put" for certifications was NOT explicitly seen in the snippet (it ended at line 800).
            // Actually, I should probably check if they exist or verify by trying. 
            // Better yet, I'll assume they might be missing and I'll add them to server.ts in the next step if this fails.

            // Wait, to be safe, I should just update server.ts first to ensure routes exist. 
            // But let's write this component first.

            // ... (Component Logic)
        } catch (err) {
            console.error(err);
        }
    };

    // Actually, I'll rewrite this to just return the layout and logic, and I'll explicitly add the routes to server.ts after this tool call to be sure.

    const saveCert = async (cert: CertificationDB) => {
        try {
            const method = cert._id ? 'PUT' : 'POST';
            const url = cert._id ? `/api/certifications/${cert._id}` : '/api/certifications';
            const { _id, ...payload } = cert;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success("Certification saved");
                fetchCerts();
                setEditingId(null);
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving certification");
        }
    }

    const deleteCert = async (id: string) => {
        if (!confirm("Delete this certification?")) return;
        try {
            await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
            toast.success("Deleted");
            fetchCerts();
        } catch (err) {
            toast.error("Failed to delete");
        }
    }

    const addNew = () => {
        const newCert = {
            title: "New Certification",
            issuer: "",
            date: new Date().toISOString().split('T')[0],
            credentialId: "",
            verificationUrl: "",
            image: ""
        };
        // We'll just add it to the list locally as a "draft" with a special flag or just handle it in UI
        // Simpler: Just create it immediately? No, bad UX.
        // Let's just append to state with no ID.
        setCerts([newCert as CertificationDB, ...certs]);
        setEditingId("new"); // Special ID
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Certifications</h2>
                    <p className="text-gray-400">Manage your licenses and professional certifications.</p>
                </div>
                <Button onClick={addNew} className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Certificate
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {certs.map((cert, idx) => (
                    <Card key={cert._id || idx} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden flex flex-col group relative">
                        {/* Image / Header */}
                        <div className="h-32 bg-gradient-to-br from-gray-800 to-black relative">
                            {cert.image ? (
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Award className="w-16 h-16 text-white" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                {(cert._id || editingId === "new") && (
                                    <Button size="icon" variant="destructive" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => cert._id ? deleteCert(cert._id) : setCerts(certs.filter(c => c !== cert))}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4 flex-1 flex flex-col">
                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wider">Title</Label>
                                <Input
                                    value={cert.title}
                                    onChange={e => {
                                        const newCerts = [...certs];
                                        newCerts[idx].title = e.target.value;
                                        setCerts(newCerts);
                                    }}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-white font-bold text-lg focus:ring-0 focus:border-yellow-500"
                                    placeholder="Certificate Name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Issuer</Label>
                                    <Input
                                        value={cert.issuer}
                                        onChange={e => {
                                            const newCerts = [...certs];
                                            newCerts[idx].issuer = e.target.value;
                                            setCerts(newCerts);
                                        }}
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-gray-300 text-sm focus:ring-0 focus:border-yellow-500"
                                        placeholder="Issuer"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Date</Label>
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 text-gray-500 mr-2" />
                                        <Input
                                            value={cert.date}
                                            onChange={e => {
                                                const newCerts = [...certs];
                                                newCerts[idx].date = e.target.value;
                                                setCerts(newCerts);
                                            }}
                                            className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-gray-300 text-sm focus:ring-0 focus:border-yellow-500"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wider">Credential ID / URL</Label>
                                <Input
                                    value={cert.verificationUrl}
                                    onChange={e => {
                                        const newCerts = [...certs];
                                        newCerts[idx].verificationUrl = e.target.value;
                                        setCerts(newCerts);
                                    }}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 text-blue-400 text-xs focus:ring-0 focus:border-yellow-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="mt-auto pt-4 flex gap-2">
                                <Button onClick={() => saveCert(cert)} className="w-full bg-white/10 hover:bg-white/20 text-white">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Save
                                </Button>
                                {cert.verificationUrl && (
                                    <Button variant="ghost" size="icon" onClick={() => window.open(cert.verificationUrl, '_blank')}>
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
