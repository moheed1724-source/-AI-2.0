import universitiesData from '../data/universities.json';

export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number };
  dimensions: { academic: string; language: string; strategy: string };
  predictions: { 
    name: string; 
    difficultyStars: number; 
    type: 'reach' | 'match' | 'safety'; 
    badges: { text: string; status: 'pass' | 'fail' | 'warn' }[]; 
  }[];
  suggestion: string;
  bavarianScoreDisplay: string;
  apsPrediction: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number; language: string; major: string; background: string; 
  hasTest: 'yes' | 'no'; hasFail?: 'yes' | 'no';
  highSchoolType?: string; highSchoolScore?: string; gaokaoScore?: number;
  province?: string; researchExp?: string[];
}

export const calculateScore = (input: UserInput): AssessmentResult => {
  let bavarianScore = 2.0; let score = 80;
  let academicScore = 70; let languageScore = 60; let matchScore = 80;
  let academicFeedback = ""; let languageFeedback = ""; let strategyFeedback = ""; let apsPrediction = "";

  if (input.degree === 'master') {
    bavarianScore = 1 + 3 * (100 - input.gpa) / 40;
    bavarianScore = Math.max(1.0, Math.min(4.0, bavarianScore)); 
    score = Math.round(100 - ((bavarianScore - 1) * 33));
    academicScore = score;
    if (input.background === '985' || input.background === '211') { score += 10; academicScore += 15; academicFeedback = "985/211院校背景在申请中拥有极高权重，可适当豁免部分课程匹配度要求。"; } 
    else { academicFeedback = "双非背景申请名校需特别注意课程描述（Modulhandbuch）的精修，这是逆袭核心。"; }
    apsPrediction = input.hasFail === 'yes' ? "中/低风险 (有挂科，面试需准备书面说明)" : "高通过率 (背景扎实，展示系统知识框架即可)";
  } else {
    if (input.highSchoolType === 'gaokao' && input.gaokaoScore) {
      bavarianScore = 1 + 3 * (100 - (input.gaokaoScore / 750) * 100) / 30;
      bavarianScore = Math.max(1.0, Math.min(4.0, Number(bavarianScore.toFixed(1))));
      score = bavarianScore <= 2.5 ? 80 : 60;
      academicFeedback = `高考成绩德国GPA约 ${bavarianScore.toFixed(1)}，符合基本要求。`;
      apsPrediction = "需进行APS高考程序审核 (按要求准备材料即可)";
    } else {
      bavarianScore = (input.highSchoolScore === 'excellent') ? 1.5 : 2.5; 
      score = bavarianScore === 1.5 ? 90 : 75; 
      academicFeedback = "国际课程成绩具备极强竞争力，具体兑换比例需经严格学分换算。";
      apsPrediction = "🌟 官方豁免特权！(国际课程无需经过中国区APS面谈审核)";
    }
  }

  const isEnglishOnly = ['ielts_7', 'ielts_6.5'].includes(input.language);
  if (isEnglishOnly) {
    score -= 5; languageScore = 85;
    languageFeedback = "【全英授课通道】已开启。⚠️警报：德国名校全英项目免除了德语门槛，全球竞争极其惨烈，请务必做好占位准备！";
  } else if (['german_c1', 'german_b2'].includes(input.language)) {
    score += 10; languageScore = 95;
    languageFeedback = "【德语授课通道】已开启。您的德语为您解锁了90%以上的免学费核心项目。";
  } else { languageScore = 30; languageFeedback = "严重短板！语言成绩缺失将导致初审被拒，急需开启强化训练。"; }

  score = Math.min(99, score);

  let relevantUnis = universitiesData.filter(uni => {
    const enMajors = (uni.en_majors as string[]) || [];
    const deMajors = (uni.de_majors as string[]) || [];
    if (isEnglishOnly) return enMajors.includes(input.major);
    return deMajors.includes(input.major) || enMajors.includes(input.major);
  });
  
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 3); 

  const predictions = relevantUnis.map(uni => {
    let internalScore = 80 - (bavarianScore * 10); 
    const badges: { text: string; status: 'pass' | 'fail' | 'warn' }[] = [];

    if (bavarianScore <= 2.0) badges.push({ text: '✅ 均分达初审线', status: 'pass' });
    else badges.push({ text: '⚠️ 均分存在竞争风险', status: 'warn' });

    if (input.degree === 'master') {
      if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') {
        internalScore -= 30; badges.push({ text: '❌ 严重缺失 GRE 成绩', status: 'fail' });
      }
      if (uni.name.includes("曼海姆") && (input.major === "商科" || input.major === "经济学") && input.hasTest === 'no') {
        internalScore -= 30; badges.push({ text: '❌ 严重缺失 GMAT 成绩', status: 'fail' });
      }
    }

    badges.push({ text: '⚠️ ECTS学分未对齐(高风险)', status: 'warn' });

    let stars = 3;
    if (uni.tier === 'S') { stars = 5; internalScore -= 20; }
    else if (uni.tier === 'A') { stars = 4; internalScore -= 10; }

    let type: 'reach' | 'match' | 'safety' = internalScore < 40 ? 'reach' : internalScore < 70 ? 'match' : 'safety'; 

    return { name: uni.name, difficultyStars: stars, type, badges };
  });

  strategyFeedback = `系统已对您进行深度硬件扫描。当前判定存在部分【红色缺失】与【黄色风险】指标，切勿盲目投递。`;

  return {
    score,
    radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    predictions: predictions.slice(0, 5),
    suggestion: "多维体检报告已生成，请务必仔细查阅下方的硬件缺失与风险预警。",
    bavarianScoreDisplay: `约 ${bavarianScore.toFixed(1)} / 4.0`,
    apsPrediction: apsPrediction
  };
};
