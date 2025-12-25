import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Building2, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    color: "from-orange-500 to-red-500",
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
    color: "from-blue-500 to-purple-500",
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
    color: "from-yellow-500 to-red-500",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80"
  },
  {
    id: 4,
    title: "React Native Specialist",
    issuer: "Udacity",
    date: "2022",
    category: "Mobile",
    description: "Cross-platform mobile development with React Native",
    credentialId: "UDACITY-2022-004",
    verifyUrl: "https://udacity.com/verify",
    color: "from-cyan-500 to-blue-500",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80"
  },
  {
    id: 5,
    title: "Full Stack Nanodegree",
    issuer: "Udacity",
    date: "2021",
    category: "Backend",
    description: "Complete full-stack development curriculum",
    credentialId: "UDACITY-2021-005",
    verifyUrl: "https://udacity.com/verify",
    color: "from-green-500 to-emerald-500",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80"
  },
];

export const CertificationsSection = () => {
  const [certificates, setCertificates] = useState(DUMMY_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certifications');
        const data = await res.json();
        if (data.success && data.data) {
          setCertificates(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch certifications", error);
      }
    };
    fetchCertificates();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCert]);


  const categories = ["all", ...new Set(certificates.map(c => c.category || "Other").filter(Boolean))];
  const filteredCerts = filter === "all"
    ? certificates
    : certificates.filter(c => (c.category || "Other") === filter);

  return (
    <section id="certifications" className="relative py-32 min-h-screen bg-transparent overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 border border-primary/10 rounded-full opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-80 h-80 border border-accent/10 rounded-full opacity-20"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
            >
              <Award className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Credentials Vault
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of verified achievements and professional certifications that showcase my expertise
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === cat
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/50"
                : "bg-secondary/20 text-muted-foreground hover:bg-secondary/40 border border-white/10"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCerts.map((cert, index) => {
            const certColor = cert.color || "from-primary to-accent";
            const certCategory = cert.category || "Other";
            const certTitle = cert.title || "Certificate";
            const certIssuer = cert.issuer || "Unknown Issuer";
            const certDescription = cert.description || "Professional certification";
            const certDate = cert.date || "2024";
            const certVerifyUrl = cert.verifyUrl || "#";
            const certImage = cert.image || "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&q=80";

            return (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer h-full"
              >
                <div className="relative h-full rounded-2xl overflow-hidden bg-secondary/30 backdrop-blur-md border border-white/10 group-hover:border-primary/50 transition-all flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    <img
                      src={certImage}
                      alt={certTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/80 text-white backdrop-blur-sm">
                        {certCategory}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Icon Badge */}
                    <div className="mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${certColor} flex items-center justify-center`}>
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {certTitle}
                    </h3>

                    {/* Issuer */}
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{certIssuer}</span>
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                      {certDescription}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {certDate}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/40 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(certVerifyUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Selected Certificate */}
        <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
          <DialogContent className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-none h-[90vh] p-0 bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-2xl border-white/30 overflow-hidden shadow-2xl">
            <ScrollArea className="h-full w-full">
              {selectedCert && (
                <>
                  {/* Header with Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    {selectedCert.image && (
                      <img
                        src={selectedCert.image}
                        alt={selectedCert.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="text-xs font-semibold px-4 py-2 rounded-full bg-primary/80 text-white backdrop-blur-sm border border-white/20">
                        {selectedCert.category || "Other"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12">
                    {/* Icon and Title */}
                    <div className="mb-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCert.color || "from-primary to-accent"} flex items-center justify-center mb-6 shadow-lg`}>
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">{selectedCert.title || "Certificate"}</h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">{selectedCert.description || "Professional certification"}</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Issued By</p>
                        <p className="font-semibold text-lg">{selectedCert.issuer || "Unknown"}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-lg">{selectedCert.date || "2024"}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Category</p>
                        <p className="font-semibold text-lg">{selectedCert.category || "Other"}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Credential ID</p>
                        <p className="font-semibold text-lg text-primary">{selectedCert.credentialId || "N/A"}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => window.open(selectedCert.verifyUrl || "#", '_blank')}
                        className="flex-1 py-6 rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Verify Credential
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCert(null)}
                        className="py-6 px-6 rounded-2xl"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredCerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No certifications found in this category</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};