import React, { useState, useRef } from 'react';
import './FoodRecognition.css';

const FoodRecognition = ({ onLogMeal }) => {
  const [image, setImage] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, detected, failed, logging
  const [result, setResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file) => {
    setStatus('analyzing');
    setResult(null);
    setIsEditing(false);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const token = localStorage.getItem('smart_health_token');
        const response = await fetch('/api/analyze-food', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Analysis failed');

        const data = await response.json();
        setResult(data);
        setEditForm(data);
        setStatus('detected');
    } catch (error) {
        console.error('Error analyzing image:', error);
        setStatus('failed');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSaveAndLog = async () => {
    setStatus('logging');
    try {
        const token = localStorage.getItem('smart_health_token');
        const finalMeal = { ...editForm };

        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(finalMeal)
        });

        if (response.ok) {
            const data = await response.json();
            if (onLogMeal) {
                onLogMeal(data.meal);
            }
            setImage(null);
            setFileToUpload(null);
            setResult(null);
            setStatus('idle');
        }
    } catch (error) {
        console.error('Failed to log meal:', error);
        setStatus('detected'); // revert status on error
    }
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

        {status === 'failed' && (
          <div className="error-message">
             <p>Analysis failed. Please try again.</p>
             <button onClick={() => setStatus('idle')} className="cancel-btn">Back</button>
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
