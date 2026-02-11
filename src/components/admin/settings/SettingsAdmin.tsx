import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, FileText, Globe, Mail, Phone, MapPin, Linkedin, Github, Twitter, Facebook, Instagram, MessageCircle } from "lucide-react";
import { AdminLoader } from "../AdminLoader";

interface ContactDB {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    messenger: string;
}

interface CVDB {
    url: string;
    updatedAt: string;
}

export const SettingsAdmin = () => {
    const [contact, setContact] = useState<ContactDB>({
        email: "", phone: "", location: "", website: "",
        linkedin: "", github: "", twitter: "", instagram: "", facebook: "", whatsapp: "", messenger: ""
    });
    const [cv, setCv] = useState<CVDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contactRes, cvRes] = await Promise.all([
                fetch('/api/contact'),
                fetch('/api/cv')
            ]);

            const contactJson = await contactRes.json();
            const cvJson = await cvRes.json();

            if (contactJson.success && contactJson.data) setContact(contactJson.data);
            if (cvJson.success && cvJson.data) setCv(cvJson.data);

        } catch (err) {
            toast.error("Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Contact info updated");
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Failed to save contact");
        }
    };

    const handleSaveCV = async (url: string) => {
        try {
            const res = await fetch('/api/cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("CV updated");
                setCv(json.data);
            }
        } catch (err) {
            toast.error("Failed to save CV");
        }
    };

    if (isLoading) return <AdminLoader />;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Global Settings</h2>
                    <p className="text-gray-400">Manage your digital presence and global configurations.</p>
                </div>
                <Button onClick={handleSaveContact} className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="contact" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="contact" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Contact & Socials</TabsTrigger>
                    <TabsTrigger value="cv" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Resume / CV</TabsTrigger>
                </TabsList>

                {/* Contact & Socials Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Info */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> Primary Contact</h3>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={contact.location} onChange={e => setContact({ ...contact, location: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Personal Website</Label>
                                <Input value={contact.website} onChange={e => setContact({ ...contact, website: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                        </Card>

                        {/* Social Links */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> Social Networks</h3>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3">
                                    <Github className="w-5 h-5 text-gray-400" />
                                    <Input placeholder="GitHub URL" value={contact.github} onChange={e => setContact({ ...contact, github: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Linkedin className="w-5 h-5 text-blue-400" />
                                    <Input placeholder="LinkedIn URL" value={contact.linkedin} onChange={e => setContact({ ...contact, linkedin: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Twitter className="w-5 h-5 text-sky-400" />
                                    <Input placeholder="Twitter URL" value={contact.twitter} onChange={e => setContact({ ...contact, twitter: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Instagram className="w-5 h-5 text-pink-400" />
                                    <Input placeholder="Instagram URL" value={contact.instagram} onChange={e => setContact({ ...contact, instagram: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                    <Input placeholder="Facebook URL" value={contact.facebook} onChange={e => setContact({ ...contact, facebook: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                            </div>
                        </Card>

                        {/* Messaging Apps */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4 md:col-span-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-400" /> Direct Messaging</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>WhatsApp Number</Label>
                                    <Input placeholder="+1234567890" value={contact.whatsapp} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Messenger URL</Label>
                                    <Input placeholder="m.me/username" value={contact.messenger} onChange={e => setContact({ ...contact, messenger: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* CV Tab */}
                <TabsContent value="cv" className="mt-6">
                    <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md text-center space-y-6">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
                            <FileText className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Resume / CV Configuration</h3>
                            <p className="text-gray-400 mt-2 max-w-md mx-auto">
                                Manage the PDF file linked to the "Download Resume" buttons across your portfolio.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Paste URL to PDF (Cloudinary, Drive, etc.)"
                                    value={cv?.url || ""}
                                    onChange={e => setCv(cv ? { ...cv, url: e.target.value } : { url: e.target.value, updatedAt: new Date().toISOString() })}
                                    className="bg-black/50 border-white/10 text-white"
                                />
                                <Button onClick={() => cv && handleSaveCV(cv.url)} variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                    Update
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Currently using direct URL. Future update will support drag-and-drop upload.
                            </p>

                            {cv?.updatedAt && (
                                <p className="text-sm text-gray-400 pt-4 border-t border-white/10">
                                    Last Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
