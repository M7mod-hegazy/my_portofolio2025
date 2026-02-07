import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, CheckCircle2, X, Search, Ribbon, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { ConstellationBackground } from "@/components/ui/constellation-background";
import { CertificatesGallery } from "@/components/ui/certificates-gallery";

const DUMMY_CERTIFICATES = [
    {
        id: 1,
        title: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        category: "Cloud",
        description: "Designed and deployed scalable AWS solutions",
        credentialId: "AWS-2023-001",
        verifyUrl: "https://aws.amazon.com/verify",
        image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&q=80"
    },
    {
        id: 2,
        title: "Meta Front-End Developer",
        issuer: "Meta Platforms",
        date: "2023",
        category: "Frontend",
        description: "Advanced React and JavaScript development",
        credentialId: "META-2023-002",
        verifyUrl: "https://meta.com/verify",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"
    },
    {
        id: 3,
        title: "Google Cloud Professional Developer",
        issuer: "Google Cloud",
        date: "2022",
        category: "Cloud",
        description: "Professional cloud architecture and development",
        credentialId: "GOOGLE-2022-003",
        verifyUrl: "https://google.com/verify",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80"
    },
    {
        id: 4,
        title: "Cyber Security Specialist",
        issuer: "CompTIA",
        date: "2021",
        category: "Security",
        description: "Network security and risk management",
        credentialId: "SEC-2021-999",
        verifyUrl: "#",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80"
    },
    {
        id: 5,
        title: "Data Science Professional",
        issuer: "IBM",
        date: "2022",
        category: "Data",
        description: "Data analysis and machine learning models",
        credentialId: "IBM-DS-2022",
        verifyUrl: "#",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
    }
];

// 3D Card Component
const CertificateCard = ({ cert, onClick }: { cert: any, onClick: () => void }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative w-full aspect-[4/3] cursor-pointer group rounded-lg bg-[#0a0a0a] shadow-lg perspective-1000"
        >
            {/* Frame Border */}
            <div
                className="absolute inset-0 rounded-lg border-[4px] md:border-[8px] border-[#222] shadow-inner z-10"
                style={{ transform: "translateZ(10px)" }}
            />

            {/* Gold Trim */}
            <div
                className="absolute inset-[4px] md:inset-[8px] rounded md:rounded-lg border border-[#c5a059]/40 z-20"
                style={{ transform: "translateZ(20px)" }}
            />

            {/* Image */}
            <div className="absolute inset-[6px] md:inset-[12px] overflow-hidden rounded-sm bg-black">
                {cert.image ? (
                    <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center">
                        <Award className="w-8 h-8 md:w-16 md:h-16 text-[#c5a059]/20" />
                    </div>
                )}
            </div>

            {/* Gloss Reflection */}
            <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 z-30 pointer-events-none mix-blend-plus-lighter"
                style={{
                    translateX: useTransform(x, [-100, 100], [-10, 10]),
                    translateY: useTransform(y, [-100, 100], [-10, 10]),
                }}
            />

            {/* 3D Floating Elements */}
            <div
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-40"
                style={{ transform: "translateZ(30px)" }}
            >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6e36] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ribbon className="w-4 h-4 md:w-6 md:h-6 text-white drop-shadow-sm" />
                </div>
            </div>

            <div
                className="absolute top-3 left-3 right-10 md:top-6 md:left-6 md:right-16 z-40"
                style={{ transform: "translateZ(25px)" }}
            >
                <span className="inline-block px-1.5 py-0.5 md:px-2 md:py-1 bg-black/90 backdrop-blur-md rounded border border-[#c5a059]/50 text-[#c5a059] text-[8px] md:text-[10px] font-bold tracking-wider mb-1 shadow-lg">
                    {cert.category?.toUpperCase()}
                </span>
                <h3 className="text-xs md:text-lg font-bold text-white drop-shadow-md leading-tight line-clamp-2 md:line-clamp-3">
                    {cert.title}
                </h3>
            </div>
        </motion.div>
    );
};

export const CertificationsSection = () => {
    const [certificates, setCertificates] = useState(DUMMY_CERTIFICATES);
    const [selectedCert, setSelectedCert] = useState<any>(null);
    const [filter, setFilter] = useState("all");

    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await fetch('/api/certifications');
                const data = await res.json();
                if (data.success && data.data) {
                    setCertificates(data.data.length > 0 ? data.data : DUMMY_CERTIFICATES);
                }
            } catch (error) {
                console.error("Failed to fetch certifications", error);
            }
        };
        fetchCertificates();
    }, []);

    const categories = ["all", ...new Set(certificates.map(c => c.category || "Other").filter(Boolean))];
    const filteredCerts = filter === "all"
        ? certificates
        : certificates.filter(c => (c.category || "Other") === filter);


    return (
        <section ref={sectionRef} id="certifications" className="relative py-16 md:py-24 min-h-screen bg-transparent transition-colors duration-1000 overflow-hidden">

            {/* 1. Ambient Glows (Deep Background) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[120px]" />
            </div>

            {/* 2. Constellation Network Effect */}
            <ConstellationBackground color="#c5a059" particleCount={100} connectionDistance={120} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center p-3 mb-4 rounded-full border border-[#c5a059]/20 bg-[#c5a059]/10"
                    >
                        <Award className="w-6 h-6 md:w-8 md:h-8 text-[#c5a059]" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        Official <span className="text-[#c5a059]">Certifications</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                        A comprehensive registry of professional engineering accreditations.
                    </p>
                </div>

                {/* 3D Overlapping Gallery */}
                <CertificatesGallery
                    certificates={filteredCerts}
                    onCertificateClick={(cert) => setSelectedCert(cert)}
                />

                {/* Premium Animated Modal */}
                <AnimatePresence>
                    {selectedCert && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setSelectedCert(null)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 50 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-4 md:inset-[10%] lg:inset-[15%] z-50 flex items-center justify-center pointer-events-none"
                            >
                                <div className="relative max-w-5xl w-full max-h-[90vh] bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#0f0f0f] border border-[#c5a059]/30 shadow-[0_0_60px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col md:flex-row rounded-2xl pointer-events-auto">

                                    {/* Decorative Corner Accents */}
                                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#c5a059]/40 rounded-tl-2xl pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#c5a059]/40 rounded-br-2xl pointer-events-none" />

                                    {/* Gold Glow Effect */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none" />

                                    {/* Left: Certificate Image */}
                                    <div className="w-full md:w-3/5 relative p-6 md:p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#c5a059]/10">
                                        {/* Grid Pattern */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                                        {selectedCert?.image ? (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1, duration: 0.4 }}
                                                className="relative"
                                            >
                                                {/* Certificate Frame */}
                                                <div className="relative p-2 bg-gradient-to-br from-[#c5a059]/20 to-[#8a6e36]/10 rounded-lg">
                                                    <div className="absolute inset-0 border-2 border-[#c5a059]/30 rounded-lg" />
                                                    <img
                                                        src={selectedCert.image}
                                                        alt={selectedCert.title}
                                                        className="w-full h-auto max-h-[60vh] object-contain rounded shadow-2xl relative z-10"
                                                    />
                                                </div>

                                                {/* Floating Badge */}
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.3, type: "spring" }}
                                                    className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6e36] shadow-[0_0_30px_rgba(197,160,89,0.4)] flex items-center justify-center z-20"
                                                >
                                                    <Award className="w-8 h-8 text-white" />
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <div className="text-[#c5a059]/20 font-serif text-xl border-4 border-[#c5a059]/20 p-12 rounded-lg">
                                                <Award className="w-16 h-16 mx-auto mb-4" />
                                                IMAGE UNAVAILABLE
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Details Panel */}
                                    <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col relative overflow-y-auto max-h-[50vh] md:max-h-none">
                                        {/* Close Button */}
                                        <button
                                            onClick={() => setSelectedCert(null)}
                                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all hover:rotate-90 duration-300 z-10"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        {/* Category Badge */}
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="mb-4"
                                        >
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#c5a059]/20 to-[#c5a059]/5 border border-[#c5a059]/40 text-[#c5a059] text-xs font-bold rounded-full tracking-wider">
                                                <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
                                                {selectedCert?.category?.toUpperCase() || 'CERTIFIED'}
                                            </span>
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h2
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 font-serif"
                                        >
                                            {selectedCert?.title}
                                        </motion.h2>

                                        {/* Description */}
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.25 }}
                                            className="text-zinc-400 text-sm leading-relaxed mb-6"
                                        >
                                            {selectedCert?.description}
                                        </motion.p>

                                        {/* Details Grid */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="pt-4 border-t border-[#c5a059]/10 grid grid-cols-2 gap-4 mb-6"
                                        >
                                            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                                <span className="text-[10px] uppercase tracking-wider text-[#c5a059]/60 block mb-1">Issuer</span>
                                                <span className="text-zinc-200 text-sm font-medium flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-[#c5a059]" />
                                                    {selectedCert?.issuer}
                                                </span>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                                <span className="text-[10px] uppercase tracking-wider text-[#c5a059]/60 block mb-1">Year</span>
                                                <span className="text-zinc-200 text-sm font-medium">{selectedCert?.date}</span>
                                            </div>
                                            {selectedCert?.credentialId && (
                                                <div className="col-span-2 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                                    <span className="text-[10px] uppercase tracking-wider text-[#c5a059]/60 block mb-1">Credential ID</span>
                                                    <span className="text-zinc-200 text-xs font-mono">{selectedCert.credentialId}</span>
                                                </div>
                                            )}
                                        </motion.div>

                                        {/* Verify Button */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.35 }}
                                            className="mt-auto"
                                        >
                                            <Button
                                                onClick={() => window.open(selectedCert?.verifyUrl)}
                                                className="w-full bg-gradient-to-r from-[#c5a059] to-[#a88a45] hover:from-[#d4af68] hover:to-[#b89950] text-black font-bold h-12 rounded-xl shadow-[0_0_30px_rgba(197,160,89,0.25)] transition-all hover:shadow-[0_0_40px_rgba(197,160,89,0.4)] hover:scale-[1.02]"
                                            >
                                                Verify Credential
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
