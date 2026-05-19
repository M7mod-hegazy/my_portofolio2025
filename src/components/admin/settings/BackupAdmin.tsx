import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2,
    XCircle, Loader2, DatabaseBackup, FolderOpen, RefreshCw,
    User, Briefcase, Award, Wrench, MapPin, Phone, Layers,
    FileText, Clock, ChevronDown, ChevronUp, RotateCcw, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BackupFile {
    version: string;
    exportedAt: string;
    app: string;
    data: Record<string, any>;
}

interface CollectionMeta {
    key: string;
    label: string;
    icon: React.ElementType;
    color: string;
    endpoint: string;
    type: "singleton" | "collection";
    deleteEndpoint?: (id: string) => string;
}

type RestoreMode = "merge" | "replace";

interface RestoreTask {
    key: string;
    label: string;
    status: "pending" | "running" | "done" | "error";
    message?: string;
}

// ─── Collection definitions ───────────────────────────────────────────────────

const COLLECTIONS: CollectionMeta[] = [
    { key: "about",          label: "About",          icon: User,         color: "text-cyan-400",   endpoint: "/api/about",          type: "singleton" },
    { key: "hero",           label: "Hero",           icon: Layers,       color: "text-purple-400", endpoint: "/api/hero",            type: "singleton" },
    { key: "contact",        label: "Contact",        icon: Phone,        color: "text-green-400",  endpoint: "/api/contact",         type: "singleton" },
    { key: "projects",       label: "Projects",       icon: Briefcase,    color: "text-blue-400",   endpoint: "/api/projects",        type: "collection", deleteEndpoint: (id) => `/api/projects?id=${id}` },
    { key: "certifications", label: "Certifications", icon: Award,        color: "text-yellow-400", endpoint: "/api/certifications",  type: "collection", deleteEndpoint: (id) => `/api/certifications/${id}` },
    { key: "skills",         label: "Skills",         icon: Wrench,       color: "text-orange-400", endpoint: "/api/skills",          type: "collection", deleteEndpoint: (id) => `/api/skills/${id}` },
    { key: "services",       label: "Services",       icon: FileText,     color: "text-pink-400",   endpoint: "/api/services",        type: "collection", deleteEndpoint: (id) => `/api/services/${id}` },
    { key: "journey",        label: "Journey",        icon: MapPin,       color: "text-red-400",    endpoint: "/api/journey",         type: "collection", deleteEndpoint: (id) => `/api/journey/${id}` },
    { key: "categories",     label: "Categories",     icon: FolderOpen,   color: "text-indigo-400", endpoint: "/api/categories",      type: "collection", deleteEndpoint: (id) => `/api/categories?id=${id}` },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function strip(obj: any) {
    if (!obj) return obj;
    const { _id, __v, createdAt, updatedAt, captionName, homeInfoName, ...rest } = obj;
    return rest;
}

function countItems(val: any): number {
    if (Array.isArray(val)) return val.length;
    if (val && typeof val === "object") return 1;
    return 0;
}

function fmt(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BackupAdmin = () => {
    // Export
    const [isExporting, setIsExporting] = useState(false);
    const [lastExport, setLastExport] = useState<string | null>(
        () => localStorage.getItem("portfolio_last_export")
    );

    // Import / file state
    const fileRef = useRef<HTMLInputElement>(null);
    const [backupFile, setBackupFile] = useState<BackupFile | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    // Restore settings
    const [selected, setSelected] = useState<Set<string>>(
        new Set(COLLECTIONS.map((c) => c.key))
    );
    const [mode, setMode] = useState<RestoreMode>("merge");
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Restore progress
    const [tasks, setTasks] = useState<RestoreTask[]>([]);
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreDone, setRestoreDone] = useState(false);

    // ── Export ──────────────────────────────────────────────────────────────

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const results = await Promise.all(
                COLLECTIONS.map(async (c) => {
                    const res = await fetch(c.endpoint);
                    const json = await res.json();
                    return [c.key, json.success ? json.data : null] as const;
                })
            );

            const backup: BackupFile = {
                version: "1.0",
                exportedAt: new Date().toISOString(),
                app: "portfolio-admin",
                data: Object.fromEntries(results),
            };

            const blob = new Blob([JSON.stringify(backup, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);

            const now = new Date().toISOString();
            setLastExport(now);
            localStorage.setItem("portfolio_last_export", now);
            toast.success("Backup downloaded successfully");
        } catch {
            toast.error("Failed to create backup");
        } finally {
            setIsExporting(false);
        }
    };

    // ── Import file parsing ──────────────────────────────────────────────────

    const parseFile = (file: File) => {
        setFileError(null);
        setBackupFile(null);
        setRestoreDone(false);
        setTasks([]);

        if (!file.name.endsWith(".json")) {
            setFileError("Only .json backup files are supported.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string) as BackupFile;
                if (parsed.app !== "portfolio-admin" || !parsed.data || !parsed.version) {
                    setFileError("This file doesn't look like a valid portfolio backup.");
                    return;
                }
                setBackupFile(parsed);
                setSelected(new Set(Object.keys(parsed.data).filter((k) => COLLECTIONS.some((c) => c.key === k))));
            } catch {
                setFileError("Failed to parse JSON — file may be corrupted.");
            }
        };
        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) parseFile(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
        e.target.value = "";
    };

    // ── Restore ──────────────────────────────────────────────────────────────

    const startRestore = async () => {
        setConfirmOpen(false);
        setIsRestoring(true);
        setRestoreDone(false);

        const queue = COLLECTIONS.filter((c) => selected.has(c.key));
        setTasks(queue.map((c) => ({ key: c.key, label: c.label, status: "pending" })));

        const setTask = (key: string, update: Partial<RestoreTask>) =>
            setTasks((prev) => prev.map((t) => (t.key === key ? { ...t, ...update } : t)));

        for (const col of queue) {
            const raw = backupFile!.data[col.key];
            if (raw === undefined || raw === null) {
                setTask(col.key, { status: "error", message: "Not found in backup" });
                continue;
            }

            setTask(col.key, { status: "running" });

            try {
                if (col.type === "singleton") {
                    // Upsert singleton
                    const res = await fetch(col.endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(strip(raw)),
                    });
                    const json = await res.json();
                    if (!json.success) throw new Error(json.error || "Failed");
                    setTask(col.key, { status: "done" });
                } else {
                    const items: any[] = Array.isArray(raw) ? raw : [];

                    if (mode === "replace") {
                        // Fetch existing IDs and delete each
                        const existing = await fetch(col.endpoint).then((r) => r.json());
                        const ids: string[] = (existing.data || []).map((i: any) => i._id).filter(Boolean);
                        for (const id of ids) {
                            await fetch(col.deleteEndpoint!(id), { method: "DELETE" });
                        }
                    }

                    // Create each item
                    for (const item of items) {
                        await fetch(col.endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(strip(item)),
                        });
                    }

                    setTask(col.key, { status: "done", message: `${items.length} item${items.length !== 1 ? "s" : ""}` });
                }
            } catch (err: any) {
                setTask(col.key, { status: "error", message: err.message || "Unknown error" });
            }
        }

        setIsRestoring(false);
        setRestoreDone(true);
        toast.success("Restore complete!");
    };

    // ── Toggle selection ─────────────────────────────────────────────────────

    const toggleAll = () => {
        const keys = COLLECTIONS.filter((c) => backupFile?.data[c.key] !== undefined).map((c) => c.key);
        setSelected(selected.size === keys.length ? new Set() : new Set(keys));
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">

            {/* ── Export Card ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-4 p-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <DatabaseBackup className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Export Backup</h3>
                        <p className="text-sm text-gray-400">Download a full snapshot of all your portfolio data</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Collection chips */}
                    <div className="flex flex-wrap gap-2">
                        {COLLECTIONS.map(({ key, label, icon: Icon, color }) => (
                            <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                <Icon className={`w-3.5 h-3.5 ${color}`} />
                                {label}
                            </div>
                        ))}
                    </div>

                    {lastExport && (
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Last export: {fmt(lastExport)}
                        </p>
                    )}

                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-6 h-10 rounded-xl transition-all"
                    >
                        {isExporting
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Exporting…</>
                            : <><Download className="w-4 h-4 mr-2" />Download Backup</>
                        }
                    </Button>
                </div>
            </motion.div>

            {/* ── Restore Card ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-4 p-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <RotateCcw className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Restore from Backup</h3>
                        <p className="text-sm text-gray-400">Upload a backup JSON file to restore your data</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">

                    {/* Drop zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`
                            relative cursor-pointer rounded-xl border-2 border-dashed py-10 transition-all duration-300 text-center
                            ${isDragOver
                                ? "border-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                                : backupFile
                                    ? "border-green-500/40 bg-green-500/5"
                                    : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                            }
                        `}
                    >
                        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileInput} />
                        {backupFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                                <p className="text-sm font-medium text-green-300">Backup loaded — {fmt(backupFile.exportedAt)}</p>
                                <p className="text-xs text-gray-500">Click to load a different file</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className={`p-3 rounded-full bg-white/5 transition-transform ${isDragOver ? "scale-110" : ""}`}>
                                    <Upload className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/80">Drop backup file here or click to browse</p>
                                    <p className="text-xs text-gray-500 mt-1">portfolio-backup-*.json</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* File error */}
                    {fileError && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {fileError}
                        </motion.div>
                    )}

                    {/* Backup preview + settings */}
                    <AnimatePresence>
                        {backupFile && !restoreDone && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                            >
                                {/* Preview table */}
                                <div className="rounded-xl border border-white/10 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Backup contents</span>
                                        <button onClick={toggleAll} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                            {selected.size === COLLECTIONS.filter(c => backupFile.data[c.key] != null).length ? "Deselect all" : "Select all"}
                                        </button>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {COLLECTIONS.map(({ key, label, icon: Icon, color }) => {
                                            const val = backupFile.data[key];
                                            const available = val !== undefined && val !== null;
                                            const count = countItems(val);
                                            const checked = selected.has(key);

                                            return (
                                                <label key={key} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${available ? "hover:bg-white/[0.03]" : "opacity-40 cursor-not-allowed"}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked && available}
                                                        disabled={!available}
                                                        onChange={() => {
                                                            if (!available) return;
                                                            setSelected(prev => {
                                                                const next = new Set(prev);
                                                                next.has(key) ? next.delete(key) : next.add(key);
                                                                return next;
                                                            });
                                                        }}
                                                        className="w-4 h-4 rounded accent-purple-500"
                                                    />
                                                    <Icon className={`w-4 h-4 ${color} shrink-0`} />
                                                    <span className="flex-1 text-sm text-white">{label}</span>
                                                    <span className="text-xs font-mono text-gray-400">
                                                        {available
                                                            ? count === 1 && !Array.isArray(val) ? "1 record" : `${count} item${count !== 1 ? "s" : ""}`
                                                            : "not in backup"
                                                        }
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Mode selector */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Restore mode</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(["merge", "replace"] as RestoreMode[]).map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={`p-4 rounded-xl border text-left transition-all ${
                                                    mode === m
                                                        ? m === "replace"
                                                            ? "border-red-500/50 bg-red-500/10"
                                                            : "border-purple-500/50 bg-purple-500/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                                                }`}
                                            >
                                                <p className={`text-sm font-semibold ${mode === m ? (m === "replace" ? "text-red-300" : "text-purple-300") : "text-white"}`}>
                                                    {m === "merge" ? "Merge" : "Replace"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {m === "merge"
                                                        ? "Add backup items alongside existing data"
                                                        : "Delete all existing data, then restore from backup"
                                                    }
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning for replace mode */}
                                {mode === "replace" && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                                    >
                                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-300">
                                            <strong>Destructive:</strong> All existing data in selected collections will be permanently deleted before restoring.
                                        </p>
                                    </motion.div>
                                )}

                                {/* Restore button */}
                                <Button
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={selected.size === 0}
                                    className={`w-full h-11 font-semibold rounded-xl transition-all ${
                                        mode === "replace"
                                            ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                                    } text-white disabled:opacity-40`}
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Restore {selected.size} collection{selected.size !== 1 ? "s" : ""}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress log */}
                    <AnimatePresence>
                        {tasks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="rounded-xl border border-white/10 overflow-hidden"
                            >
                                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        {isRestoring
                                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />Restoring…</>
                                            : <><ShieldCheck className="w-3.5 h-3.5 text-green-400" />Restore complete</>
                                        }
                                    </span>
                                    {restoreDone && (
                                        <span className="text-xs text-gray-500">
                                            {tasks.filter(t => t.status === "done").length}/{tasks.length} succeeded
                                        </span>
                                    )}
                                </div>

                                {/* Overall progress bar */}
                                {isRestoring && (
                                    <div className="h-1 bg-white/5">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${(tasks.filter(t => t.status === "done" || t.status === "error").length / tasks.length) * 100}%` }}
                                            transition={{ ease: "easeOut" }}
                                        />
                                    </div>
                                )}

                                <div className="divide-y divide-white/5">
                                    {tasks.map((task) => {
                                        const col = COLLECTIONS.find(c => c.key === task.key)!;
                                        const Icon = col.icon;
                                        return (
                                            <div key={task.key} className="flex items-center gap-3 px-4 py-3">
                                                <Icon className={`w-4 h-4 ${col.color} shrink-0`} />
                                                <span className="flex-1 text-sm text-white">{task.label}</span>
                                                {task.message && (
                                                    <span className="text-xs text-gray-500">{task.message}</span>
                                                )}
                                                <span className="shrink-0">
                                                    {task.status === "pending" && <span className="w-4 h-4 block rounded-full border border-white/20" />}
                                                    {task.status === "running" && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                                                    {task.status === "done"    && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                                    {task.status === "error"   && <XCircle className="w-4 h-4 text-red-400" />}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Post-restore actions */}
                    {restoreDone && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => { setBackupFile(null); setTasks([]); setRestoreDone(false); setSelected(new Set(COLLECTIONS.map(c => c.key))); }}
                                className="border-white/10 text-gray-300 hover:bg-white/10"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Restore another
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                            >
                                Reload admin panel
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* ── Confirm Dialog ───────────────────────────────────────── */}
            <AnimatePresence>
                {confirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setConfirmOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="bg-[#0d0d1a] border border-white/15 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${mode === "replace" ? "bg-red-500/15 border border-red-500/30" : "bg-purple-500/15 border border-purple-500/30"}`}>
                                {mode === "replace" ? <Trash2 className="w-7 h-7 text-red-400" /> : <RotateCcw className="w-7 h-7 text-purple-400" />}
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white">Confirm Restore</h3>
                                <p className="text-sm text-gray-400">
                                    {mode === "replace"
                                        ? `This will permanently delete all existing data in ${selected.size} collection${selected.size !== 1 ? "s" : ""} and replace it with backup data. This cannot be undone.`
                                        : `This will add ${selected.size} collection${selected.size !== 1 ? "s" : ""} from the backup to your existing data.`
                                    }
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1 border-white/10 text-gray-300 hover:bg-white/10">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={startRestore}
                                    className={`flex-1 text-white font-semibold ${mode === "replace" ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"}`}
                                >
                                    {mode === "replace" ? "Delete & Restore" : "Restore now"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
