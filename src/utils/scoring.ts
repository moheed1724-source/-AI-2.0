export interface AssessmentResult {
  score: number;
  predictions: {
    name: string;
    probability: number;
    type: 'reach' | 'match' | 'safety';
    warningMsg?: string; // 新增的警告字段
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
  hasTest: 'yes' | 'no'; // 新增：是否拥有 GRE/GMAT
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  // 1. 巴伐利亚算法计算 (德国分数越低越好，最高1.0，及格4.0)
  let bavarianScore = 1 + 3 * (100 - input.gpa) / 40;
  bavarianScore = Math.max(1.0, Math.min(4.0, bavarianScore)); // 限制在 1.0 - 4.0 之间

  // UI 的竞争力总分 (百分制)
  let score = Math.round(100 - ((bavarianScore - 1) * 33));
  if (input.background === '985' || input.background === '211') score += 10;
  if (['german_c1', 'ielts_7'].includes(input.language)) score += 10;
  score = Math.min(99, score);

  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) {
    relevantUnis = universitiesData.slice(0, 5); 
  }

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    
    // 绩点优势换算：如果德国分数优于 2.5，加概率；差于 2.5，减概率
    prob += (2.5 - bavarianScore) * 25; 

    // 语言卡脖子
    if (uni.minLang === 'german_c1' && !['german_c1', 'ielts_7'].includes(input.language)) prob -= 30;
    if (input.language === 'other') prob -= 40;

    // 背景红利：985/211 在德国名校可以弥补部分均分劣势
    if (input.background === '985' || input.background === '211') prob += 15;
    if (uni.tier === 'S' && ['tier1', 'tier2'].includes(input.background)) prob -= 20;

    let warningMsg = "";
    
    // 🎯 超级引流点：名校标化考试拦截
    if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') {
      prob -= 45; // 致命打击
      warningMsg = "注意：TUM该专业强制要求GRE，点击获取免GRE备选冲刺方案！";
    }
    if (uni.name.includes("曼海姆") && (input.major === "商科" || input.major === "经济学") && input.hasTest === 'no') {
      prob -= 45; 
      warningMsg = "警告：曼海姆强烈依赖GMAT成绩，建议联系我们获取高分规划。";
    }

    prob = Math.max(5, Math.min(98, prob)); 

    let type: 'reach' | 'match' | 'safety';
    if (prob < 40) type = 'reach'; 
    else if (prob < 75) type = 'match'; 
    else type = 'safety'; 

    return { name: uni.name, probability: Math.round(prob), type, warningMsg };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  const reach = sortedPredictions.find(p => p.type === 'reach');
  const match = sortedPredictions.find(p => p.type === 'match');
  const safety = sortedPredictions.find(p => p.type === 'safety');

  const displayPredictions = [];
  if (reach) displayPredictions.push(reach);
  if (match) displayPredictions.push(match);
  if (safety) displayPredictions.push(safety);
  
  while (displayPredictions.length < 4 && displayPredictions.length < sortedPredictions.length) {
    const nextUni = sortedPredictions.find(p => !displayPredictions.includes(p));
    if (nextUni) displayPredictions.push(nextUni);
    else break;
  }

  let suggestion = "";
  if (bavarianScore > 2.8) {
    suggestion = `根据巴伐利亚算法，您的德国分数为 ${bavarianScore.toFixed(1)}，略显单薄。建议重点通过极高的德语成绩或优质的科研经历来弥补。`;
  } else if (input.language === 'german_b1' || input.language === 'other') {
    suggestion = `您的均分折算符合要求，但语言是明显短板。建议立即开启密集型语言培训，获取条件录取资格。`;
  } else if (bavarianScore <= 1.8) {
    suggestion = `根据巴伐利亚算法，您的成绩达 ${bavarianScore.toFixed(1)} 分！您完全有实力冲击全德排名前三的理工神校。`;
  } else {
    suggestion = `您的背景中规中矩，申请 ${input.major} 竞争较激烈。建议采取“冲刺TU9+保底精英大学”的稳妥策略。`;
  }

  return {
    score,
    predictions: displayPredictions.sort((a, b) => a.probability - b.probability),
    suggestion
  };
};
