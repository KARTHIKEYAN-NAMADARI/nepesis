import React, { useState, useMemo } from 'react';
import FoodRecognition from '../components/FoodRecognition';
import './FoodAIPage.css';

const FoodAIPage = () => {
  const [meals, setMeals] = useState([]);

  const handleLogMeal = (meal) => {
    setMeals(prev => [meal, ...prev]);
  };

  const dailyTotals = useMemo(() => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  return (
    <div className="food-ai-page">
      <header className="page-header">
        <h2>AI Nutrition Tracker</h2>
        <p>Snap a photo of your food, and our AI will estimate the calories and macros automatically.</p>
      </header>

      <div className="food-ai-content">
        <div className="main-column">
          <FoodRecognition onLogMeal={handleLogMeal} />

          <div className="how-it-works">
            <h3>How it works</h3>
            <ol>
              <li>Upload or take a clear photo of your meal.</li>
              <li>Wait a few seconds while our AI analyzes the ingredients.</li>
              <li>Review the detected food and estimated nutrition values.</li>
              <li>Edit any details if needed, then save to your daily log.</li>
            </ol>
          </div>
        </div>

        <div className="sidebar">
          <div className="daily-totals">
            <h3>Today's Totals</h3>
            <div className="totals-grid">
              <div className="total-item">
                <span className="value">{dailyTotals.calories}</span>
                <span className="label">kcal</span>
              </div>
              <div className="total-item">
                <span className="value">{dailyTotals.protein}g</span>
                <span className="label">Protein</span>
              </div>
              <div className="total-item">
                <span className="value">{dailyTotals.carbs}g</span>
                <span className="label">Carbs</span>
              </div>
              <div className="total-item">
                <span className="value">{dailyTotals.fat}g</span>
                <span className="label">Fat</span>
              </div>
            </div>
          </div>

          <div className="meal-history">
            <h3>Meal History</h3>
            {meals.length === 0 ? (
              <p className="empty-state">No meals logged today. Snap a photo to get started!</p>
            ) : (
              <div className="meal-list">
                {meals.map(meal => (
                  <div key={meal.id} className="meal-item">
                    <div className="meal-info">
                      <h4>{meal.name}</h4>
                      <span className="meal-time">
                        {meal.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="meal-macros">
                      <span className="kcal">{meal.calories} kcal</span>
                      <span className="macros-detail">
                        {meal.protein}P • {meal.carbs}C • {meal.fat}F
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAIPage;
