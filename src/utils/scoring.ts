export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number }; // 用于雷达分值
  dimensions: { academic: string; language: string; strategy: string }; // 多维诊断报告
  predictions: { name: string; probability: number; type: 'reach' | 'match' | 'safety'; warningMsg?: string; }[];
  suggestion: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number; 
  language: string;
  major: string;
  background: string; 
  hasTest: 'yes' | 'no'; 
  highSchoolType?: string; 
  highSchoolScore?: string;
}

import universitiesData from '../data/universities.json';

export const calculateScore = (input: UserInput): AssessmentResult => {
  let bavarianScore = 2.0; 
  let score = 80;
  let academicScore = 70;
  let languageScore = 60;
  let matchScore = 80;

  let academicFeedback = "";
  let languageFeedback = "";
  let strategyFeedback = "";

  if (input.degree === 'master') {
    bavarianScore = 1 + 3 * (100 - input.gpa) / 40;
    bavarianScore = Math.max(1.0, Math.min(4.0, bavarianScore)); 
    score = Math.round(100 - ((bavarianScore - 1) * 33));
    
    academicScore = score;
    if (input.background === '985' || input.background === '211') {
      score += 10; academicScore += 15;
      academicFeedback = "您的985/211院校背景在申请中拥有极高权重，可适当豁免部分课程匹配度要求。";
    } else {
      academicFeedback = "双非背景申请名校需特别注意课程描述（Modulhandbuch）的精修，这是逆袭核心。";
    }
  } else {
    if (input.highSchoolScore === 'excellent' || input.highSchoolType === 'IB' || input.highSchoolType === 'AL') {
      bavarianScore = 1.5; score = 90; academicScore = 95;
      academicFeedback = "您的国际课程体系及预估分极具竞争力，可直入德国本科无需预科。";
    } else {
      bavarianScore = 2.5; score = 75; academicScore = 70;
      academicFeedback = "您当前的成绩体系可能需通过德国大学预科（Studienkolleg）过渡，建议提前规划。";
    }
  }

  if (['german_c1', 'ielts_7'].includes(input.language)) {
    score += 10; languageScore = 95;
    languageFeedback = "语言能力已达到顶尖院校直录标准，具备强悍的申请竞争力。";
  } else if (input.language === 'other') {
    languageScore = 30;
    languageFeedback = "严重短板！语言成绩缺失将导致初审直接被拒，急需开启密集强化训练。";
  } else {
    languageScore = 70;
    languageFeedback = "语言水平处于及格线边缘，冲击热门专业存在风险，建议继续冲刺高分或申请条件录取。";
  }

  score = Math.min(99, score);

  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 10); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    prob += (2.5 - bavarianScore) * 25; 

    if (uni.minLang === 'german_c1' && !['german_c1', 'ielts_7'].includes(input.language)) prob -= 30;
    if (input.language === 'other') prob -= 40;

    let warningMsg = "";
    if (input.degree === 'master') {
      if (input.background === '985' || input.background === '211') prob += 15;
      if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') {
        prob -= 45; warningMsg = "注意：TUM该专业强烈建议GRE，点击获取免GRE备选方案！";
      }
      if (uni.name.includes("曼海姆") && (input.major === "商科" || input.major === "经济学") && input.hasTest === 'no') {
        prob -= 45; warningMsg = "警告：商科强烈依赖GMAT成绩，建议联系我们获取规划。";
      }
    }

    prob = Math.max(5, Math.min(98, prob)); 
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety'; 
    return { name: uni.name, probability: Math.round(prob), type, warningMsg };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  
  strategyFeedback = `根据您的综合画像，为您在全德50所目标院校库中进行了深度比对。推荐采用【冲刺+核心+保底】的梯度策略，重点避开强制要求${input.degree === 'master' ? '标化考试' : '高难预科'}的红海项目。`;

  return {
    score,
    radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    predictions: sortedPredictions.slice(0, 5), // 输出前5所展示
    suggestion: "多维体检报告已生成，请查阅下方各项指标分析及专属行动建议。"
  };
};
