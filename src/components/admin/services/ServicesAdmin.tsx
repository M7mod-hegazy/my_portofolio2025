import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Layers, Plus, Save, Trash2, Zap, Layout, Database, Server, Smartphone, Globe, Code } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ServiceDB {
    _id?: string;
    title: string;
    description: string;
    icon: string;
}

const PRESET_ICONS = ["Layout", "Server", "Database", "Smartphone", "Globe", "Code", "Zap", "Layers"];

export const ServicesAdmin = () => {
    const [services, setServices] = useState<ServiceDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const json = await res.json();
            if (json.success) {
                setServices(json.data);
            }
        } catch (err) {
            toast.error("Failed to fetch services");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (service: ServiceDB) => {
        try {
            const method = service._id ? 'PUT' : 'POST';
            const url = service._id ? `/api/services/${service._id}` : '/api/services';
            const { _id, ...payload } = service;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success("Service saved");
                fetchServices();
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving service");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this service?")) return;
        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            toast.success("Service deleted");
            setServices(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            toast.error("Error deleting service");
        }
    };

    const addService = () => {
        setServices([...services, { title: "New Service", description: "", icon: "Zap" }]);
    };

    const updateLocal = (index: number, field: keyof ServiceDB, value: string) => {
        const newServices = [...services];
        // @ts-ignore
        newServices[index][field] = value;
        setServices(newServices);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Services & Offerings</h2>
                <Button onClick={addService} className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <Card key={service._id || index} className="p-6 bg-white/5 border-white/10 backdrop-blur-md relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-500/20 text-green-400" onClick={() => handleSave(service)}>
                                <Save className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-500/20 text-red-400" onClick={() => service._id && handleDelete(service._id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10 shrink-0">
                                    {(() => {
                                        // @ts-ignore
                                        const Icon = LucideIcons[service.icon] as React.ElementType || Zap;
                                        return <Icon className="w-6 h-6 text-white" />;
                                    })()}
                                </div>
                                <div className="flex-1">
                                    <Label className="text-xs text-gray-500">Icon Name</Label>
                                    <SelectIcon
                                        value={service.icon}
                                        onChange={(v) => updateLocal(index, 'icon', v)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-400">Title</Label>
                                <Input
                                    value={service.title}
                                    onChange={(e) => updateLocal(index, 'title', e.target.value)}
                                    className="bg-black/50 border-white/10 text-white font-bold mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-400">Description</Label>
                                <Textarea
                                    value={service.description}
                                    onChange={(e) => updateLocal(index, 'description', e.target.value)}
                                    className="bg-black/50 border-white/10 text-white min-h-[100px] mt-1"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const SelectIcon = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-1">
            {PRESET_ICONS.map(icon => (
                <div
                    key={icon}
                    onClick={() => onChange(icon)}
                    className={`p-1.5 rounded cursor-pointer border ${value === icon ? 'bg-white/20 border-white' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                >
                    {/* @ts-ignore */}
                    {(() => { const I = LucideIcons[icon]; return <I size={14} className="text-white" />; })()}
                </div>
            ))}
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-24 bg-black/50 border-white/10 text-xs text-white"
                placeholder="Custom..."
            />
        </div>
    )
}
