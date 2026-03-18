// vite.config.ts
import path2 from "path";
import react from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/@vitejs/plugin-react-swc/index.js";
import { defineConfig } from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/vite/dist/node/index.js";

// server.ts
import express from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/express/index.js";
import mongoose from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/mongoose/index.js";
import cors from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/cors/lib/index.js";
import dotenv from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/dotenv/lib/main.js";
import multer from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/multer/index.js";
import { v2 as cloudinary } from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/cloudinary/cloudinary.js";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
dotenv.config();
function createApiServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const CV_UPLOADS_DIR = path.join(process.cwd(), "uploads", "cv");
  if (!fs.existsSync(CV_UPLOADS_DIR)) fs.mkdirSync(CV_UPLOADS_DIR, { recursive: true });
  app.use("/cv-files", express.static(CV_UPLOADS_DIR));
  app.use((req, res, next) => {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected for local dev")).catch((err) => console.error("MongoDB connection error:", err));
  const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    videos: [String],
    technologies: [String],
    category: { type: String, required: true },
    liveUrl: String,
    githubUrl: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
  const CertificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: String,
    category: String,
    date: String,
    startDate: String,
    endDate: String,
    courseHours: String,
    credentialId: String,
    verificationUrl: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Certification = mongoose.models.Certification || mongoose.model("Certification", CertificationSchema);
  const SkillSchema = new mongoose.Schema({
    name: String,
    icon: String,
    category: String,
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Intermediate" },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    certIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certification" }]
  });
  const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
  const AboutSchema = new mongoose.Schema({
    name: { type: String, default: "Your Name" },
    title: { type: String, default: "Full-Stack Developer" },
    location: { type: String, default: "Your Location" },
    aboutCaptionFallbackName: { type: String, default: "" },
    content: String,
    avatar: String,
    mission: { type: String, default: "Building scalable products that blend technical excellence with intuitive design." },
    stats: [{ label: String, value: String }],
    passions: [{ icon: String, label: String }],
    tags: [String],
    ctaTitle: { type: String, default: "Let's Build Something Amazing" },
    ctaSubtitle: { type: String, default: "Open to collaborations and new opportunities." }
  });
  const About = mongoose.models.About || mongoose.model("About", AboutSchema);
  const ServiceSchema = new mongoose.Schema({ title: String, description: String, icon: String });
  const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
  const HeroSchema = new mongoose.Schema({
    greeting: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    resumeUrl: String,
    socialLinks: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
  const JourneySchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    year: String,
    period: String,
    description: String,
    achievements: [String],
    technologies: [String],
    type: { type: String, enum: ["work", "education", "project"], default: "work" },
    icon: { type: String, default: "Briefcase" },
    color: { type: String, default: "#06b6d4" },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Journey = mongoose.models.Journey || mongoose.model("Journey", JourneySchema);
  const ContactSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    facebook: String,
    whatsapp: String,
    messenger: String,
    hiddenSocials: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
  const CVSchema = new mongoose.Schema({
    url: String,
    filename: String
  }, { timestamps: true });
  const CV = mongoose.models.CV || mongoose.model("CV", CVSchema);
  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["skill", "project", "service"], required: true },
    description: { type: String },
    color: { type: String, default: "#3b82f6" },
    icon: { type: String, default: "Folder" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
  const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
  const seedDefaultHero = async () => {
    try {
      const existingHero = await Hero.findOne();
      if (!existingHero) {
        await Hero.create({
          greeting: "Hello, I'm",
          title: "John Doe",
          subtitle: "Creative Developer",
          description: "I build immersive web experiences with modern technologies.",
          resumeUrl: "/resume.pdf",
          socialLinks: true
        });
        console.log("\u2705 Created default Hero data");
      }
    } catch (error) {
      console.error("Error seeding Hero data:", error);
    }
  };
  seedDefaultHero();
  const seedDefaultCategories = async () => {
    try {
      const defaultCategories = [
        { name: "Frontend", type: "skill", description: "Frontend technologies", color: "#3b82f6", icon: "Monitor" },
        { name: "Backend", type: "skill", description: "Backend technologies", color: "#10b981", icon: "Server" },
        { name: "Mobile", type: "skill", description: "Mobile development", color: "#8b5cf6", icon: "Smartphone" },
        { name: "Tools", type: "skill", description: "DevOps & Tools", color: "#f59e0b", icon: "Wrench" }
      ];
      for (const cat of defaultCategories) {
        const existing = await Category.findOne({ name: cat.name, type: cat.type });
        if (!existing) await Category.create(cat);
      }
    } catch (error) {
      console.error("Error seeding categories:", error);
    }
  };
  seedDefaultCategories();
  app.get("/projects", async (req, res) => {
    try {
      const projects = await Project.find().sort({ order: 1, createdAt: -1 });
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/projects", async (req, res) => {
    try {
      const count = await Project.countDocuments();
      const project = await Project.create({ ...req.body, order: count });
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/projects/reorder", async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ success: false, error: "Items array required" });
      }
      const bulkOps = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: item.order } }
        }
      }));
      await Project.bulkWrite(bulkOps);
      res.status(200).json({ success: true, message: "Order updated" });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/projects", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/projects", async (req, res) => {
    try {
      const { id } = req.query;
      await Project.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/certifications", async (req, res) => {
    try {
      const certs = await Certification.find().sort({ date: -1 });
      res.status(200).json({ success: true, data: certs });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/certifications", async (req, res) => {
    try {
      const cert = await Certification.create(req.body);
      res.status(201).json({ success: true, data: cert });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/certifications/:id", async (req, res) => {
    try {
      const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: cert });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/certifications/:id", async (req, res) => {
    try {
      await Certification.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/skills", async (req, res) => res.json({ success: true, data: await Skill.find().populate("projectIds").populate("certIds") }));
  app.post("/skills", async (req, res) => res.status(201).json({ success: true, data: await new Skill(req.body).save() }));
  app.delete("/skills/:id", async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
  app.put("/skills/:id", async (req, res) => {
    try {
      const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("projectIds").populate("certIds");
      res.status(200).json({ success: true, data: updatedSkill });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/about", async (req, res) => {
    try {
      let about = await About.findOne();
      if (!about) {
        about = await About.create({});
      }
      const homeInfo = await Hero.findOne({}, { title: 1 }).lean();
      const homeInfoName = homeInfo?.title?.trim() || "";
      const fallbackCaptionName = about.aboutCaptionFallbackName?.trim() || "";
      const captionName = homeInfoName || fallbackCaptionName || about.name || "Your Name";
      res.json({
        success: true,
        data: {
          ...about.toObject(),
          captionName,
          homeInfoName
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/about", async (req, res) => {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: about });
  });
  app.get("/services", async (req, res) => res.json({ success: true, data: await Service.find() }));
  app.post("/services", async (req, res) => {
    try {
      const service = await new Service(req.body).save();
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/services/:id", async (req, res) => {
    try {
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: service });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/services/:id", async (req, res) => {
    try {
      await Service.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/hero", async (req, res) => {
    try {
      const hero = await Hero.findOne();
      res.status(200).json({ success: true, data: hero });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/hero", async (req, res) => {
    try {
      const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.status(200).json({ success: true, data: hero });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/journey", async (req, res) => {
    try {
      const journeyItems = await Journey.find().sort({ order: 1, year: -1, createdAt: -1 });
      res.status(200).json({ success: true, data: journeyItems });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/journey", async (req, res) => {
    try {
      const count = await Journey.countDocuments();
      const journeyItem = await Journey.create({ ...req.body, order: req.body.order ?? count });
      res.status(201).json({ success: true, data: journeyItem });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/journey/reorder", async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ success: false, error: "Items array required" });
      }
      const bulkOps = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: item.order } }
        }
      }));
      await Journey.bulkWrite(bulkOps);
      res.status(200).json({ success: true, message: "Order updated" });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/journey/:id", async (req, res) => {
    try {
      const journeyItem = await Journey.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: journeyItem });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/journey/:id", async (req, res) => {
    try {
      await Journey.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/journey", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      await Journey.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/contact", async (req, res) => {
    try {
      const contact = await Contact.findOne();
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/contact", async (req, res) => {
    try {
      const contact = await Contact.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/cv", async (req, res) => {
    try {
      const cv = await CV.findOne().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: cv });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/cv", async (req, res) => {
    try {
      await CV.deleteMany({});
      const newCV = new CV(req.body);
      await newCV.save();
      res.status(201).json({ success: true, data: newCV });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/cv/download", async (req, res) => {
    try {
      const cv = await CV.findOne().sort({ createdAt: -1 });
      if (!cv || !cv.url) {
        return res.status(404).json({ success: false, error: "No CV uploaded yet." });
      }
      const filename = cv.filename || "resume.pdf";
      const cvUrl = cv.url;
      console.log("[CV/DOWNLOAD] url:", cvUrl, "| file:", filename);
      if (cvUrl.startsWith("/api/cv-files/")) {
        const localFilename = cvUrl.replace("/api/cv-files/", "");
        const filePath = path.join(process.cwd(), "uploads", "cv", localFilename);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ success: false, error: "CV file not found on server." });
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.sendFile(filePath);
      }
      const uploadMatch = cvUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
      if (uploadMatch) {
        const fullPath = uploadMatch[1];
        const signedDeliveryUrl = cloudinary.url(fullPath, {
          resource_type: "raw",
          type: "upload",
          sign_url: true,
          secure: true
        });
        console.log("[CV/DOWNLOAD] Legacy Cloudinary redirect:", signedDeliveryUrl);
        return res.redirect(302, signedDeliveryUrl);
      }
      return res.redirect(302, cvUrl);
    } catch (error) {
      console.error("[CV/DOWNLOAD] ERROR:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.get("/cv/debug", async (req, res) => {
    try {
      const cv = await CV.findOne().sort({ createdAt: -1 });
      if (!cv || !cv.url) return res.json({ error: "No CV in DB" });
      const cvUrl = cv.url;
      const uploadMatch = cvUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
      let fullPath = "", signedDeliveryUrl = "";
      if (uploadMatch) {
        fullPath = uploadMatch[1];
        signedDeliveryUrl = cloudinary.url(fullPath, {
          resource_type: "raw",
          type: "upload",
          sign_url: true,
          secure: true
        });
      }
      let directStatus = 0, signedStatus = 0;
      try {
        directStatus = (await fetch(cvUrl)).status;
      } catch (e) {
        directStatus = -1;
      }
      try {
        signedStatus = (await fetch(signedDeliveryUrl)).status;
      } catch (e) {
        signedStatus = -1;
      }
      return res.json({
        storedUrl: cvUrl,
        filename: cv.filename,
        extractedFullPath: fullPath,
        generatedSignedDeliveryUrl: signedDeliveryUrl,
        directUrlStatus: directStatus,
        signedDeliveryUrlStatus: signedStatus,
        cloudinaryConfig: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKeyPrefix: (process.env.CLOUDINARY_API_KEY || "").substring(0, 6) + "...",
          apiSecretSet: !!process.env.CLOUDINARY_API_SECRET,
          apiSecretLength: (process.env.CLOUDINARY_API_SECRET || "").length
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/messages", async (req, res) => {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/messages", async (req, res) => {
    try {
      const message = await ContactMessage.create(req.body);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/messages/:id", async (req, res) => {
    try {
      const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: message });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/messages/:id", async (req, res) => {
    try {
      await ContactMessage.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/categories", async (req, res) => {
    try {
      const { type } = req.query;
      const query = type ? { type } : {};
      const categories = await Category.find(query).sort({ name: 1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/categories", async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/categories", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (!category) return res.status(404).json({ success: false, error: "Category not found" });
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/categories", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      await Category.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/config", (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME
      }
    });
  });
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  const storage = multer.memoryStorage();
  const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }
    // 100MB (supports video uploads)
  });
  app.post("/upload", uploadMiddleware.array("files", 10), async (req, res) => {
    try {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("Cloudinary configuration missing!");
        return res.status(500).json({
          success: false,
          error: "Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
        });
      }
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, error: "No files uploaded" });
      }
      console.log(`Uploading ${files.length} file(s)...`);
      const uploadPromises = files.map((file) => {
        const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
        if (isPdf) {
          return new Promise((resolve, reject) => {
            const safeFilename = `cv_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const destPath = path.join(process.cwd(), "uploads", "cv", safeFilename);
            fs.writeFile(destPath, file.buffer, (err) => {
              if (err) {
                console.error("[Upload] Failed to save PDF locally:", err);
                reject(err);
              } else {
                const localUrl = `/api/cv-files/${safeFilename}`;
                console.log("[Upload] PDF saved locally:", destPath, "\u2192", localUrl);
                resolve({
                  originalName: file.originalname,
                  filename: file.originalname,
                  url: localUrl,
                  size: file.size,
                  resource_type: "local"
                });
              }
            });
          });
        }
        return new Promise((resolve, reject) => {
          const isVideo = file.mimetype.startsWith("video/");
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "portfolio",
              timeout: 3e5,
              ...isVideo ? {
                quality: "auto:low",
                chunk_size: 6e6
              } : {
                quality: 65,
                fetch_format: "auto",
                width: 1920,
                height: 1080,
                crop: "limit"
              }
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Upload success:", result?.secure_url, `(${file.size} \u2192 ${result?.bytes})`);
                resolve({
                  originalName: file.originalname,
                  url: result?.secure_url,
                  publicId: result?.public_id,
                  format: result?.format,
                  resource_type: result?.resource_type,
                  originalSize: file.size,
                  size: result?.bytes,
                  width: result?.width,
                  height: result?.height,
                  filename: file.originalname
                });
              }
            }
          );
          const readable = new Readable();
          readable.push(file.buffer);
          readable.push(null);
          readable.pipe(uploadStream);
        });
      });
      const results = await Promise.all(uploadPromises);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("Upload error:", error?.message || error);
      res.status(500).json({
        success: false,
        error: error?.message || "Upload failed",
        details: process.env.NODE_ENV !== "production" ? String(error) : void 0
      });
    }
  });
  return app;
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\M7mod Hegazy\\Desktop\\asd\\django\\admin-portofolio-main";
var apiServerPlugin = () => ({
  name: "api-server-plugin",
  configureServer: (server) => {
    const api = createApiServer();
    server.middlewares.use("/api", api);
  }
});
var vite_config_default = defineConfig({
  envDir: "./",
  // Use the root directory for .env files
  plugins: [
    react(),
    apiServerPlugin()
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2VydmVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTTdtb2QgSGVnYXp5XFxcXERlc2t0b3BcXFxcYXNkXFxcXGRqYW5nb1xcXFxhZG1pbi1wb3J0b2ZvbGlvLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE03bW9kIEhlZ2F6eVxcXFxEZXNrdG9wXFxcXGFzZFxcXFxkamFuZ29cXFxcYWRtaW4tcG9ydG9mb2xpby1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NN21vZCUyMEhlZ2F6eS9EZXNrdG9wL2FzZC9kamFuZ28vYWRtaW4tcG9ydG9mb2xpby1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBWaXRlRGV2U2VydmVyIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgY3JlYXRlQXBpU2VydmVyIH0gZnJvbSBcIi4vc2VydmVyXCJcblxuY29uc3QgYXBpU2VydmVyUGx1Z2luID0gKCkgPT4gKHtcbiAgbmFtZTogJ2FwaS1zZXJ2ZXItcGx1Z2luJyxcbiAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyOiBWaXRlRGV2U2VydmVyKSA9PiB7XG4gICAgY29uc3QgYXBpID0gY3JlYXRlQXBpU2VydmVyKCk7XG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaScsIGFwaSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnZEaXI6ICcuLycsIC8vIFVzZSB0aGUgcm9vdCBkaXJlY3RvcnkgZm9yIC5lbnYgZmlsZXNcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgYXBpU2VydmVyUGx1Z2luKClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTTdtb2QgSGVnYXp5XFxcXERlc2t0b3BcXFxcYXNkXFxcXGRqYW5nb1xcXFxhZG1pbi1wb3J0b2ZvbGlvLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE03bW9kIEhlZ2F6eVxcXFxEZXNrdG9wXFxcXGFzZFxcXFxkamFuZ29cXFxcYWRtaW4tcG9ydG9mb2xpby1tYWluXFxcXHNlcnZlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTTdtb2QlMjBIZWdhenkvRGVza3RvcC9hc2QvZGphbmdvL2FkbWluLXBvcnRvZm9saW8tbWFpbi9zZXJ2ZXIudHNcIjtpbXBvcnQgZXhwcmVzcywgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5pbXBvcnQgbXVsdGVyIGZyb20gJ211bHRlcic7XHJcbmltcG9ydCB7IHYyIGFzIGNsb3VkaW5hcnkgfSBmcm9tICdjbG91ZGluYXJ5JztcclxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tICdzdHJlYW0nO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHR5cGUgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XHJcblxyXG5kb3RlbnYuY29uZmlnKCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBpU2VydmVyKCkge1xyXG4gICAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG4gICAgYXBwLnVzZShjb3JzKCkpO1xyXG4gICAgYXBwLnVzZShleHByZXNzLmpzb24oKSk7XHJcblxyXG4gICAgLy8gU2VydmUgbG9jYWxseS1zdG9yZWQgQ1YgZmlsZXMgKFBERnMgc3RvcmVkIG9uIGRpc2sgdG8gYXZvaWQgQ2xvdWRpbmFyeSBhY2Nlc3MgcmVzdHJpY3Rpb25zKVxyXG4gICAgY29uc3QgQ1ZfVVBMT0FEU19ESVIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3VwbG9hZHMnLCAnY3YnKTtcclxuICAgIGlmICghZnMuZXhpc3RzU3luYyhDVl9VUExPQURTX0RJUikpIGZzLm1rZGlyU3luYyhDVl9VUExPQURTX0RJUiwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICBhcHAudXNlKCcvY3YtZmlsZXMnLCBleHByZXNzLnN0YXRpYyhDVl9VUExPQURTX0RJUikpO1xyXG5cclxuICAgIC8vIFJlcXVlc3QgTG9nZ2luZyBNaWRkbGV3YXJlXHJcbiAgICBhcHAudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XSAke3JlcS5tZXRob2R9ICR7cmVxLnVybH1gKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAtLS0gTW9uZ29EQiBDb25maWcgLS0tXHJcbiAgICBtb25nb29zZS5jb25uZWN0KHByb2Nlc3MuZW52Lk1PTkdPX1VSSSBhcyBzdHJpbmcpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ01vbmdvREIgY29ubmVjdGVkIGZvciBsb2NhbCBkZXYnKSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ01vbmdvREIgY29ubmVjdGlvbiBlcnJvcjonLCBlcnIpKTtcclxuXHJcbiAgICAvLyAtLS0gU2NoZW1hcyAmIE1vZGVscyAtLS1cclxuICAgIGNvbnN0IFByb2plY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGltYWdlczogW1N0cmluZ10sXHJcbiAgICAgICAgdmlkZW9zOiBbU3RyaW5nXSxcclxuICAgICAgICB0ZWNobm9sb2dpZXM6IFtTdHJpbmddLFxyXG4gICAgICAgIGNhdGVnb3J5OiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBsaXZlVXJsOiBTdHJpbmcsXHJcbiAgICAgICAgZ2l0aHViVXJsOiBTdHJpbmcsXHJcbiAgICAgICAgZmVhdHVyZWQ6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfSxcclxuICAgICAgICBvcmRlcjogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcclxuICAgICAgICBjcmVhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfSxcclxuICAgICAgICB1cGRhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBQcm9qZWN0ID0gbW9uZ29vc2UubW9kZWxzLlByb2plY3QgfHwgbW9uZ29vc2UubW9kZWwoJ1Byb2plY3QnLCBQcm9qZWN0U2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBDZXJ0aWZpY2F0aW9uU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGlzc3VlcjogU3RyaW5nLFxyXG4gICAgICAgIGNhdGVnb3J5OiBTdHJpbmcsXHJcbiAgICAgICAgZGF0ZTogU3RyaW5nLFxyXG4gICAgICAgIHN0YXJ0RGF0ZTogU3RyaW5nLFxyXG4gICAgICAgIGVuZERhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3Vyc2VIb3VyczogU3RyaW5nLFxyXG4gICAgICAgIGNyZWRlbnRpYWxJZDogU3RyaW5nLFxyXG4gICAgICAgIHZlcmlmaWNhdGlvblVybDogU3RyaW5nLFxyXG4gICAgICAgIGltYWdlOiBTdHJpbmcsXHJcbiAgICAgICAgY3JlYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH0sXHJcbiAgICAgICAgdXBkYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgQ2VydGlmaWNhdGlvbiA9IG1vbmdvb3NlLm1vZGVscy5DZXJ0aWZpY2F0aW9uIHx8IG1vbmdvb3NlLm1vZGVsKCdDZXJ0aWZpY2F0aW9uJywgQ2VydGlmaWNhdGlvblNjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgU2tpbGxTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgaWNvbjogU3RyaW5nLFxyXG4gICAgICAgIGNhdGVnb3J5OiBTdHJpbmcsXHJcbiAgICAgICAgbGV2ZWw6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbJ0JlZ2lubmVyJywgJ0ludGVybWVkaWF0ZScsICdBZHZhbmNlZCcsICdFeHBlcnQnXSwgZGVmYXVsdDogJ0ludGVybWVkaWF0ZScgfSxcclxuICAgICAgICBwcm9qZWN0SWRzOiBbeyB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1Byb2plY3QnIH1dLFxyXG4gICAgICAgIGNlcnRJZHM6IFt7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnQ2VydGlmaWNhdGlvbicgfV1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgU2tpbGwgPSBtb25nb29zZS5tb2RlbHMuU2tpbGwgfHwgbW9uZ29vc2UubW9kZWwoJ1NraWxsJywgU2tpbGxTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IEFib3V0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgICAgbmFtZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiWW91ciBOYW1lXCIgfSxcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiRnVsbC1TdGFjayBEZXZlbG9wZXJcIiB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJZb3VyIExvY2F0aW9uXCIgfSxcclxuICAgICAgICBhYm91dENhcHRpb25GYWxsYmFja05hbWU6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIlwiIH0sXHJcbiAgICAgICAgY29udGVudDogU3RyaW5nLFxyXG4gICAgICAgIGF2YXRhcjogU3RyaW5nLFxyXG4gICAgICAgIG1pc3Npb246IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIkJ1aWxkaW5nIHNjYWxhYmxlIHByb2R1Y3RzIHRoYXQgYmxlbmQgdGVjaG5pY2FsIGV4Y2VsbGVuY2Ugd2l0aCBpbnR1aXRpdmUgZGVzaWduLlwiIH0sXHJcbiAgICAgICAgc3RhdHM6IFt7IGxhYmVsOiBTdHJpbmcsIHZhbHVlOiBTdHJpbmcgfV0sXHJcbiAgICAgICAgcGFzc2lvbnM6IFt7IGljb246IFN0cmluZywgbGFiZWw6IFN0cmluZyB9XSxcclxuICAgICAgICB0YWdzOiBbU3RyaW5nXSxcclxuICAgICAgICBjdGFUaXRsZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiTGV0J3MgQnVpbGQgU29tZXRoaW5nIEFtYXppbmdcIiB9LFxyXG4gICAgICAgIGN0YVN1YnRpdGxlOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJPcGVuIHRvIGNvbGxhYm9yYXRpb25zIGFuZCBuZXcgb3Bwb3J0dW5pdGllcy5cIiB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IEFib3V0ID0gbW9uZ29vc2UubW9kZWxzLkFib3V0IHx8IG1vbmdvb3NlLm1vZGVsKCdBYm91dCcsIEFib3V0U2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBTZXJ2aWNlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7IHRpdGxlOiBTdHJpbmcsIGRlc2NyaXB0aW9uOiBTdHJpbmcsIGljb246IFN0cmluZyB9KTtcclxuICAgIGNvbnN0IFNlcnZpY2UgPSBtb25nb29zZS5tb2RlbHMuU2VydmljZSB8fCBtb25nb29zZS5tb2RlbCgnU2VydmljZScsIFNlcnZpY2VTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IEhlcm9TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBncmVldGluZzogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHN1YnRpdGxlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgcmVzdW1lVXJsOiBTdHJpbmcsXHJcbiAgICAgICAgc29jaWFsTGlua3M6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxyXG4gICAgICAgIHVwZGF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IEhlcm8gPSBtb25nb29zZS5tb2RlbHMuSGVybyB8fCBtb25nb29zZS5tb2RlbCgnSGVybycsIEhlcm9TY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IEpvdXJuZXlTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgY29tcGFueTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgbG9jYXRpb246IFN0cmluZyxcclxuICAgICAgICB5ZWFyOiBTdHJpbmcsXHJcbiAgICAgICAgcGVyaW9kOiBTdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFN0cmluZyxcclxuICAgICAgICBhY2hpZXZlbWVudHM6IFtTdHJpbmddLFxyXG4gICAgICAgIHRlY2hub2xvZ2llczogW1N0cmluZ10sXHJcbiAgICAgICAgdHlwZTogeyB0eXBlOiBTdHJpbmcsIGVudW06IFsnd29yaycsICdlZHVjYXRpb24nLCAncHJvamVjdCddLCBkZWZhdWx0OiAnd29yaycgfSxcclxuICAgICAgICBpY29uOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJ0JyaWVmY2FzZScgfSxcclxuICAgICAgICBjb2xvcjogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcjMDZiNmQ0JyB9LFxyXG4gICAgICAgIG9yZGVyOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxyXG4gICAgICAgIHVwZGF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IEpvdXJuZXkgPSBtb25nb29zZS5tb2RlbHMuSm91cm5leSB8fCBtb25nb29zZS5tb2RlbCgnSm91cm5leScsIEpvdXJuZXlTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IENvbnRhY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgcGhvbmU6IFN0cmluZyxcclxuICAgICAgICBsb2NhdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIHdlYnNpdGU6IFN0cmluZyxcclxuICAgICAgICBsaW5rZWRpbjogU3RyaW5nLFxyXG4gICAgICAgIGdpdGh1YjogU3RyaW5nLFxyXG4gICAgICAgIHR3aXR0ZXI6IFN0cmluZyxcclxuICAgICAgICBpbnN0YWdyYW06IFN0cmluZyxcclxuICAgICAgICBmYWNlYm9vazogU3RyaW5nLFxyXG4gICAgICAgIHdoYXRzYXBwOiBTdHJpbmcsXHJcbiAgICAgICAgbWVzc2VuZ2VyOiBTdHJpbmcsXHJcbiAgICAgICAgaGlkZGVuU29jaWFsczogeyB0eXBlOiBbU3RyaW5nXSwgZGVmYXVsdDogW10gfSxcclxuICAgICAgICBjcmVhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfSxcclxuICAgICAgICB1cGRhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBDb250YWN0ID0gbW9uZ29vc2UubW9kZWxzLkNvbnRhY3QgfHwgbW9uZ29vc2UubW9kZWwoJ0NvbnRhY3QnLCBDb250YWN0U2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBDVlNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAgIHVybDogU3RyaW5nLFxyXG4gICAgICAgIGZpbGVuYW1lOiBTdHJpbmcsXHJcbiAgICB9LCB7IHRpbWVzdGFtcHM6IHRydWUgfSk7XHJcbiAgICBjb25zdCBDViA9IG1vbmdvb3NlLm1vZGVscy5DViB8fCBtb25nb29zZS5tb2RlbCgnQ1YnLCBDVlNjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgQ2F0ZWdvcnlTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICB0eXBlOiB7IHR5cGU6IFN0cmluZywgZW51bTogWydza2lsbCcsICdwcm9qZWN0JywgJ3NlcnZpY2UnXSwgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBjb2xvcjogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcjM2I4MmY2JyB9LFxyXG4gICAgICAgIGljb246IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnRm9sZGVyJyB9LFxyXG4gICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxyXG4gICAgICAgIHVwZGF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IENhdGVnb3J5ID0gbW9uZ29vc2UubW9kZWxzLkNhdGVnb3J5IHx8IG1vbmdvb3NlLm1vZGVsKCdDYXRlZ29yeScsIENhdGVnb3J5U2NoZW1hKTtcclxuXHJcbiAgICAvLyBDb250YWN0IE1lc3NhZ2VzIChmb3JtIHN1Ym1pc3Npb25zKVxyXG4gICAgY29uc3QgQ29udGFjdE1lc3NhZ2VTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgbWVzc2FnZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgcmVhZDogeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZSB9LFxyXG4gICAgICAgIHJlcGxpZWQ6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfSxcclxuICAgICAgICBjcmVhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBDb250YWN0TWVzc2FnZSA9IG1vbmdvb3NlLm1vZGVscy5Db250YWN0TWVzc2FnZSB8fCBtb25nb29zZS5tb2RlbCgnQ29udGFjdE1lc3NhZ2UnLCBDb250YWN0TWVzc2FnZVNjaGVtYSk7XHJcblxyXG4gICAgLy8gLS0tIFNlZWQgTG9naWMgLS0tXHJcbiAgICBjb25zdCBzZWVkRGVmYXVsdEhlcm8gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZXJvID0gYXdhaXQgSGVyby5maW5kT25lKCk7XHJcbiAgICAgICAgICAgIGlmICghZXhpc3RpbmdIZXJvKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBIZXJvLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JlZXRpbmc6IFwiSGVsbG8sIEknbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkpvaG4gRG9lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VidGl0bGU6IFwiQ3JlYXRpdmUgRGV2ZWxvcGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSSBidWlsZCBpbW1lcnNpdmUgd2ViIGV4cGVyaWVuY2VzIHdpdGggbW9kZXJuIHRlY2hub2xvZ2llcy5cIixcclxuICAgICAgICAgICAgICAgICAgICByZXN1bWVVcmw6IFwiL3Jlc3VtZS5wZGZcIixcclxuICAgICAgICAgICAgICAgICAgICBzb2NpYWxMaW5rczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnXHUyNzA1IENyZWF0ZWQgZGVmYXVsdCBIZXJvIGRhdGEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlZWRpbmcgSGVybyBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgc2VlZERlZmF1bHRIZXJvKCk7XHJcblxyXG4gICAgY29uc3Qgc2VlZERlZmF1bHRDYXRlZ29yaWVzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRDYXRlZ29yaWVzID0gW1xyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnRnJvbnRlbmQnLCB0eXBlOiAnc2tpbGwnLCBkZXNjcmlwdGlvbjogJ0Zyb250ZW5kIHRlY2hub2xvZ2llcycsIGNvbG9yOiAnIzNiODJmNicsIGljb246ICdNb25pdG9yJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnQmFja2VuZCcsIHR5cGU6ICdza2lsbCcsIGRlc2NyaXB0aW9uOiAnQmFja2VuZCB0ZWNobm9sb2dpZXMnLCBjb2xvcjogJyMxMGI5ODEnLCBpY29uOiAnU2VydmVyJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnTW9iaWxlJywgdHlwZTogJ3NraWxsJywgZGVzY3JpcHRpb246ICdNb2JpbGUgZGV2ZWxvcG1lbnQnLCBjb2xvcjogJyM4YjVjZjYnLCBpY29uOiAnU21hcnRwaG9uZScgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ1Rvb2xzJywgdHlwZTogJ3NraWxsJywgZGVzY3JpcHRpb246ICdEZXZPcHMgJiBUb29scycsIGNvbG9yOiAnI2Y1OWUwYicsIGljb246ICdXcmVuY2gnIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjYXQgb2YgZGVmYXVsdENhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgQ2F0ZWdvcnkuZmluZE9uZSh7IG5hbWU6IGNhdC5uYW1lLCB0eXBlOiBjYXQudHlwZSB9KTtcclxuICAgICAgICAgICAgICAgIGlmICghZXhpc3RpbmcpIGF3YWl0IENhdGVnb3J5LmNyZWF0ZShjYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VlZGluZyBjYXRlZ29yaWVzOicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgc2VlZERlZmF1bHRDYXRlZ29yaWVzKCk7XHJcblxyXG4gICAgLy8gLS0tIEFQSSBSb3V0ZXMgLS0tXHJcblxyXG4gICAgLy8gUHJvamVjdHNcclxuICAgIGFwcC5nZXQoJy9wcm9qZWN0cycsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0cyA9IGF3YWl0IFByb2plY3QuZmluZCgpLnNvcnQoeyBvcmRlcjogMSwgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBwcm9qZWN0cyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wb3N0KCcvcHJvamVjdHMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBhd2FpdCBQcm9qZWN0LmNvdW50RG9jdW1lbnRzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBhd2FpdCBQcm9qZWN0LmNyZWF0ZSh7IC4uLnJlcS5ib2R5LCBvcmRlcjogY291bnQgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcHJvamVjdCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wb3N0KCcvcHJvamVjdHMvcmVvcmRlcicsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGl0ZW1zIH0gPSByZXEuYm9keTsgLy8gQXJyYXkgb2YgeyBpZCwgb3JkZXIgfVxyXG4gICAgICAgICAgICBpZiAoIWl0ZW1zIHx8ICFBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSXRlbXMgYXJyYXkgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBidWxrT3BzID0gaXRlbXMubWFwKChpdGVtOiB7IGlkOiBzdHJpbmc7IG9yZGVyOiBudW1iZXIgfSkgPT4gKHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU9uZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogeyBfaWQ6IGl0ZW0uaWQgfSxcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IHsgJHNldDogeyBvcmRlcjogaXRlbS5vcmRlciB9IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgUHJvamVjdC5idWxrV3JpdGUoYnVsa09wcyk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ09yZGVyIHVwZGF0ZWQnIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnB1dCgnL3Byb2plY3RzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcclxuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSUQgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0ID0gYXdhaXQgUHJvamVjdC5maW5kQnlJZEFuZFVwZGF0ZShpZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHByb2plY3QgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZGVsZXRlKCcvcHJvamVjdHMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgICAgICAgICBhd2FpdCBQcm9qZWN0LmZpbmRCeUlkQW5kRGVsZXRlKGlkKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7fSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENlcnRpZmljYXRpb25zXHJcbiAgICBhcHAuZ2V0KCcvY2VydGlmaWNhdGlvbnMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2VydHMgPSBhd2FpdCBDZXJ0aWZpY2F0aW9uLmZpbmQoKS5zb3J0KHsgZGF0ZTogLTEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2VydHMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2NlcnRpZmljYXRpb25zJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlcnQgPSBhd2FpdCBDZXJ0aWZpY2F0aW9uLmNyZWF0ZShyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2VydCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wdXQoJy9jZXJ0aWZpY2F0aW9ucy86aWQnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2VydCA9IGF3YWl0IENlcnRpZmljYXRpb24uZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGNlcnQgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZGVsZXRlKCcvY2VydGlmaWNhdGlvbnMvOmlkJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENlcnRpZmljYXRpb24uZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToge30gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gU2tpbGxzXHJcbiAgICBhcHAuZ2V0KCcvc2tpbGxzJywgYXN5bmMgKHJlcSwgcmVzKSA9PiByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGF3YWl0IFNraWxsLmZpbmQoKS5wb3B1bGF0ZSgncHJvamVjdElkcycpLnBvcHVsYXRlKCdjZXJ0SWRzJykgfSkpO1xyXG4gICAgYXBwLnBvc3QoJy9za2lsbHMnLCBhc3luYyAocmVxLCByZXMpID0+IHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogYXdhaXQgbmV3IFNraWxsKHJlcS5ib2R5KS5zYXZlKCkgfSkpO1xyXG4gICAgYXBwLmRlbGV0ZSgnL3NraWxscy86aWQnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgICAgICBhd2FpdCBTa2lsbC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XHJcbiAgICB9KTtcclxuICAgIGFwcC5wdXQoJy9za2lsbHMvOmlkJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZFNraWxsID0gYXdhaXQgU2tpbGwuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pLnBvcHVsYXRlKCdwcm9qZWN0SWRzJykucG9wdWxhdGUoJ2NlcnRJZHMnKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB1cGRhdGVkU2tpbGwgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBYm91dFxyXG4gICAgYXBwLmdldCgnL2Fib3V0JywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGFib3V0ID0gYXdhaXQgQWJvdXQuZmluZE9uZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWFib3V0KSB7XHJcbiAgICAgICAgICAgICAgICBhYm91dCA9IGF3YWl0IEFib3V0LmNyZWF0ZSh7fSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaG9tZUluZm8gPSBhd2FpdCBIZXJvLmZpbmRPbmUoe30sIHsgdGl0bGU6IDEgfSkubGVhbigpO1xyXG4gICAgICAgICAgICBjb25zdCBob21lSW5mb05hbWUgPSBob21lSW5mbz8udGl0bGU/LnRyaW0oKSB8fCBcIlwiO1xyXG4gICAgICAgICAgICBjb25zdCBmYWxsYmFja0NhcHRpb25OYW1lID0gYWJvdXQuYWJvdXRDYXB0aW9uRmFsbGJhY2tOYW1lPy50cmltKCkgfHwgXCJcIjtcclxuICAgICAgICAgICAgY29uc3QgY2FwdGlvbk5hbWUgPSBob21lSW5mb05hbWUgfHwgZmFsbGJhY2tDYXB0aW9uTmFtZSB8fCBhYm91dC5uYW1lIHx8IFwiWW91ciBOYW1lXCI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uYWJvdXQudG9PYmplY3QoKSxcclxuICAgICAgICAgICAgICAgICAgICBjYXB0aW9uTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBob21lSW5mb05hbWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFwcC5wb3N0KCcvYWJvdXQnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgICAgICBjb25zdCBhYm91dCA9IGF3YWl0IEFib3V0LmZpbmRPbmVBbmRVcGRhdGUoe30sIHJlcS5ib2R5LCB7IHVwc2VydDogdHJ1ZSwgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogYWJvdXQgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXJ2aWNlc1xyXG4gICAgYXBwLmdldCgnL3NlcnZpY2VzJywgYXN5bmMgKHJlcSwgcmVzKSA9PiByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGF3YWl0IFNlcnZpY2UuZmluZCgpIH0pKTtcclxuICAgIGFwcC5wb3N0KCcvc2VydmljZXMnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gYXdhaXQgbmV3IFNlcnZpY2UocmVxLmJvZHkpLnNhdmUoKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBzZXJ2aWNlIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhcHAucHV0KCcvc2VydmljZXMvOmlkJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VydmljZSA9IGF3YWl0IFNlcnZpY2UuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHNlcnZpY2UgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFwcC5kZWxldGUoJy9zZXJ2aWNlcy86aWQnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBTZXJ2aWNlLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHt9IH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSGVyb1xyXG4gICAgYXBwLmdldCgnL2hlcm8nLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGVybyA9IGF3YWl0IEhlcm8uZmluZE9uZSgpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGhlcm8gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2hlcm8nLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGVybyA9IGF3YWl0IEhlcm8uZmluZE9uZUFuZFVwZGF0ZSh7fSwgcmVxLmJvZHksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogaGVybyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBKb3VybmV5XHJcbiAgICBhcHAuZ2V0KCcvam91cm5leScsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBqb3VybmV5SXRlbXMgPSBhd2FpdCBKb3VybmV5LmZpbmQoKS5zb3J0KHsgb3JkZXI6IDEsIHllYXI6IC0xLCBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGpvdXJuZXlJdGVtcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wb3N0KCcvam91cm5leScsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBBdXRvLWFzc2lnbiBvcmRlciB0byBiZSBsYXN0XHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gYXdhaXQgSm91cm5leS5jb3VudERvY3VtZW50cygpO1xyXG4gICAgICAgICAgICBjb25zdCBqb3VybmV5SXRlbSA9IGF3YWl0IEpvdXJuZXkuY3JlYXRlKHsgLi4ucmVxLmJvZHksIG9yZGVyOiByZXEuYm9keS5vcmRlciA/PyBjb3VudCB9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBqb3VybmV5SXRlbSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEJ1bGsgcmVvcmRlciBqb3VybmV5IGl0ZW1zIC0gTVVTVCBiZSBiZWZvcmUgOmlkIHJvdXRlcyFcclxuICAgIGFwcC5wb3N0KCcvam91cm5leS9yZW9yZGVyJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaXRlbXMgfSA9IHJlcS5ib2R5OyAvLyBBcnJheSBvZiB7IGlkLCBvcmRlciB9XHJcbiAgICAgICAgICAgIGlmICghaXRlbXMgfHwgIUFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdJdGVtcyBhcnJheSByZXF1aXJlZCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bGtPcHMgPSBpdGVtcy5tYXAoKGl0ZW06IHsgaWQ6IHN0cmluZzsgb3JkZXI6IG51bWJlciB9KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlT25lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB7IF9pZDogaXRlbS5pZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZTogeyAkc2V0OiB7IG9yZGVyOiBpdGVtLm9yZGVyIH0gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBKb3VybmV5LmJ1bGtXcml0ZShidWxrT3BzKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnT3JkZXIgdXBkYXRlZCcgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucHV0KCcvam91cm5leS86aWQnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgam91cm5leUl0ZW0gPSBhd2FpdCBKb3VybmV5LmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBqb3VybmV5SXRlbSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5kZWxldGUoJy9qb3VybmV5LzppZCcsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBKb3VybmV5LmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHt9IH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTGVnYWN5IGRlbGV0ZSByb3V0ZSAoa2VlcCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkpXHJcbiAgICBhcHAuZGVsZXRlKCcvam91cm5leScsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSByZXEucXVlcnk7XHJcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0lEIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgYXdhaXQgSm91cm5leS5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToge30gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gQ29udGFjdFxyXG4gICAgYXBwLmdldCgnL2NvbnRhY3QnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IGF3YWl0IENvbnRhY3QuZmluZE9uZSgpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGNvbnRhY3QgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2NvbnRhY3QnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IGF3YWl0IENvbnRhY3QuZmluZE9uZUFuZFVwZGF0ZSh7fSwgcmVxLmJvZHksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY29udGFjdCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENWXHJcbiAgICBhcHAuZ2V0KCcvY3YnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY3YgPSBhd2FpdCBDVi5maW5kT25lKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY3YgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2N2JywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENWLmRlbGV0ZU1hbnkoe30pO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdDViA9IG5ldyBDVihyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ld0NWLnNhdmUoKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBuZXdDViB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENWIERvd25sb2FkIFx1MjAxNCBzZXJ2ZXMgbG9jYWwgUERGIGZpbGVzIGRpcmVjdGx5LCBmYWxscyBiYWNrIHRvIENsb3VkaW5hcnkgc2lnbmVkIFVSTCBmb3IgbGVnYWN5IGVudHJpZXNcclxuICAgIGFwcC5nZXQoJy9jdi9kb3dubG9hZCcsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjdiA9IGF3YWl0IENWLmZpbmRPbmUoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICAgICAgaWYgKCFjdiB8fCAhY3YudXJsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBDViB1cGxvYWRlZCB5ZXQuJyB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSAoY3YuZmlsZW5hbWUgYXMgc3RyaW5nIHwgdW5kZWZpbmVkKSB8fCAncmVzdW1lLnBkZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGN2VXJsID0gY3YudXJsIGFzIHN0cmluZztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDVi9ET1dOTE9BRF0gdXJsOicsIGN2VXJsLCAnfCBmaWxlOicsIGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENhc2UgMTogTG9jYWwgZmlsZSBVUkwgKG5ldyBhcHByb2FjaCBcdTIwMTQgc3RvcmVkIGluIHVwbG9hZHMvY3YvIG9uIGRpc2spXHJcbiAgICAgICAgICAgIGlmIChjdlVybC5zdGFydHNXaXRoKCcvYXBpL2N2LWZpbGVzLycpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbEZpbGVuYW1lID0gY3ZVcmwucmVwbGFjZSgnL2FwaS9jdi1maWxlcy8nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndXBsb2FkcycsICdjdicsIGxvY2FsRmlsZW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0NWIGZpbGUgbm90IGZvdW5kIG9uIHNlcnZlci4nIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3BkZicpO1xyXG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsIGBhdHRhY2htZW50OyBmaWxlbmFtZT1cIiR7ZmlsZW5hbWV9XCJgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc2VuZEZpbGUoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDYXNlIDI6IExlZ2FjeSBDbG91ZGluYXJ5IFVSTCBcdTIwMTQgdHJ5IHNpZ25lZCBkZWxpdmVyeSByZWRpcmVjdFxyXG4gICAgICAgICAgICBjb25zdCB1cGxvYWRNYXRjaCA9IGN2VXJsLm1hdGNoKC9cXC91cGxvYWRcXC8oPzp2XFxkK1xcLyk/KC4rKSQvKTtcclxuICAgICAgICAgICAgaWYgKHVwbG9hZE1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHVwbG9hZE1hdGNoWzFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2lnbmVkRGVsaXZlcnlVcmwgPSBjbG91ZGluYXJ5LnVybChmdWxsUGF0aCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlX3R5cGU6ICdyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpZ25fdXJsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDVi9ET1dOTE9BRF0gTGVnYWN5IENsb3VkaW5hcnkgcmVkaXJlY3Q6Jywgc2lnbmVkRGVsaXZlcnlVcmwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdCgzMDIsIHNpZ25lZERlbGl2ZXJ5VXJsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2FzZSAzOiBFeHRlcm5hbCBVUkwgXHUyMDE0IHJlZGlyZWN0IGRpcmVjdGx5XHJcbiAgICAgICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoMzAyLCBjdlVybCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0NWL0RPV05MT0FEXSBFUlJPUjonLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBDViBEZWJ1ZyBcdTIwMTQgcmV0dXJucyBkaWFnbm9zdGljIEpTT04gKG9wZW4gdGhpcyBpbiB0aGUgYnJvd3NlciB0byBkaWFnbm9zZSlcclxuICAgIC8vIFZpc2l0OiBodHRwOi8vbG9jYWxob3N0OjUxNzMvYXBpL2N2L2RlYnVnXHJcbiAgICBhcHAuZ2V0KCcvY3YvZGVidWcnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY3YgPSBhd2FpdCBDVi5maW5kT25lKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIGlmICghY3YgfHwgIWN2LnVybCkgcmV0dXJuIHJlcy5qc29uKHsgZXJyb3I6ICdObyBDViBpbiBEQicgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjdlVybCA9IGN2LnVybCBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZE1hdGNoID0gY3ZVcmwubWF0Y2goL1xcL3VwbG9hZFxcLyg/OnZcXGQrXFwvKT8oLispJC8pO1xyXG4gICAgICAgICAgICBsZXQgZnVsbFBhdGggPSAnJywgc2lnbmVkRGVsaXZlcnlVcmwgPSAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGxvYWRNYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgZnVsbFBhdGggPSB1cGxvYWRNYXRjaFsxXTsgLy8gXCJwb3J0Zm9saW8vY3ZfMTIzX05BTUUucGRmXCJcclxuICAgICAgICAgICAgICAgIHNpZ25lZERlbGl2ZXJ5VXJsID0gY2xvdWRpbmFyeS51cmwoZnVsbFBhdGgsIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZV90eXBlOiAncmF3JyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndXBsb2FkJyxcclxuICAgICAgICAgICAgICAgICAgICBzaWduX3VybDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVGVzdCBIVFRQIHN0YXR1cyBvZiBib3RoIFVSTHNcclxuICAgICAgICAgICAgbGV0IGRpcmVjdFN0YXR1cyA9IDAsIHNpZ25lZFN0YXR1cyA9IDA7XHJcbiAgICAgICAgICAgIHRyeSB7IGRpcmVjdFN0YXR1cyA9IChhd2FpdCBmZXRjaChjdlVybCkpLnN0YXR1czsgfSBjYXRjaCAoZSkgeyBkaXJlY3RTdGF0dXMgPSAtMTsgfVxyXG4gICAgICAgICAgICB0cnkgeyBzaWduZWRTdGF0dXMgPSAoYXdhaXQgZmV0Y2goc2lnbmVkRGVsaXZlcnlVcmwpKS5zdGF0dXM7IH0gY2F0Y2ggKGUpIHsgc2lnbmVkU3RhdHVzID0gLTE7IH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzdG9yZWRVcmw6IGN2VXJsLFxyXG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IGN2LmZpbGVuYW1lLFxyXG4gICAgICAgICAgICAgICAgZXh0cmFjdGVkRnVsbFBhdGg6IGZ1bGxQYXRoLFxyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkU2lnbmVkRGVsaXZlcnlVcmw6IHNpZ25lZERlbGl2ZXJ5VXJsLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0VXJsU3RhdHVzOiBkaXJlY3RTdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBzaWduZWREZWxpdmVyeVVybFN0YXR1czogc2lnbmVkU3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgY2xvdWRpbmFyeUNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb3VkTmFtZTogcHJvY2Vzcy5lbnYuQ0xPVURJTkFSWV9DTE9VRF9OQU1FLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwaUtleVByZWZpeDogKHByb2Nlc3MuZW52LkNMT1VESU5BUllfQVBJX0tFWSB8fCAnJykuc3Vic3RyaW5nKDAsIDYpICsgJy4uLicsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBpU2VjcmV0U2V0OiAhIXByb2Nlc3MuZW52LkNMT1VESU5BUllfQVBJX1NFQ1JFVCxcclxuICAgICAgICAgICAgICAgICAgICBhcGlTZWNyZXRMZW5ndGg6IChwcm9jZXNzLmVudi5DTE9VRElOQVJZX0FQSV9TRUNSRVQgfHwgJycpLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDb250YWN0IE1lc3NhZ2VzIChmb3JtIHN1Ym1pc3Npb25zKVxyXG4gICAgYXBwLmdldCgnL21lc3NhZ2VzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgQ29udGFjdE1lc3NhZ2UuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG1lc3NhZ2VzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy9tZXNzYWdlcycsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgQ29udGFjdE1lc3NhZ2UuY3JlYXRlKHJlcS5ib2R5KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBtZXNzYWdlIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnB1dCgnL21lc3NhZ2VzLzppZCcsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgQ29udGFjdE1lc3NhZ2UuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZGVsZXRlKCcvbWVzc2FnZXMvOmlkJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENvbnRhY3RNZXNzYWdlLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHt9IH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2F0ZWdvcmllcyBSb3V0ZVxyXG4gICAgYXBwLmdldCgnL2NhdGVnb3JpZXMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSByZXEucXVlcnk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gdHlwZSA/IHsgdHlwZSB9IDoge307XHJcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBhd2FpdCBDYXRlZ29yeS5maW5kKHF1ZXJ5KS5zb3J0KHsgbmFtZTogMSB9KTtcclxuICAgICAgICAgICAgcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBjYXRlZ29yaWVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy9jYXRlZ29yaWVzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gYXdhaXQgQ2F0ZWdvcnkuY3JlYXRlKHJlcS5ib2R5KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBjYXRlZ29yeSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wdXQoJy9jYXRlZ29yaWVzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcclxuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSUQgcmVxdWlyZWQnIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBhd2FpdCBDYXRlZ29yeS5maW5kQnlJZEFuZFVwZGF0ZShpZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICBpZiAoIWNhdGVnb3J5KSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdDYXRlZ29yeSBub3QgZm91bmQnIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBjYXRlZ29yeSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5kZWxldGUoJy9jYXRlZ29yaWVzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcclxuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSUQgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICBhd2FpdCBDYXRlZ29yeS5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToge30gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDb25maWdcclxuICAgIGFwcC5nZXQoJy9jb25maWcnLCAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBjbG91ZGluYXJ5Q2xvdWROYW1lOiBwcm9jZXNzLmVudi5DTE9VRElOQVJZX0NMT1VEX05BTUUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAtLS0gQ0xPVURJTkFSWSBVUExPQUQgLS0tXHJcbiAgICBjbG91ZGluYXJ5LmNvbmZpZyh7XHJcbiAgICAgICAgY2xvdWRfbmFtZTogcHJvY2Vzcy5lbnYuQ0xPVURJTkFSWV9DTE9VRF9OQU1FLFxyXG4gICAgICAgIGFwaV9rZXk6IHByb2Nlc3MuZW52LkNMT1VESU5BUllfQVBJX0tFWSxcclxuICAgICAgICBhcGlfc2VjcmV0OiBwcm9jZXNzLmVudi5DTE9VRElOQVJZX0FQSV9TRUNSRVQsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzdG9yYWdlID0gbXVsdGVyLm1lbW9yeVN0b3JhZ2UoKTtcclxuICAgIGNvbnN0IHVwbG9hZE1pZGRsZXdhcmUgPSBtdWx0ZXIoe1xyXG4gICAgICAgIHN0b3JhZ2UsXHJcbiAgICAgICAgbGltaXRzOiB7IGZpbGVTaXplOiAxMDAgKiAxMDI0ICogMTAyNCB9IC8vIDEwME1CIChzdXBwb3J0cyB2aWRlbyB1cGxvYWRzKVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy91cGxvYWQnLCB1cGxvYWRNaWRkbGV3YXJlLmFycmF5KCdmaWxlcycsIDEwKSwgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIFZlcmlmeSBDbG91ZGluYXJ5IGNvbmZpZ1xyXG4gICAgICAgICAgICBpZiAoIXByb2Nlc3MuZW52LkNMT1VESU5BUllfQ0xPVURfTkFNRSB8fCAhcHJvY2Vzcy5lbnYuQ0xPVURJTkFSWV9BUElfS0VZIHx8ICFwcm9jZXNzLmVudi5DTE9VRElOQVJZX0FQSV9TRUNSRVQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nsb3VkaW5hcnkgY29uZmlndXJhdGlvbiBtaXNzaW5nIScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ0Nsb3VkaW5hcnkgbm90IGNvbmZpZ3VyZWQuIFBsZWFzZSBzZXQgQ0xPVURJTkFSWV9DTE9VRF9OQU1FLCBDTE9VRElOQVJZX0FQSV9LRVksIGFuZCBDTE9VRElOQVJZX0FQSV9TRUNSRVQgaW4gLmVudidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaWxlcyA9IHJlcS5maWxlcyBhcyBFeHByZXNzLk11bHRlci5GaWxlW107XHJcbiAgICAgICAgICAgIGlmICghZmlsZXMgfHwgZmlsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBmaWxlcyB1cGxvYWRlZCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBVcGxvYWRpbmcgJHtmaWxlcy5sZW5ndGh9IGZpbGUocykuLi5gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZFByb21pc2VzID0gZmlsZXMubWFwKGZpbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNQZGYgPSBmaWxlLm1pbWV0eXBlID09PSAnYXBwbGljYXRpb24vcGRmJyB8fCBmaWxlLm9yaWdpbmFsbmFtZS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKCcucGRmJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUERGczogc3RvcmUgbG9jYWxseSB0byBhdm9pZCBDbG91ZGluYXJ5IHJhdyBmaWxlIGFjY2VzcyByZXN0cmljdGlvbnMgKGFjY291bnQtbGV2ZWwgNDAxKVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzUGRmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPG9iamVjdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzYWZlRmlsZW5hbWUgPSBgY3ZfJHtEYXRlLm5vdygpfV8ke2ZpbGUub3JpZ2luYWxuYW1lLnJlcGxhY2UoL1teYS16QS1aMC05Ll8tXS9nLCAnXycpfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd1cGxvYWRzJywgJ2N2Jywgc2FmZUZpbGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKGRlc3RQYXRoLCBmaWxlLmJ1ZmZlciwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tVcGxvYWRdIEZhaWxlZCB0byBzYXZlIFBERiBsb2NhbGx5OicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVSTCB3aWxsIGJlIHNlcnZlZCBieSBFeHByZXNzIHN0YXRpYzogL2FwaS9jdi1maWxlcy88ZmlsZW5hbWU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gZGV2OiBodHRwOi8vbG9jYWxob3N0OjUxNzMvYXBpL2N2LWZpbGVzLzxmaWxlbmFtZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFVybCA9IGAvYXBpL2N2LWZpbGVzLyR7c2FmZUZpbGVuYW1lfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tVcGxvYWRdIFBERiBzYXZlZCBsb2NhbGx5OicsIGRlc3RQYXRoLCAnXHUyMTkyJywgbG9jYWxVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbE5hbWU6IGZpbGUub3JpZ2luYWxuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZS5vcmlnaW5hbG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogbG9jYWxVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IGZpbGUuc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VfdHlwZTogJ2xvY2FsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VzICYgVmlkZW9zOiB1cGxvYWQgdG8gQ2xvdWRpbmFyeSBhcyBiZWZvcmVcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWaWRlbyA9IGZpbGUubWltZXR5cGUuc3RhcnRzV2l0aCgndmlkZW8vJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBsb2FkU3RyZWFtID0gY2xvdWRpbmFyeS51cGxvYWRlci51cGxvYWRfc3RyZWFtKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZV90eXBlOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6ICdwb3J0Zm9saW8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMzAwMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uKGlzVmlkZW9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbGl0eTogJ2F1dG86bG93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bmtfc2l6ZTogNjAwMDAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YWxpdHk6IDY1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaF9mb3JtYXQ6ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE5MjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTA4MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JvcDogJ2xpbWl0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ2xvdWRpbmFyeSB1cGxvYWQgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGxvYWQgc3VjY2VzczonLCByZXN1bHQ/LnNlY3VyZV91cmwsIGAoJHtmaWxlLnNpemV9IFx1MjE5MiAke3Jlc3VsdD8uYnl0ZXN9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbE5hbWU6IGZpbGUub3JpZ2luYWxuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3VsdD8uc2VjdXJlX3VybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljSWQ6IHJlc3VsdD8ucHVibGljX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IHJlc3VsdD8uZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZV90eXBlOiByZXN1bHQ/LnJlc291cmNlX3R5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2l6ZTogZmlsZS5zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiByZXN1bHQ/LmJ5dGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmVzdWx0Py53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZXN1bHQ/LmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGUub3JpZ2luYWxuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhZGFibGUgPSBuZXcgUmVhZGFibGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZS5wdXNoKGZpbGUuYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZS5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlLnBpcGUodXBsb2FkU3RyZWFtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHVwbG9hZFByb21pc2VzKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHRzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVXBsb2FkIGVycm9yOicsIGVycm9yPy5tZXNzYWdlIHx8IGVycm9yKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3I/Lm1lc3NhZ2UgfHwgJ1VwbG9hZCBmYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IFN0cmluZyhlcnJvcikgOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGFwcDtcclxufVxyXG5cclxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFZlcmNlbCBTZXJ2ZXJsZXNzIEVudHJ5IFBvaW50IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxyXG4vLyBWZXJjZWwgQHZlcmNlbC9ub2RlIGNhbGxzIHRoZSBkZWZhdWx0IGV4cG9ydCBhcyBhIHJlcXVlc3QgaGFuZGxlci5cclxuLy8gU2luZ2xldG9uIHBhdHRlcm4ga2VlcHMgdGhlIE1vbmdvREIgY29ubmVjdGlvbiBhbGl2ZSBhY3Jvc3Mgd2FybSBpbnZvY2F0aW9ucy5cclxuLy8gV2UgbXVzdCBzdHJpcCB0aGUgL2FwaSBwcmVmaXggZnJvbSB0aGUgVVJMIGJlY2F1c2U6XHJcbi8vICAgLSBWZXJjZWwgcm91dGVzIC9hcGkvY29udGFjdCBcdTIxOTIgdGhpcyBoYW5kbGVyIHdpdGggdGhlIEZVTEwgdXJsIFwiL2FwaS9jb250YWN0XCJcclxuLy8gICAtIEV4cHJlc3Mgcm91dGVzIGFyZSByZWdpc3RlcmVkIHdpdGhvdXQgdGhlIHByZWZpeDogYXBwLmdldCgnL2NvbnRhY3QnLCAuLi4pXHJcbmxldCBfYXBwOiBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVBcGlTZXJ2ZXI+IHwgbnVsbCA9IG51bGw7XHJcbmZ1bmN0aW9uIGdldEFwcCgpIHtcclxuICAgIGlmICghX2FwcCkgX2FwcCA9IGNyZWF0ZUFwaVNlcnZlcigpO1xyXG4gICAgcmV0dXJuIF9hcHA7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UpIHtcclxuICAgIC8vIFN0cmlwIC9hcGkgcHJlZml4IHNvIEV4cHJlc3MgY2FuIG1hdGNoIGl0cyByb3V0ZXNcclxuICAgIGlmIChyZXEudXJsPy5zdGFydHNXaXRoKCcvYXBpLycpKSB7XHJcbiAgICAgICAgcmVxLnVybCA9IHJlcS51cmwuc2xpY2UoNCk7IC8vIFwiL2FwaS9jb250YWN0XCIgXHUyMTkyIFwiL2NvbnRhY3RcIlxyXG4gICAgfSBlbHNlIGlmIChyZXEudXJsID09PSAnL2FwaScpIHtcclxuICAgICAgICByZXEudXJsID0gJy8nO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdldEFwcCgpKHJlcSwgcmVzKTtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRYLE9BQU9BLFdBQVU7QUFDN1ksT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW1DOzs7QUNGc1UsT0FBTyxhQUFvQztBQUM3WixPQUFPLGNBQWM7QUFDckIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxNQUFNLGtCQUFrQjtBQUNq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QUFLLFFBQVE7QUFBQSxrQkFDYixVQUFVLFFBQVE7QUFBQSxrQkFDbEIsUUFBUSxRQUFRO0FBQUEsa0JBQ2hCLGVBQWUsUUFBUTtBQUFBLGtCQUN2QixjQUFjLEtBQUs7QUFBQSxrQkFDbkIsTUFBTSxRQUFRO0FBQUEsa0JBQ2QsT0FBTyxRQUFRO0FBQUEsa0JBQ2YsUUFBUSxRQUFRO0FBQUEsa0JBQ2hCLFVBQVUsS0FBSztBQUFBLGdCQUNuQixDQUFDO0FBQUEsY0FDTDtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBRUEsZ0JBQU0sV0FBVyxJQUFJLFNBQVM7QUFDOUIsbUJBQVMsS0FBSyxLQUFLLE1BQU07QUFDekIsbUJBQVMsS0FBSyxJQUFJO0FBQ2xCLG1CQUFTLEtBQUssWUFBWTtBQUFBLFFBQzlCLENBQUM7QUFBQSxNQUNMLENBQUM7QUFJRCxZQUFNLFVBQVUsTUFBTSxRQUFRLElBQUksY0FBYztBQUNoRCxVQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFBQSxJQUN6RCxTQUFTLE9BQVk7QUFDakIsY0FBUSxNQUFNLGlCQUFpQixPQUFPLFdBQVcsS0FBSztBQUN0RCxVQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUs7QUFBQSxRQUNqQixTQUFTO0FBQUEsUUFDVCxPQUFPLE9BQU8sV0FBVztBQUFBLFFBQ3pCLFNBQVMsUUFBUSxJQUFJLGFBQWEsZUFBZSxPQUFPLEtBQUssSUFBSTtBQUFBLE1BQ3JFLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSixDQUFDO0FBRUQsU0FBTztBQUNYOzs7QUQ3ekJBLElBQU0sbUNBQW1DO0FBS3pDLElBQU0sa0JBQWtCLE9BQU87QUFBQSxFQUM3QixNQUFNO0FBQUEsRUFDTixpQkFBaUIsQ0FBQyxXQUEwQjtBQUMxQyxVQUFNLE1BQU0sZ0JBQWdCO0FBQzVCLFdBQU8sWUFBWSxJQUFJLFFBQVEsR0FBRztBQUFBLEVBQ3BDO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUE7QUFBQSxFQUNSLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGdCQUFnQjtBQUFBLEVBQ2xCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLQyxNQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAicGF0aCJdCn0K
