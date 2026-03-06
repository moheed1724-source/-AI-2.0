export interface AssessmentResult {
  score: number;
  predictions: {
    name: string;
    probability: number;
    type: 'reach' | 'match' | 'safety';
  }[];
  suggestion: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number;
  language: 'german_c1' | 'german_b2' | 'german_b1' | 'ielts_7' | 'ielts_6.5' | 'other';
  major: string;
  background: '985' | '211' | 'tier1' | 'tier2';
  city: string;
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  let score = 0;

  // 1. GPA Scoring
  if (input.gpa >= 90) score += 40;
  else if (input.gpa >= 85) score += 35;
  else if (input.gpa >= 80) score += 30;
  else if (input.gpa >= 75) score += 25;
  else score += 10; // Base score for lower GPA

  // 2. Language Scoring
  switch (input.language) {
    case 'german_c1': score += 25; break;
    case 'german_b2': score += 20; break;
    case 'german_b1': score += 15; break;
    case 'ielts_7': score += 20; break;
    case 'ielts_6.5': score += 18; break;
    default: score += 5; break;
  }

  // 3. Background Scoring
  switch (input.background) {
    case '985': score += 20; break;
    case '211': score += 18; break;
    case 'tier1': score += 15; break;
    case 'tier2': score += 12; break;
  }

  // Bonus for matching city preference (slight adjustment to score context if needed, but keeping simple for now)

  // Filter Universities based on Major
  const relevantUnis = universitiesData.filter(uni => 
    uni.majors.includes(input.major) || uni.majors.some(m => input.major.includes(m))
  );

  // Generate Predictions
  const predictions = relevantUnis.map(uni => {
    // Calculate probability based on score difference
    // If score == minScore, prob is 50%
    // If score > minScore, prob increases
    // If score < minScore, prob decreases
    let diff = score - uni.minScore;
    let prob = 50 + (diff * 2); 
    
    // Cap probability
    if (prob > 95) prob = 95;
    if (prob < 10) prob = 10;

    let type: 'reach' | 'match' | 'safety';
    if (prob < 40) type = 'reach';
    else if (prob < 75) type = 'match';
    else type = 'safety';

    return {
      name: uni.name,
      probability: prob,
      type
    };
  }).sort((a, b) => b.probability - a.probability); // Sort by probability descending? Or maybe group by type.

  // Select a mix for display
  const displayPredictions = [
    ...predictions.filter(p => p.type === 'reach').slice(0, 2),
    ...predictions.filter(p => p.type === 'match').slice(0, 2),
    ...predictions.filter(p => p.type === 'safety').slice(0, 2)
  ];
  
  // If we don't have enough, fill with some defaults just for demo robustness
  if (displayPredictions.length < 3) {
     if (!displayPredictions.some(p => p.name.includes("慕尼黑"))) 
        displayPredictions.push({ name: "慕尼黑工业大学", probability: 35, type: 'reach' });
     if (!displayPredictions.some(p => p.name.includes("亚琛"))) 
        displayPredictions.push({ name: "亚琛工业大学", probability: 45, type: 'match' });
  }

  let suggestion = "";
  if (score < 70) suggestion = "建议重点提升GPA和语言成绩，可以考虑申请预科或语言班过渡。";
  else if (score < 80) suggestion = "您的背景不错，建议将德语提升至C1或雅思7.0，可以冲击TU9院校。";
  else suggestion = "您的背景非常优秀，完全有能力申请德国顶尖名校，建议准备高质量的文书以突出科研经历。";

  return {
    score,
    predictions: displayPredictions.sort((a, b) => a.probability - b.probability), // Sort low to high for display usually? Or high to low. Let's do by type in UI.
    suggestion
  };
};
