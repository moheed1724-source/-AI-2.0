import universitiesData from '../data/universities.json';

export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number };
  dimensions: { academic: string; language: string; strategy: string };
  predictions: { name: string; probability: number; type: 'reach' | 'match' | 'safety'; warningMsg?: string; isNc?: boolean }[];
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

  // ================= 1. 学术与APS逻辑 (修复国际课程硬伤) =================
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
      apsPrediction = "中/低风险 (有挂科记录，面试时需准备书面说明，重点展示后续成绩回升)";
    } else {
      apsPrediction = bavarianScore <= 2.5 ? "高通过率 (学术背景扎实，面试时展示系统知识框架即可)" : "中等 (建议提前3-6个月开始准备APS专业课复习)";
    }

    const validExpCount = (input.researchExp || []).filter(v => v !== 'none').length;
    if (validExpCount >= 2) score += 8;
    else if (validExpCount === 1) score += 4;

  } else {
    // 本科路线逻辑
    if (input.highSchoolType === 'gaokao' && input.gaokaoScore) {
      const percent = (input.gaokaoScore / 750) * 100;
      bavarianScore = 1 + 3 * (100 - percent) / (100 - 70);
      bavarianScore = Math.max(1.0, Math.min(4.0, Number(bavarianScore.toFixed(1))));
      
      score = bavarianScore <= 1.5 ? 92 : bavarianScore <= 2.5 ? 80 : bavarianScore <= 3.0 ? 65 : 45;
      academicFeedback = `高考成绩德国GPA约 ${bavarianScore.toFixed(1)}，${score >= 80 ? '可直申绝大多数院校' : '强烈建议先完成Studienkolleg预科'}。`;
      apsPrediction = "需进行APS高考程序审核 (流程相对简单，按要求准备材料即可)";
    } else {
      // 🌟 修复痛点1：国际课程完全豁免APS，转化为优势卖点
      bavarianScore = (input.highSchoolScore === 'excellent') ? 1.5 : 2.5; 
      score = bavarianScore === 1.5 ? 90 : 75; 
      academicFeedback = "国际课程成绩具备极强竞争力，具体能兑换多少德国 Abitur 绩点需经严格学分换算。";
      apsPrediction = "🌟 官方豁免特权！(国际课程体系无需经过中国区APS面谈审核，直接通过 uni-assist 通道或 ZAB 认证即可申请德国大学)";
    }
  }

  // ================= 2. 语言与授课通道逻辑 (修复虚假承诺) =================
  if (['ielts_7', 'ielts_6.5'].includes(input.language)) {
    // 🌟 修复痛点2：检测到纯英语，立刻敲响警钟
    score -= 5; // 英授项目更难，适当降分
    languageScore = 85;
    languageFeedback = "【全英授课通道】已开启。⚠️ 警报：德国名校全英项目因免除了德语门槛，全球竞争极其惨烈，实际录取难度远高于德语项目，请务必做好极速占位准备！";
  } else if (['german_c1', 'german_b2'].includes(input.language)) {
    score += 10; languageScore = 95;
    languageFeedback = "【德语授课通道】已开启。您的德语能力为您解锁了德国 90% 以上的免学费核心项目，避开了英授的惨烈竞争。";
  } else {
    languageScore = 30;
    languageFeedback = "严重短板！语言成绩缺失将导致初审直接被拒，急需开启密集强化训练。";
  }

  score = Math.min(99, score);

  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 10); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    prob += (2.5 - bavarianScore) * 25; 

    // 英授惩罚：如果学校只要求德语但用户只有英语，概率大幅下降（实际上申不了，这里做扣分处理模拟现实）
    if (uni.minLang.includes('german') && ['ielts_7', 'ielts_6.5'].includes(input.language)) prob -= 35;
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
    }

    prob = Math.max(5, Math.min(98, prob)); 
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety'; 
    return { name: uni.name, probability: Math.round(prob), type, warningMsg, isNc: uniAny.restricted && uniAny.restricted.includes(input.major) };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
  strategyFeedback = `已为您在全德50所目标院校库中进行比对。推荐采用【冲刺+核心+保底】梯度策略，切勿将鸡蛋放在同一个篮子里。`;

  return {
    score,
    radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    predictions: sortedPredictions.slice(0, 5),
    suggestion: "多维体检报告已生成，请务必仔细查阅下方的风险预警与行动建议。",
    bavarianScoreDisplay: `约 ${bavarianScore.toFixed(1)} / 4.0`,
    apsPrediction: apsPrediction
  };
};
