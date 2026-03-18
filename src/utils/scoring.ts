import universitiesData from '../data/universities.json';

export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number };
  dimensions: { academic: string; language: string; strategy: string };
  bavarianScoreDisplay: string; // 直观展示算出来的德国均分
  predictions: { 
    name: string; 
    probability: number; 
    type: 'reach' | 'match' | 'safety'; 
    warningMsg?: string;
    livingCost: number;
    tuitionFee: string;
  }[];
  suggestion: string;
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  // Bachelor Specific
  highSchoolType?: string; 
  gaokaoPercent?: string; // 高考生专属：过70%即可直录
  // Master Specific
  gpa: number; 
  background: string; 
  ectsMatch?: string; // 新增：ECTS课程匹配度自测 (非常关键)
  // Common
  language: string;
  major: string;
  hasTest: 'yes' | 'no'; 
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

  // 1. 学术及巴伐利亚分换算
  if (input.degree === 'master') {
    // 巴伐利亚算法: 1 + 3 * (最高分 - 你的分) / (最高分 - 及格分)
    bavarianScore = 1 + 3 * (100 - input.gpa) / 40;
    bavarianScore = Math.max(1.0, Math.min(4.0, Number(bavarianScore.toFixed(1)))); 
    score = Math.round(100 - ((bavarianScore - 1) * 33));
    
    academicScore = score;
    if (input.background === '985' || input.background === '211') {
      score += 8; academicScore += 15;
      academicFeedback = `您的巴伐利亚换算分约为 ${bavarianScore}。985/211院校背景在申请TUM/RWTH等名校时拥有较高权重，审核部(APS)免责率较高。`;
    } else {
      academicFeedback = `您的巴伐利亚换算分约为 ${bavarianScore}。双非背景申请名校需特别注意核心课程（Modulhandbuch）的精修描述，这是逆袭核心。`;
    }

    // ECTS 匹配度影响
    if (input.ectsMatch === 'low') {
      score -= 15; matchScore = 40;
      strategyFeedback = "⚠️ 警告：德国极度看重本科课程与硕士的ECTS学分匹配！您的前置学分缺口较大，面临高概率的『补课录取』或『直接拒录』，强烈建议预约专家进行学分审计。";
    } else {
      strategyFeedback = `根据您的综合画像，为您在全德50所目标院校库中进行了深度比对。推荐采用【冲刺+核心+保底】的梯度策略。`;
    }

  } else {
    // 本科逻辑升级：高考过70%门槛
    if (input.highSchoolType === 'gaokao' && input.gaokaoPercent === 'over70') {
      bavarianScore = 1.8; score = 88; academicScore = 90;
      academicFeedback = "您的高考分数满足总分70%的要求，具备直接入读德国本科的资格（无需读预科），极大地节省了时间和成本！";
    } else if (input.highSchoolType === 'AL' || input.highSchoolType === 'IB') {
      bavarianScore = 1.5; score = 90; academicScore = 95;
      academicFeedback = "您的国际课程体系受 ZAB 认证，可利用 A-Level/IB 成绩直申德国本科。";
    } else {
      bavarianScore = 2.8; score = 65; academicScore = 60;
      academicFeedback = "根据当前学历条件，您可能需先申请德国大学预科（Studienkolleg）并通过 FSP 考试，建议立刻开始规划预科方向。";
    }
    strategyFeedback = "本科阶段申请重点在于APS审核与高考/国际成绩认证，语言达标是第一要务。";
  }

  // 2. 语言评估
  if (['german_c1', 'ielts_7'].includes(input.language)) {
    score += 10; languageScore = 95;
    languageFeedback = "语言能力已达到顶尖院校直录标准（DSH-2/DAF 4x4），具备强悍的申请竞争力。";
  } else if (input.language === 'german_b2') {
    languageScore = 75;
    languageFeedback = "处于B2阶段，可申请部分带条件录取（Bedingte Zulassung）或冲刺语言班，需抓紧最后冲刺。";
  } else {
    languageScore = 40;
    languageFeedback = "严重短板！德国多数公立大学要求C1级别直录，急需开启密集强化训练或考虑英语授课项目。";
  }

  score = Math.min(99, Math.max(30, score));

  // 3. 匹配大学并引入 NC (受限专业) 逻辑
  let relevantUnis = universitiesData.filter(uni => uni.majors.includes(input.major));
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 10); 

  const predictions = relevantUnis.map(uni => {
    let prob = 50; 
    // 基础分转换：1.0满分，4.0及格
    prob += (2.5 - bavarianScore) * 25; 

    // NC 受限专业惩罚：如果该专业是受限专业，且分数不够好（>1.8），概率大跌
    const isNC = (uni.ncMajors as string[]).includes(input.major);
    let warningMsg = "";

    if (isNC) {
      if (bavarianScore > 1.8) prob -= 30;
      warningMsg = "⚠️ NC受限专业预警！名额极少，竞争白热化。";
    }

    // 语言惩罚
    if (uni.minLang === 'german_c1' && !['german_c1', 'ielts_7'].includes(input.language)) prob -= 25;
    if (input.language === 'other') prob -= 40;

    // TUM / 商科 附加考试惩罚
    if (input.degree === 'master') {
      if (input.background === '985' || input.background === '211') prob += 15;
      if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') {
        prob -= 35; warningMsg = "注意：TUM该专业强烈建议带GRE申请，点击获取替代方案。";
      }
      if ((input.major === "商科" || input.major === "经济学") && uni.tier === 'S' && input.hasTest === 'no') {
        prob -= 30; warningMsg = "名校商科强烈依赖GMAT成绩，建议联系我们获取规划。";
      }
    }

    prob = Math.max(5, Math.min(98, prob)); 
    let type: 'reach' | 'match' | 'safety' = prob < 40 ? 'reach' : prob < 75 ? 'match' : 'safety'; 
    return { 
      name: uni.name, 
      probability: Math.round(prob), 
      type, 
      warningMsg,
      livingCost: uni.livingCost as number,
      tuitionFee: uni.tuitionFee as string
    };
  });

  const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);

  return {
    score,
    radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    bavarianScoreDisplay: bavarianScore.toString(),
    predictions: sortedPredictions.slice(0, 5), // 输出前5所展示
    suggestion: "多维体检报告已生成，已解锁您的巴伐利亚均分、受限专业避坑指南及生活成本预估。"
  };
};
