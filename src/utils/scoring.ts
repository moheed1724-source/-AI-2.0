import universitiesData from '../data/universities.json';

export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number };
  dimensions: { academic: string; language: string; strategy: string };
  // 👇 就是这里！补上了 isNc?: boolean; 从而通过 GitHub 的严格检查
  predictions: { name: string; probability: number; type: 'reach' | 'match' | 'safety'; warningMsg?: string; isNc?: boolean; }[];
  suggestion: string;
  bavarianScoreDisplay: string;
  apsPrediction: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number; 
  language: string;
  major: string;
  background: string; 
  hasTest: 'yes' | 'no'; 
  
  highSchoolType?: string; 
  province?: string;
  gaokaoScore?: number;
  highSchoolScore?: string;
  
  hasFail?: 'yes' | 'no';
  researchExp?: string[];
}

export const calculateScore = (input: UserInput): AssessmentResult => {
  let bavarianScore = 2.0; 
  let score = 80;
  let academicScore = 70;
  let languageScore = 60;
  let matchScore = 80;

  let academicFeedback = "";
  let languageFeedback = "";
  let strategyFeedback = "";
  let apsPrediction = "";

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

    if (input.hasFail === 'yes') {
      score -= 12;
      academicFeedback += "挂科记录将在APS面试中被重点查问，务必准备合理的书面解释（如病假、转专业适应期等）。";
      apsPrediction = "中/低风险 (有挂科记录，面试时准备书面说明，重点展示后续成绩回升和学习能力)";
    } else {
      apsPrediction = bavarianScore <= 2.5 ? "高通过率 (学术背景扎实，重点复习核心专业课，面试时展示系统的知识体系)" : "中等 (建议提前3-6个月开始准备APS专业课复习，特别关注数学/物理基础)";
    }

    const validExpCount = (input.researchExp || []).filter(v => v !== 'none').length;
    if (validExpCount >= 2) {
      score += 8;
      academicFeedback += "丰富的科研/实习经历是你的核心竞争优势，在文书中务必重点呈现。";
    } else if (validExpCount === 1) {
      score += 4;
    }

  } else {
    if (input.highSchoolType === 'gaokao' && input.gaokaoScore) {
      const percent = (input.gaokaoScore / 750) * 100;
      bavarianScore = 1 + 3 * (100 - percent) / (100 - 70);
      bavarianScore = Math.max(1.0, Math.min(4.0, Number(bavarianScore.toFixed(1))));
      
      if (bavarianScore <= 1.5) {
        score = 92; academicScore = 95;
        academicFeedback = `高考成绩优异，德国GPA约 ${bavarianScore.toFixed(1)}，可直申TU9一线院校，无需预科。`;
      } else if (bavarianScore <= 2.5) {
        score = 80; academicScore = 82;
        academicFeedback = `高考成绩良好，德国GPA约 ${bavarianScore.toFixed(1)}，可申请大多数院校，建议避开NC红海专业。`;
      } else if (bavarianScore <= 3.0) {
        score = 65; academicScore = 60;
        academicFeedback = `高考成绩中等，德国GPA约 ${bavarianScore.toFixed(1)}，部分专业可能需要通过Studienkolleg预科过渡。`;
      } else {
        score = 45; academicScore = 40;
        academicFeedback = `高考成绩偏低，德国GPA约 ${bavarianScore.toFixed(1)}，强烈建议先完成Studienkolleg预科并取得好成绩。`;
      }
      apsPrediction = "高通过率 (高考程序相对简单，按要求准备材料和语言即可)";
    } else if (input.highSchoolScore === 'excellent' || input.highSchoolType === 'IB' || input.highSchoolType === 'AL') {
      bavarianScore = 1.5; score = 90; academicScore = 95;
      academicFeedback = "国际课程成绩优秀，可直入德国本科无需预科，竞争力极强。";
      apsPrediction = "🌟 官方豁免特权 (国际课程免APS面试，通过材料审核即可)";
    } else {
      bavarianScore = 2.5; score = 75; academicScore = 70;
      academicFeedback = "成绩尚可，建议提前了解是否需要Studienkolleg预科，以及目标专业NC分数线。";
      apsPrediction = "中等 (需关注具体课程体系的审核要求)";
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

    const uniAny = uni as any;
    if (uniAny.restricted && uniAny.restricted.includes(input.major)) {
       prob -= 15; 
       if (bavarianScore > 2.0) prob -= 20; 
    }

    prob = Math.max(5, Math.min(98, prob)); 
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety'; 
    return { name: uni.name, probability: Math.round(prob), type, warningMsg, isNc: uniAny.restricted && uniAny.restricted.includes(input.major) };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  
  strategyFeedback = `根据您的综合画像，为您在全德50所目标院校库中进行了深度比对。推荐采用【冲刺+核心+保底】的梯度策略，重点避开强制要求${input.degree === 'master' ? '标化考试' : '高难预科'}的红海项目。`;

  return {
    score,
    radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    predictions: sortedPredictions.slice(0, 5),
    suggestion: "多维体检报告已生成，请查阅下方各项指标分析及专属行动建议。",
    bavarianScoreDisplay: `约 ${bavarianScore.toFixed(1)} / 4.0`,
    apsPrediction: apsPrediction
  };
};
