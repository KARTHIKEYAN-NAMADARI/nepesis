import React, { useState, useRef } from 'react';
import './FoodRecognition.css';

const MOCK_FOOD_CATALOG = [
  { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 12, fat: 18 },
  { name: 'Avocado Toast with Egg', calories: 420, protein: 18, carbs: 35, fat: 24 },
  { name: 'Salmon Quinoa Bowl', calories: 550, protein: 42, carbs: 45, fat: 22 },
  { name: 'Berry Smoothie Bowl', calories: 320, protein: 10, carbs: 55, fat: 8 },
  { name: 'Oatmeal with Nuts', calories: 380, protein: 12, carbs: 50, fat: 15 }
];

const FoodRecognition = ({ onLogMeal }) => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, detected, failed, logging
  const [result, setResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setStatus('analyzing');
    setResult(null);
    setIsEditing(false);

    // Simulate AI processing delay
    setTimeout(() => {
      const randomFood = MOCK_FOOD_CATALOG[Math.floor(Math.random() * MOCK_FOOD_CATALOG.length)];
      const mockResult = {
        ...randomFood,
        confidence: Math.floor(Math.random() * 15) + 85 // 85-99%
      };

      setResult(mockResult);
      setEditForm(mockResult);
      setStatus('detected');
    }, 2000);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSaveAndLog = () => {
    setStatus('logging');
    setTimeout(() => {
      const finalMeal = {
        id: Date.now().toString(),
        time: new Date(),
        ...editForm
      };
      if (onLogMeal) {
        onLogMeal(finalMeal);
      }
      // Reset after logging
      setImage(null);
      setResult(null);
      setStatus('idle');
    }, 800);
  };

  return (
    <div className="food-recognition">
      <div className="upload-section">
        {!image ? (
          <div
            className="upload-placeholder"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">📸</span>
            <p>Tap to upload a meal photo</p>
          </div>
        ) : (
          <div className="image-preview">
            <img src={image} alt="Meal preview" />
            {status === 'idle' && (
              <button
                className="reupload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Retake Photo
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      <div className="analysis-section">
        {status === 'analyzing' && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>AI is analyzing your meal...</p>
          </div>
        )}

        {status === 'detected' && result && (
          <div className="result-card">
            <div className="result-header">
              <h3>Detected: {result.name}</h3>
              <span className="confidence">{result.confidence}% Match</span>
            </div>

            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
                <div className="macro-inputs">
                  <label>Calories: <input type="number" name="calories" value={editForm.calories} onChange={handleEditChange} /></label>
                  <label>Protein: <input type="number" name="protein" value={editForm.protein} onChange={handleEditChange} /></label>
                  <label>Carbs: <input type="number" name="carbs" value={editForm.carbs} onChange={handleEditChange} /></label>
                  <label>Fat: <input type="number" name="fat" value={editForm.fat} onChange={handleEditChange} /></label>
                </div>
                <div className="action-buttons">
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  <button onClick={handleSaveAndLog} className="log-btn">Save & Log</button>
                </div>
              </div>
            ) : (
              <div className="nutrition-summary">
                <div className="macro">
                  <span className="value">{result.calories}</span>
                  <span className="label">kcal</span>
                </div>
                <div className="macro">
                  <span className="value">{result.protein}g</span>
                  <span className="label">Protein</span>
                </div>
                <div className="macro">
                  <span className="value">{result.carbs}g</span>
                  <span className="label">Carbs</span>
                </div>
                <div className="macro">
                  <span className="value">{result.fat}g</span>
                  <span className="label">Fat</span>
                </div>
                <div className="action-buttons">
                  <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Details</button>
                  <button onClick={handleSaveAndLog} className="log-btn">Log Meal</button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'logging' && (
          <div className="success-message">
            <p>✅ Meal logged successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodRecognition;
