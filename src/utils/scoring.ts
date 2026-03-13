export interface AssessmentResult {
  score: number;
  predictions: {
    name: string;
    probability: number;
    type: 'reach' | 'match' | 'safety';
    warningMsg?: string; 
  }[];
  suggestion: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number; // 硕士用
  language: string;
  major: string;
  background: string; // 硕士用
  hasTest: 'yes' | 'no'; // 硕士用
  // 🌟 新增的本科专属字段
  highSchoolType?: string; 
  highSchoolScore?: string;
  city?: string;
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  let bavarianScore = 2.0; 
  let score = 80;

  // 区分硕士和本科的打分逻辑
  if (input.degree === 'master') {
    bavarianScore = 1 + 3 * (100 - input.gpa) / 40;
    bavarianScore = Math.max(1.0, Math.min(4.0, bavarianScore)); 
    score = Math.round(100 - ((bavarianScore - 1) * 33));
    if (input.background === '985' || input.background === '211') score += 10;
  } else {
    // 本科逻辑：国际课程或者高考高分给予高分评价
    if (input.highSchoolScore === 'excellent' || input.highSchoolType === 'IB' || input.highSchoolType === 'AL') {
      bavarianScore = 1.5;
      score = 90;
    } else {
      bavarianScore = 2.5;
      score = 75;
    }
  }

  if (['german_c1', 'ielts_7'].includes(input.language)) score += 10;
  score = Math.min(99, score);

  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 5); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    prob += (2.5 - bavarianScore) * 25; 

    if (uni.minLang === 'german_c1' && !['german_c1', 'ielts_7'].includes(input.language)) prob -= 30;
    if (input.language === 'other') prob -= 40;

    let warningMsg = "";
    
    // 硕士的拦截逻辑
    if (input.degree === 'master') {
      if (input.background === '985' || input.background === '211') prob += 15;
      if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') {
        prob -= 45; 
        warningMsg = "注意：TUM该专业强烈建议GRE，点击获取免GRE备选方案！";
      }
      if (uni.name.includes("曼海姆") && (input.major === "商科" || input.major === "经济学") && input.hasTest === 'no') {
        prob -= 45; 
        warningMsg = "警告：商科强烈依赖GMAT成绩，建议联系我们获取规划。";
      }
    } else {
      // 本科的拦截逻辑
      if (input.highSchoolType === 'gaokao' && input.highSchoolScore === 'low') {
        prob -= 20;
        warningMsg = "注意：高考分数线可能需通过预科过渡，扫码获取预科方案！";
      }
    }

    prob = Math.max(5, Math.min(98, prob)); 
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety'; 

    return { name: uni.name, probability: Math.round(prob), type, warningMsg };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  const displayPredictions = [
    sortedPredictions.find(p => p.type === 'reach'),
    sortedPredictions.find(p => p.type === 'match'),
    sortedPredictions.find(p => p.type === 'safety')
  ].filter(Boolean) as any[];

  while (displayPredictions.length < 4 && displayPredictions.length < sortedPredictions.length) {
    const nextUni = sortedPredictions.find(p => !displayPredictions.includes(p));
    if (nextUni) displayPredictions.push(nextUni);
  }

  let suggestion = "";
  if (input.degree === 'bachelor') {
    suggestion = `根据最新的德国本科(APS)审核政策，您的${input.highSchoolType === 'gaokao' ? '高考' : '国际课程'}成绩具备申请资格。建议尽早规划语言以抢占名校席位。`;
  } else {
    if (bavarianScore > 2.8) suggestion = `您的德国分数为 ${bavarianScore.toFixed(1)}，建议重点通过极高的德语成绩或优质的科研经历来弥补。`;
    else if (bavarianScore <= 1.8) suggestion = `您的成绩达 ${bavarianScore.toFixed(1)} 分！您完全有实力冲击全德排名前三的理工神校。`;
    else suggestion = `您的背景中规中矩，建议采取“冲刺TU9+保底精英大学”的稳妥策略。`;
  }

  return {
    score,
    predictions: displayPredictions.sort((a, b) => a.probability - b.probability),
    suggestion
  };
};
