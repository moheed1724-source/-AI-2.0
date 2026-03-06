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

  // 1. 严格的 GPA 计分体系
  if (input.gpa >= 90) score += 40;
  else if (input.gpa >= 85) score += 32;
  else if (input.gpa >= 80) score += 25;
  else if (input.gpa >= 75) score += 18;
  else if (input.gpa >= 70) score += 10;
  else score += 5;

  // 2. 语言能力换算体系
  const langScores: Record<string, number> = {
    'german_c1': 30, 'ielts_7': 28,
    'german_b2': 20, 'ielts_6.5': 18,
    'german_b1': 10, 'other': 0
  };
  score += langScores[input.language] || 0;

  // 3. 院校背景加成
  const bgScores: Record<string, number> = {
    '985': 20, '211': 18, 'tier1': 12, 'tier2': 8
  };
  score += bgScores[input.background] || 0;

  // ================= 智能过滤与匹配逻辑 =================

  // 1. 先筛选出包含该专业的学校
  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));

  // 如果实在没有该专业的学校（做个保底防崩溃）
  if (relevantUnis.length === 0) {
    relevantUnis = universitiesData.slice(0, 5); 
  }

  // 2. 模拟真正的申请概率计算
  const predictions = relevantUnis.map(uni => {
    let prob = 50; // 基础概率
    
    // GPA 差距影响
    let gpaDiff = input.gpa - uni.minGpa;
    prob += gpaDiff * 3; // 差1分影响3%概率

    // 语言是否达标影响
    if (uni.minLang === 'german_c1' && !['german_c1', 'ielts_7'].includes(input.language)) prob -= 25;
    if (uni.minLang === 'german_b2' && input.language === 'german_b1') prob -= 15;
    if (input.language === 'other') prob -= 40;

    // 背景加成
    if (uni.tier === 'S' && ['tier1', 'tier2'].includes(input.background)) prob -= 15;

    // 城市偏好加分
    if (input.city !== '不限' && uni.name.includes(input.city)) prob += 10;

    // 规范概率范围
    prob = Math.max(5, Math.min(98, prob)); // 限制在 5% - 98% 之间

    let type: 'reach' | 'match' | 'safety';
    if (prob < 40) type = 'reach'; // 冲刺
    else if (prob < 75) type = 'match'; // 匹配
    else type = 'safety'; // 保底

    return { name: uni.name, probability: Math.round(prob), type };
  });

  // 3. 智能挑选 3-4 所代表性学校展示给用户
  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  
  // 尽量挑一个冲刺、一个匹配、一个保底
  const reach = sortedPredictions.find(p => p.type === 'reach');
  const match = sortedPredictions.find(p => p.type === 'match');
  const safety = sortedPredictions.find(p => p.type === 'safety');

  const displayPredictions = [];
  if (reach) displayPredictions.push(reach);
  if (match) displayPredictions.push(match);
  if (safety) displayPredictions.push(safety);
  
  // 补齐到最多4个
  while (displayPredictions.length < 4 && displayPredictions.length < sortedPredictions.length) {
    const nextUni = sortedPredictions.find(p => !displayPredictions.includes(p));
    if (nextUni) displayPredictions.push(nextUni);
    else break;
  }

  // 4. 生成专业评语
  let suggestion = "";
  if (input.gpa < 75) {
    suggestion = `您的 GPA 略显单薄。申请 ${input.major} 建议重点通过德语成绩（争取C1）或优质的实习/科研经历来弥补。建议考虑 TU9 之外的宝藏大学。`;
  } else if (input.language === 'german_b1' || input.language === 'other') {
    suggestion = `您的学术背景符合要求，但语言是明显短板。建议立即开启密集型语言培训，或考虑提供条件录取的院校。`;
  } else if (score >= 80) {
    suggestion = `非常优秀的学术背景！您完全有实力冲击慕尼黑工大或亚琛工大等顶尖名校。建议提早准备动机信与APS审核。`;
  } else {
    suggestion = `您的背景中规中矩，申请 ${input.major} 竞争较激烈。建议采取“冲刺TU9+保底综合性大学”的稳妥策略。`;
  }

  return {
    score,
    // 按照概率从低到高排序展示（冲刺在最上面，保底在最下面，符合用户心理）
    predictions: displayPredictions.sort((a, b) => a.probability - b.probability),
    suggestion
  };
};
