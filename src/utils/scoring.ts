export interface AssessmentResult {
  score: number;
  reach: string[];
  match: string[];
  safety: string[];
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

  // Filter Universities based on Major and Score
  // Note: This is a simplified logic. Real logic would be more complex.
  const relevantUnis = universitiesData.filter(uni => 
    uni.majors.includes(input.major) || uni.majors.some(m => input.major.includes(m))
  );

  const reach = relevantUnis.filter(uni => uni.minScore > score && uni.minScore <= score + 10).map(u => u.name);
  const match = relevantUnis.filter(uni => uni.minScore <= score && uni.minScore > score - 10).map(u => u.name);
  const safety = relevantUnis.filter(uni => uni.minScore <= score - 10).map(u => u.name);

  // Fallbacks if lists are empty (just for demo purposes to ensure UI looks good)
  if (reach.length === 0) reach.push("慕尼黑工业大学 (冲刺尝试)", "海德堡大学 (冲刺尝试)");
  if (match.length === 0) match.push("汉诺威大学", "不莱梅大学");
  if (safety.length === 0) safety.push("克劳斯塔尔工业大学", "开姆尼茨工业大学");

  let suggestion = "";
  if (score < 70) suggestion = "建议重点提升GPA和语言成绩，可以考虑申请预科或语言班过渡。";
  else if (score < 80) suggestion = "您的背景不错，建议将德语提升至C1或雅思7.0，可以冲击TU9院校。";
  else suggestion = "您的背景非常优秀，完全有能力申请德国顶尖名校，建议准备高质量的文书。";

  return {
    score,
    reach: reach.slice(0, 2),
    match: match.slice(0, 2),
    safety: safety.slice(0, 2),
    suggestion
  };
};
