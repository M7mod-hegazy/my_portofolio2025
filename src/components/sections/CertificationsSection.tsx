import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Award, Calendar } from "lucide-react"

export const CertificationsSection = () => {
  const [selectedCert, setSelectedCert] = useState(null)
  const [certifications, setCertifications] = useState([])

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch('/api/certifications');
        const data = await res.json();
        if (data.success) {
          setCertifications(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch certifications", error);
      }
    };
    fetchCerts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <section id="certifications" className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="text-gradient">Certifications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional certifications and achievements that validate my expertise 
              in various technologies and platforms.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="flex overflow-x-auto space-x-8 pb-4">
            {certifications.map((cert, idx) => (
              <Card 
                key={cert._id || cert.id || idx}
                className="glass-card overflow-hidden group hover:shadow-glow transition-all duration-300 cursor-pointer flex-shrink-0 w-80"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cert.image || "/api/placeholder/300/200"}
                    alt={cert.title}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {cert.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {cert.issuer}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(cert.date)}
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="glass" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCert(cert)
                    }}
                  >
                    View Certificate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-3xl glass-card">
          {selectedCert && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedCert.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedCert.image || "/api/placeholder/300/200"}
                    alt={selectedCert.title}
                    className="w-full h-64 object-cover"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Issuing Organization
                      </h4>
                      <p className="text-lg font-medium">{selectedCert.issuer}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Issue Date
                      </h4>
                      <p className="text-lg font-medium">{formatDate(selectedCert.date)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Credential ID
                      </h4>
                      <p className="text-lg font-medium font-mono">{selectedCert.credentialId}</p>
                    </div>

                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => window.open(selectedCert.verificationUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verify Certificate
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}