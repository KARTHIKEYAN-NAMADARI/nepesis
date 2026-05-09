import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

// In-memory data store
const db = {
  users: [],
  workouts: {}, // key: userId, value: array of workouts
  hydration: {}, // key: userId, value: array of hydration logs
  meals: {}     // key: userId, value: array of meals
};

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };

    db.users.push(newUser);

    // Initialize user data arrays
    db.workouts[newUser.id] = [];
    db.hydration[newUser.id] = [];
    db.meals[newUser.id] = [];

    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

app.get('/api/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// --- DATA ENDPOINTS ---

app.get('/api/dashboard', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const workouts = db.workouts[userId] || [];
  const hydrationLogs = db.hydration[userId] || [];

  res.json({ workouts, hydrationLogs });
});

app.post('/api/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { workout, hydration } = req.body;

  if (!db.workouts[userId]) db.workouts[userId] = [];
  if (!db.hydration[userId]) db.hydration[userId] = [];

  if (workout) {
      db.workouts[userId].unshift(workout); // Add to beginning
  }
  if (hydration) {
      db.hydration[userId].unshift(hydration);
  }

  res.json({ success: true, workout, hydration });
});

app.get('/api/meals', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const meals = db.meals[userId] || [];
  res.json({ meals });
});

app.post('/api/meals', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const meal = req.body;

  if (!meal) return res.status(400).json({ error: 'Meal data required' });

  if (!db.meals[userId]) db.meals[userId] = [];

  // Ensure meal has an ID and timestamp if not provided
  const newMeal = {
      id: meal.id || Date.now().toString(),
      time: meal.time || new Date().toISOString(),
      name: meal.name,
      calories: Number(meal.calories),
      protein: Number(meal.protein),
      carbs: Number(meal.carbs),
      fat: Number(meal.fat),
      confidence: meal.confidence
  };

  db.meals[userId].unshift(newMeal);
  res.json({ success: true, meal: newMeal });
});

// --- AI ENDPOINTS ---
// Configure multer for memory storage (buffer)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze-food', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no API key is provided
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
        console.log("No Gemini API key found, returning mock analysis.");
        setTimeout(() => {
            const mockFoods = [
                { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 12, fat: 18 },
                { name: 'Avocado Toast with Egg', calories: 420, protein: 18, carbs: 35, fat: 24 },
                { name: 'Salmon Quinoa Bowl', calories: 550, protein: 42, carbs: 45, fat: 22 }
            ];
            const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
            res.json({
                ...randomFood,
                confidence: Math.floor(Math.random() * 15) + 85
            });
        }, 1500);
        return;
    }

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this image of food. Respond ONLY with a valid JSON object. Do not include markdown formatting or backticks.
    The JSON object must have exactly these keys:
    - "name": A descriptive name of the dish (string)
    - "calories": Estimated total calories (number)
    - "protein": Estimated protein in grams (number)
    - "carbs": Estimated carbohydrates in grams (number)
    - "fat": Estimated fat in grams (number)
    - "confidence": Your confidence in this analysis from 0 to 100 (number)

    Make the best possible estimate based on the visual portion size and ingredients.`;

    const imageParts = [
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    // Clean up potential markdown formatting from Gemini response
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }

    const parsedData = JSON.parse(cleanJson);
    res.json(parsedData);

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
