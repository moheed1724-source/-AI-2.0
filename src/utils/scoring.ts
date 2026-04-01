import universitiesData from '../data/universities.json';

export interface AssessmentResult {
  score: number;
  radarScores: { academic: number; language: number; match: number };
  dimensions: { academic: string; language: string; strategy: string };
  predictions: { 
    name: string; difficultyStars: number; type: 'reach' | 'match' | 'safety'; 
    badges: { text: string; status: 'pass' | 'fail' | 'warn' }[]; 
    isTU9?: boolean; isExcellence?: boolean;
  }[];
  bavarianScoreDisplay: string;
  apsPrediction: string;
  jicaiAdvice: { title: string; points: string[]; CTA: string }; // 🌟 新增：右侧专家团队专属建议
}

export interface UserInput {
  degree: 'bachelor' | 'master';
  gpa: number; major: string; background: string; hasTest: 'yes' | 'no'; hasFail?: 'yes' | 'no';
  highSchoolType?: string; highSchoolScore?: string; gaokaoScore?: number; province?: string;
  // 🌟 新增细化语言分类
  langType: 'en' | 'de' | 'none';
  ieltsScore?: string;
  germanScore?: string;
}

export const calculateScore = (input: UserInput): AssessmentResult => {
  let bavarianScore = 2.0; let score = 80;
  let academicScore = 70; let languageScore = 60; let matchScore = 80;
  let academicFeedback = ""; let languageFeedback = ""; let strategyFeedback = ""; let apsPrediction = "";

  // 1. 学术逻辑 (与之前一致)
  if (input.degree === 'master') {
    bavarianScore = 1 + 3 * (100 - input.gpa) / 40; bavarianScore = Math.max(1.0, Math.min(4.0, bavarianScore)); 
    score = Math.round(100 - ((bavarianScore - 1) * 33)); academicScore = score;
    if (input.background === '985' || input.background === '211') { score += 10; academicScore += 15; academicFeedback = "985/211背景拥有极高权重，可适当豁免部分课程匹配度要求。"; } 
    else { academicFeedback = "双非背景需特别注意课程描述（Modulhandbuch）精修，这是逆袭核心。"; }
    apsPrediction = input.hasFail === 'yes' ? "中/低风险 (有挂科，面试需准备书面说明)" : "高通过率 (背景扎实，展示系统知识框架即可)";
  } else {
    if (input.highSchoolType === 'gaokao' && input.gaokaoScore) {
      bavarianScore = 1 + 3 * (100 - (input.gaokaoScore / 750) * 100) / 30; bavarianScore = Math.max(1.0, Math.min(4.0, Number(bavarianScore.toFixed(1))));
      score = bavarianScore <= 2.5 ? 80 : 60; academicFeedback = `高考成绩德国GPA约 ${bavarianScore.toFixed(1)}，符合基本要求。`;
      apsPrediction = "需进行APS高考程序审核 (按要求准备材料即可)";
    } else {
      bavarianScore = (input.highSchoolScore === 'excellent') ? 1.5 : 2.5; score = bavarianScore === 1.5 ? 90 : 75; 
      academicFeedback = "国际课程成绩极具竞争力，具体兑换比例需严格学分换算。"; apsPrediction = "🌟 官方豁免特权！(国际课程无需经过中国区APS面谈审核)";
    }
  }

  // 🌟 2. 细颗粒度语言逻辑
  let isEnglishOnly = input.langType === 'en';
  let langPass = false;

  if (input.langType === 'en') {
    if (['7.0', '7.5'].includes(input.ieltsScore || '')) { score -= 5; languageScore = 90; langPass = true; languageFeedback = "【全英授课通道】雅思高分达标。⚠️警告：德国名校全英项目免除德语门槛，全球竞争极其惨烈，务必做好占位准备！"; }
    else if (input.ieltsScore === '6.5') { score -= 15; languageScore = 70; languageFeedback = "【全英授课通道】雅思6.5仅满足部分学校底线，冲击TU9英授风险极大，建议继续刷分或转德授。"; }
    else { score -= 25; languageScore = 40; languageFeedback = "雅思分数未达主流英授项目直录门槛，建议搭配语言班。"; }
  } else if (input.langType === 'de') {
    if (['goethe_c1', 'goethe_c2', 'testdaf_16', 'testdaf_17', 'dsh_2', 'dsh_3'].includes(input.germanScore || '')) {
      score += 15; languageScore = 95; langPass = true; languageFeedback = "【德语授课通道】德语成绩极其优异！已为您解锁90%以上的免学费核心项目。";
    } else if (['goethe_b2', 'testdaf_14'].includes(input.germanScore || '')) {
      score += 5; languageScore = 75; languageFeedback = "【德语授课通道】达到部分院校有条件录取线，建议补充申请私立预科或语言班过渡。";
    } else { score -= 20; languageScore = 40; languageFeedback = "当前德语成绩距离直录差距较大，急需开启强化训练。"; }
  } else { score -= 30; languageScore = 20; languageFeedback = "严重短板！暂无可用语言成绩，初审极大概率被拒，建议立刻开始语言规划。"; }

  score = Math.min(99, Math.max(10, score));

  // 3. 筛选与打标签
  let relevantUnis = universitiesData.filter(uni => {
    const enMajors = (uni.en_majors as string[]) || []; const deMajors = (uni.de_majors as string[]) || [];
    if (input.langType === 'en') return enMajors.includes(input.major);
    return deMajors.includes(input.major) || enMajors.includes(input.major);
  });
  if (relevantUnis.length === 0) relevantUnis = universitiesData.slice(0, 3); 

  const predictions = relevantUnis.map(uni => {
    let internalScore = 80 - (bavarianScore * 10); 
    const badges: { text: string; status: 'pass' | 'fail' | 'warn' }[] = [];

    if (bavarianScore <= 2.0) badges.push({ text: '✅ 均分达初审线', status: 'pass' });
    else badges.push({ text: '⚠️ 均分存在竞争风险', status: 'warn' });

    if (!langPass) badges.push({ text: '❌ 语言尚未达直录线', status: 'fail' });

    if (input.degree === 'master') {
      if (uni.name.includes("慕尼黑工业大学") && input.major === "机械工程" && input.hasTest === 'no') { internalScore -= 30; badges.push({ text: '❌ 缺失 GRE 成绩', status: 'fail' }); }
      if (uni.name.includes("曼海姆") && (input.major === "商科" || input.major === "经济学") && input.hasTest === 'no') { internalScore -= 30; badges.push({ text: '❌ 缺失 GMAT 成绩', status: 'fail' }); }
    }
    badges.push({ text: '⚠️ ECTS学分未对齐(高风险)', status: 'warn' });

    let stars = 3;
    if (uni.tier === 'S') { stars = 5; internalScore -= 20; }
    else if (uni.tier === 'A') { stars = 4; internalScore -= 10; }
    let type: 'reach' | 'match' | 'safety' = internalScore < 40 ? 'reach' : internalScore < 70 ? 'match' : 'safety'; 

    return { name: uni.name, difficultyStars: stars, type, badges, isTU9: (uni as any).isTU9, isExcellence: (uni as any).isExcellence };
  });

  strategyFeedback = `当前判定存在【红色缺失】与【黄色风险】指标。德国实行“严进严出”及专业直系录入，切勿盲目投递当炮灰。`;

  // 🌟 4. 动态生成济才专属专家建议
  let jicaiAdvice = {
    title: "济才资深顾问团队：专属突围策略",
    points: [
      `您的目标专业【${input.major}】在 ${input.langType === 'en' ? '英语授课' : '德语授课'} 赛道竞争极为激烈，当前硬件存在致命风险。`,
      `【核心陷阱】：即使均分和语言达标，德国大学卡人最狠的是本科 ECTS 学分匹配度。少一门数学或基础力学都会被无情秒拒。`,
      `【破局方案】：立即启动“人工学分对齐”。我们会调用济才内部 TU9 历年录取课表库，为您精准测算补课策略或推荐“曲线救国”的高匹配度替代专业。`
    ],
    CTA: "获取精准学分评估方案"
  };

  if (input.langType === 'en') {
    jicaiAdvice.points.push(`【英授红海预警】：德国免学费的英授项目是全球卷王聚集地。建议“英德双轨申请”，由我们为您搭配私立预科或语言班做保底双保险。`);
  }

  return {
    score, radarScores: { academic: Math.min(99, academicScore), language: languageScore, match: matchScore },
    dimensions: { academic: academicFeedback, language: languageFeedback, strategy: strategyFeedback },
    predictions: predictions.slice(0, 6), bavarianScoreDisplay: `约 ${bavarianScore.toFixed(1)} / 4.0`, apsPrediction, jicaiAdvice
  };
};
