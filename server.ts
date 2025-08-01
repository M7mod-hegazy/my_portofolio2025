import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export function createApiServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- MongoDB Config ---
  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('MongoDB connected for local dev'))
    .catch(err => console.error('MongoDB connection error:', err));

  // --- Schemas & Models ---
  const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    technologies: [String],
    category: { type: String, required: true },
    liveUrl: String,
    githubUrl: String,
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

  const CertificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: String,
    credentialId: String,
    verificationUrl: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);



  const SkillSchema = new mongoose.Schema({
    name: String,
    icon: String,
    category: String,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
  });
  const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

  const AboutSchema = new mongoose.Schema({ content: String });
  const About = mongoose.models.About || mongoose.model('About', AboutSchema);

  const ServiceSchema = new mongoose.Schema({ title: String, description: String, icon: String });
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

  const JourneySchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    year: String,
    period: String,
    description: String,
    achievements: [String],
    technologies: [String],
    type: { type: String, enum: ['work', 'education', 'project'], default: 'work' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Journey = mongoose.models.Journey || mongoose.model('Journey', JourneySchema);

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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

  const CVSchema = new mongoose.Schema({
    url: String,
  }, { timestamps: true });
  const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);

  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['skill', 'project', 'service'], required: true },
    description: { type: String },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String, default: 'Folder' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  CategorySchema.index({ name: 1, type: 1 }, { unique: true });
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

  // --- Seed Default Categories ---
  const seedDefaultCategories = async () => {
    try {
      // Default skill categories
      const defaultSkillCategories = [
        { name: 'Frontend', type: 'skill', description: 'Frontend development technologies', color: '#3b82f6', icon: 'Monitor' },
        { name: 'Backend', type: 'skill', description: 'Backend development technologies', color: '#10b981', icon: 'Server' },
        { name: 'Database', type: 'skill', description: 'Database technologies', color: '#f59e0b', icon: 'Database' },
        { name: 'DevOps', type: 'skill', description: 'DevOps and deployment tools', color: '#ef4444', icon: 'Cloud' },
        { name: 'Mobile', type: 'skill', description: 'Mobile development technologies', color: '#8b5cf6', icon: 'Smartphone' }
      ];

      // Default project categories
      const defaultProjectCategories = [
        { name: 'Web Application', type: 'project', description: 'Full-stack web applications', color: '#3b82f6', icon: 'Globe' },
        { name: 'Mobile App', type: 'project', description: 'Mobile applications', color: '#10b981', icon: 'Smartphone' },
        { name: 'Desktop App', type: 'project', description: 'Desktop applications', color: '#f59e0b', icon: 'Monitor' },
        { name: 'API/Backend', type: 'project', description: 'APIs and backend services', color: '#ef4444', icon: 'Server' },
        { name: 'Library/Package', type: 'project', description: 'Libraries and packages', color: '#8b5cf6', icon: 'Package' },
        { name: 'Tool/Utility', type: 'project', description: 'Development tools and utilities', color: '#06b6d4', icon: 'Wrench' }
      ];

      // Insert default categories if they don't exist
      for (const category of [...defaultSkillCategories, ...defaultProjectCategories]) {
        const existing = await Category.findOne({ name: category.name, type: category.type });
        if (!existing) {
          await Category.create(category);
          console.log(`Created default ${category.type} category: ${category.name}`);
        }
      }
    } catch (error) {
      console.error('Error seeding default categories:', error);
    }
  };

  // Seed categories on startup
  seedDefaultCategories();

  // --- Seed Test Data ---
  const seedTestData = async () => {
    try {
      console.log('🌱 Seeding test data...');

      // Test Skills Data
      const testSkills = [
        { name: 'React', icon: 'SiReact', category: 'Frontend', level: 'Expert' },
        { name: 'Node.js', icon: 'SiNodedotjs', category: 'Backend', level: 'Advanced' },
        { name: 'MongoDB', icon: 'SiMongodb', category: 'Database', level: 'Advanced' },
        { name: 'TypeScript', icon: 'SiTypescript', category: 'Frontend', level: 'Expert' },
        { name: 'Python', icon: 'SiPython', category: 'Backend', level: 'Intermediate' },
        { name: 'Docker', icon: 'SiDocker', category: 'DevOps', level: 'Intermediate' },
        { name: 'React Native', icon: 'SiReact', category: 'Mobile', level: 'Advanced' },
        { name: 'PostgreSQL', icon: 'SiPostgresql', category: 'Database', level: 'Intermediate' },
        { name: 'AWS', icon: 'SiAmazonaws', category: 'DevOps', level: 'Intermediate' },
        { name: 'Vue.js', icon: 'SiVuedotjs', category: 'Frontend', level: 'Beginner' }
      ];

      for (const skill of testSkills) {
        const existing = await Skill.findOne({ name: skill.name });
        if (!existing) {
          await Skill.create(skill);
          console.log(`✅ Created skill: ${skill.name}`);
        }
      }

      // Test Projects Data
      const testProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce platform with React frontend, Node.js backend, and MongoDB database. Features include user authentication, product catalog, shopping cart, and payment integration.',
          images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'
          ],
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API'],
          category: 'Web Application',
          liveUrl: 'https://demo-ecommerce.vercel.app',
          githubUrl: 'https://github.com/username/ecommerce-platform',
          featured: true
        },
        {
          title: 'Task Management Mobile App',
          description: 'Cross-platform mobile app built with React Native for task and project management. Includes offline sync, push notifications, and team collaboration features.',
          images: [
            'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'
          ],
          technologies: ['React Native', 'Firebase', 'Redux', 'AsyncStorage'],
          category: 'Mobile App',
          liveUrl: 'https://play.google.com/store/apps/details?id=com.taskmanager',
          githubUrl: 'https://github.com/username/task-manager-app',
          featured: false
        },
        {
          title: 'REST API for Blog Platform',
          description: 'Scalable REST API built with Node.js and Express for a blog platform. Features JWT authentication, role-based access control, and comprehensive documentation.',
          images: [
            'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'
          ],
          technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
          category: 'API/Backend',
          githubUrl: 'https://github.com/username/blog-api',
          featured: false
        },
        {
          title: 'React Component Library',
          description: 'Reusable React component library with TypeScript support, Storybook documentation, and automated testing. Published on NPM with 1000+ weekly downloads.',
          images: [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
          ],
          technologies: ['React', 'TypeScript', 'Storybook', 'Jest', 'Rollup'],
          category: 'Library/Package',
          liveUrl: 'https://storybook-components.netlify.app',
          githubUrl: 'https://github.com/username/react-components',
          featured: true
        }
      ];

      for (const project of testProjects) {
        const existing = await Project.findOne({ title: project.title });
        if (!existing) {
          await Project.create(project);
          console.log(`✅ Created project: ${project.title}`);
        }
      }

      // Test Services Data
      const testServices = [
        {
          title: 'Full-Stack Web Development',
          description: 'Complete web application development from concept to deployment using modern technologies like React, Node.js, and cloud services.',
          icon: 'Globe'
        },
        {
          title: 'Mobile App Development',
          description: 'Cross-platform mobile application development using React Native and Flutter for iOS and Android platforms.',
          icon: 'Smartphone'
        },
        {
          title: 'API Development & Integration',
          description: 'RESTful API development, third-party integrations, and microservices architecture design and implementation.',
          icon: 'Server'
        },
        {
          title: 'UI/UX Design & Consultation',
          description: 'User interface design, user experience optimization, and design system creation for web and mobile applications.',
          icon: 'Palette'
        }
      ];

      for (const service of testServices) {
        const existing = await Service.findOne({ title: service.title });
        if (!existing) {
          await Service.create(service);
          console.log(`✅ Created service: ${service.title}`);
        }
      }

      // Test Certifications Data
      const testCertifications = [
        {
          title: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023-08-15',
          credentialId: 'AWS-SAA-2023-001',
          verificationUrl: 'https://aws.amazon.com/verification/AWS-SAA-2023-001',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
        },
        {
          title: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          date: '2023-06-20',
          credentialId: 'GCP-PD-2023-002',
          verificationUrl: 'https://cloud.google.com/certification/verify/GCP-PD-2023-002',
          image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'
        },
        {
          title: 'Meta React Developer Certificate',
          issuer: 'Meta (Facebook)',
          date: '2023-04-10',
          credentialId: 'META-REACT-2023-003',
          verificationUrl: 'https://coursera.org/verify/META-REACT-2023-003',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
        }
      ];

      for (const cert of testCertifications) {
        const existing = await Certification.findOne({ title: cert.title });
        if (!existing) {
          await Certification.create(cert);
          console.log(`✅ Created certification: ${cert.title}`);
        }
      }

      // Test Journey Items Data
      const testJourneyItems = [
        {
          title: 'Senior Full-Stack Developer',
          company: 'TechCorp Solutions',
          location: 'San Francisco, CA',
          year: '2022',
          period: '2022 - Present',
          description: 'Leading development of enterprise web applications using React, Node.js, and AWS. Managing a team of 5 developers and architecting scalable solutions.',
          achievements: [
            'Increased application performance by 40%',
            'Led migration to microservices architecture',
            'Mentored 3 junior developers'
          ],
          technologies: ['React', 'Node.js', 'AWS', 'MongoDB', 'Docker'],
          type: 'work'
        },
        {
          title: 'Full-Stack Developer',
          company: 'StartupXYZ',
          location: 'New York, NY',
          year: '2020',
          period: '2020 - 2022',
          description: 'Developed and maintained multiple client projects using modern web technologies. Collaborated with design and product teams to deliver high-quality solutions.',
          achievements: [
            'Built 15+ client projects from scratch',
            'Implemented CI/CD pipelines',
            'Reduced deployment time by 60%'
          ],
          technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
          type: 'work'
        },
        {
          title: 'Computer Science Degree',
          company: 'University of Technology',
          location: 'Boston, MA',
          year: '2020',
          period: '2016 - 2020',
          description: 'Bachelor of Science in Computer Science with focus on software engineering and web development. Graduated Magna Cum Laude.',
          achievements: [
            'GPA: 3.8/4.0',
            'Dean\'s List for 6 semesters',
            'Led university coding bootcamp'
          ],
          technologies: ['Java', 'Python', 'C++', 'SQL'],
          type: 'education'
        }
      ];

      for (const journey of testJourneyItems) {
        const existing = await Journey.findOne({ title: journey.title, company: journey.company });
        if (!existing) {
          await Journey.create(journey);
          console.log(`✅ Created journey item: ${journey.title} at ${journey.company}`);
        }
      }

      // Test About Content
      const testAboutContent = {
        content: `I'm a passionate Full-Stack Developer with over 4 years of experience building modern web applications and mobile apps. I specialize in React, Node.js, and cloud technologies, with a strong focus on creating scalable and user-friendly solutions.

My journey in software development started during my Computer Science studies, where I discovered my love for problem-solving and creating digital experiences. Since then, I've worked with startups and established companies, helping them bring their ideas to life through code.

I believe in continuous learning and staying up-to-date with the latest technologies. When I'm not coding, you can find me contributing to open-source projects, writing technical blogs, or exploring new frameworks and tools.

Let's build something amazing together!`
      };

      const existingAbout = await About.findOne();
      if (!existingAbout) {
        await About.create(testAboutContent);
        console.log(`✅ Created about content`);
      }

      // Test Contact Information
      const testContactInfo = {
        email: 'john.developer@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA, USA',
        website: 'https://johndeveloper.com',
        linkedin: 'https://linkedin.com/in/johndeveloper',
        github: 'https://github.com/johndeveloper',
        twitter: 'https://twitter.com/johndeveloper',
        instagram: 'https://instagram.com/johndeveloper',
        facebook: 'https://facebook.com/johndeveloper',
        whatsapp: '+15551234567',
        messenger: 'https://m.me/johndeveloper'
      };

      const existingContact = await Contact.findOne();
      if (!existingContact) {
        await Contact.create(testContactInfo);
        console.log(`✅ Created contact information`);
      } else {
        // Update existing contact with new fields if they don't exist
        const updateFields = {};
        if (!existingContact.facebook) updateFields.facebook = testContactInfo.facebook;
        if (!existingContact.whatsapp) updateFields.whatsapp = testContactInfo.whatsapp;
        if (!existingContact.messenger) updateFields.messenger = testContactInfo.messenger;

        if (Object.keys(updateFields).length > 0) {
          await Contact.findByIdAndUpdate(existingContact._id, updateFields);
          console.log(`✅ Updated contact information with new social fields`);
        }
      }

      console.log('🎉 Test data seeding completed!');
    } catch (error) {
      console.error('❌ Error seeding test data:', error);
    }
  };

  // Seed test data on startup (only in development)
  if (process.env.NODE_ENV !== 'production') {
    seedTestData();
  }

  // --- API Routes ---
  app.get('/projects', async (req: Request, res: Response) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.post('/projects', async (req: Request, res: Response) => {
    try {
      const { title, description, images, technologies, category, liveUrl, githubUrl, featured } = req.body;

      const project = await Project.create({
        title,
        description,
        images: images || [],
        technologies: technologies || [],
        category,
        liveUrl,
        githubUrl,
        featured: featured || false
      });

      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.put('/projects', async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
      }

      const { title, description, images, technologies, category, liveUrl, githubUrl, featured } = req.body;
      const project = await Project.findByIdAndUpdate(
        id,
        {
          title,
          description,
          images,
          technologies,
          category,
          liveUrl,
          githubUrl,
          featured,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.delete('/projects', async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
      }

      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.get('/certifications', async (req: Request, res: Response) => {
    try {
      const certifications = await Certification.find();
      res.status(200).json({ success: true, data: certifications });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });







  // --- Journey Routes ---
  app.get('/journey', async (req: Request, res: Response) => {
    try {
      const journeyItems = await Journey.find().sort({ year: -1, createdAt: -1 });
      res.status(200).json({ success: true, data: journeyItems });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.post('/journey', async (req: Request, res: Response) => {
    try {
      const { title, company, location, year, period, description, achievements, technologies, type } = req.body;

      const journeyItem = await Journey.create({
        title,
        company,
        location,
        year,
        period,
        description,
        achievements: achievements || [],
        technologies: technologies || [],
        type: type || 'work'
      });

      res.status(201).json({ success: true, data: journeyItem });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.put('/journey', async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Journey item ID is required' });
      }

      const { title, company, location, year, period, description, achievements, technologies, type } = req.body;
      const journeyItem = await Journey.findByIdAndUpdate(
        id,
        {
          title,
          company,
          location,
          year,
          period,
          description,
          achievements,
          technologies,
          type,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!journeyItem) {
        return res.status(404).json({ success: false, error: 'Journey item not found' });
      }

      res.status(200).json({ success: true, data: journeyItem });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.delete('/journey', async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Journey item ID is required' });
      }

      const journeyItem = await Journey.findByIdAndDelete(id);
      if (!journeyItem) {
        return res.status(404).json({ success: false, error: 'Journey item not found' });
      }

      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // --- Contact Routes ---
  app.get('/contact', async (req: Request, res: Response) => {
    try {
      const contact = await Contact.findOne();
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.post('/contact', async (req: Request, res: Response) => {
    try {
      const { email, phone, location, website, linkedin, github, twitter, instagram, facebook, whatsapp, messenger } = req.body;

      // Update or create contact info (there should only be one)
      const contact = await Contact.findOneAndUpdate(
        {},
        {
          email,
          phone,
          location,
          website,
          linkedin,
          github,
          twitter,
          instagram,
          facebook,
          whatsapp,
          messenger,
          updatedAt: new Date()
        },
        { new: true, upsert: true, runValidators: true }
      );

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // --- CV Routes ---
  app.get('/cv', async (req: Request, res: Response) => {
    try {
      const cv = await CV.findOne().sort({ createdAt: -1 }); // Get the latest CV
      res.status(200).json({ success: true, data: cv });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.post('/cv', async (req: Request, res: Response) => {
    try {
      await CV.deleteMany({}); // Remove old CVs
      const newCV = new CV(req.body);
      await newCV.save();
      res.status(201).json({ success: true, data: newCV });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // --- New Section Routes ---
  // Skills
  app.get('/skills', async (req, res) => res.json({ success: true, data: await Skill.find() }));
  app.post('/skills', async (req, res) => res.status(201).json({ success: true, data: await new Skill(req.body).save() }));
  app.delete('/skills/:id', async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
  app.put('/skills/:id', async (req, res) => {
    try {
      const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: updatedSkill });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // About
  app.get('/about', async (req, res) => res.json({ success: true, data: await About.findOne() }));
  app.post('/about', async (req, res) => {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: about });
  });

  // Services
  app.get('/services', async (req, res) => res.json({ success: true, data: await Service.find() }));
  app.post('/services', async (req, res) => {
    // This will update a service if an _id is provided, or create a new one.
    const { _id, ...data } = req.body;
    const service = _id
      ? await Service.findByIdAndUpdate(_id, data, { new: true })
      : await new Service(data).save();
    res.json({ success: true, data: service });
  });

  // Categories
  app.get('/categories', async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      let query = {};
      if (type) {
        query = { type };
      }
      const categories = await Category.find(query).sort({ name: 1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.post('/categories', async (req: Request, res: Response) => {
    try {
      const { name, type, description, color, icon } = req.body;

      // Check if category already exists for this type
      const existingCategory = await Category.findOne({ name, type: type || 'skill' });
      if (existingCategory) {
        return res.status(400).json({ success: false, error: `Category '${name}' already exists for type '${type || 'skill'}'` });
      }

      const category = await Category.create({
        name,
        type: type || 'skill',
        description,
        color,
        icon
      });

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  app.delete('/categories', async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Category ID is required' });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }

      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // --- Config Route ---
  app.get('/config', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      },
    });
  });

  return app;
} 