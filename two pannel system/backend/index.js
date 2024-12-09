import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Admin from './db/admin.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory name (workaround for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use absolute path for serving static files
app.use('/uploads', express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
});

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect('url');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
connectDB();

// Routes
// Create Admin
app.post('/adminpanel', upload.single('photo'), async (req, res) => {
  try {
    const { name, profession } = req.body;
    const photo = req.file;

    if (!photo) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    // Create relative path for storing in database
    const relativePath = path.relative(__dirname, photo.path).replace(/\\/g, '/');

    const newAdmin = new Admin({
      name,
      profession,
      photo: {
        path: `uploads/${path.basename(photo.path)}`,
        fileName: photo.originalname
      }
    });

    await newAdmin.save();

    res.status(201).json({ 
      message: 'Admin created successfully', 
      admin: newAdmin 
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Get All Admins
app.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
});




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong', 
    error: err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
