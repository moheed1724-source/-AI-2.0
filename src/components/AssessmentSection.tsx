import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateScore, UserInput, AssessmentResult } from '../utils/scoring';
import { Lock, X, BarChart3, CheckCircle, AlertTriangle, BookOpen, MessageCircle, FileText, ChevronRight, Euro, GraduationCap } from 'lucide-react';

export const AssessmentSection: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formWizardStep, setFormWizardStep] = useState(1); // 1: 背景, 2: 成绩/专业, 3: 语言/考试
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showFullReport, setShowFullReport] = useState(false);
  const [inquiryContext, setInquiryContext] = useState("获取完整评估报告"); 
  const [result, setResult] = useState<AssessmentResult | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [userCount, setUserCount] = useState(12845); // 模拟营销数字

  useEffect(() => {
    // 模拟正在测试的人数增长
    const interval = setInterval(() => setUserCount(prev => prev + Math.floor(Math.random() * 3)), 8000);
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState<UserInput & { contact: string }>({
    degree: 'master', gpa: 80, language: 'german_b2', major: '机械工程', background: '211', hasTest: 'no', highSchoolType: 'gaokao', gaokaoPercent: 'under70', ectsMatch: 'medium', contact: ''
  });

  const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const nextStep = () => setFormWizardStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setFormWizardStep(prev => Math.max(prev - 1, 1));

  const loadingTexts = [
    "正在分析您的学历背景与巴伐利亚折算分...",
    "正在比对德国各州高校的 ECTS 与 NC 录取门槛...",
    "正在匹配留德生活费与巴符州等学费政策...",
    "生成《济才留德深度诊断白皮书》..."
  ];

  const handleGenerate = () => {
    setLoading(true); setLoadingStep(0);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < 4) setLoadingStep(currentStep);
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
      setResult(calculateScore(formData as UserInput));
      setLoading(false); setStep('result');
      // 延迟弹出诱导留资弹窗
      setTimeout(() => openLeadModal("获取剩余45所高校匹配清单及破局方案"), 4000);
    }, 5500); 
  };

  const openLeadModal = (context: string) => {
    setInquiryContext(context);
    setShowFullReport(true);
  };

  const submitLead = async () => {
    if (!formData.contact) return alert("请输入您的手机号或微信号！");
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: "a531da67-7614-4c7b-992d-e87c02d63ac2",
          '咨询意向': inquiryContext,
          '联系方式': formData.contact,
          '申请阶段': formData.degree,
          '目标专业': formData.major,
          ...(formData.degree === 'master' ? { 'GPA': formData.gpa, '背景': formData.background } : { '体系': formData.highSchoolType, '过线情况': formData.gaokaoPercent })
        })
      });
      if (response.ok) setContactSubmitted(true);
    } catch (error) { console.error(error); }
    setIsSubmitting(false);
  };

  // 渲染表单分布向导
  const renderFormStep = () => {
    switch(formWizardStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">第一步：确认您的升学阶段</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">申请阶段</label>
              <div className="flex gap-4">
                {['bachelor', 'master'].map((type) => (
                  <button key={type} onClick={() => handleInputChange('degree', type)} className={`flex-1 py-4 px-4 rounded-xl border transition-all ${formData.degree === type ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                    <GraduationCap className="mx-auto mb-2" size={24} />
                    {type === 'bachelor' ? '德国本科 (Bachelor)' : '德国硕士 (Master)'}
                  </button>
                ))}
              </div>
            </div>

            {formData.degree === 'master' ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">您的国内院校背景</label>
                <select value={formData.background} onChange={(e) => handleInputChange('background', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                  <option value="985">985 院校 (强竞争力)</option><option value="211">211 院校</option><option value="tier1">双非一本</option><option value="tier2">二本/独立学院</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">您目前的高中课程体系</label>
                <select value={formData.highSchoolType} onChange={(e) => handleInputChange('highSchoolType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                  <option value="gaokao">普通高中 (走高考程序)</option><option value="AL">A-Level 课程</option><option value="IB">IB 课程</option><option value="OSSD">OSSD / 其他国际体系</option>
                </select>
              </div>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">第二步：评估专业与成绩门槛</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">目标申请专业方向 (大类)</label>
              <select value={formData.major} onChange={(e) => handleInputChange('major', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                <option value="机械工程">机械工程 / 车辆工程 (热门)</option><option value="计算机">计算机科学 / AI (NC高危)</option><option value="电气工程">电气工程 (EE)</option><option value="商科">商科 / 管理学 (BWL/VWL)</option><option value="经济学">经济学</option>
              </select>
            </div>

            {formData.degree === 'master' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">目前算术均分 (GPA/100)</label>
                  <input type="range" min="60" max="100" value={formData.gpa} onChange={(e) => handleInputChange('gpa', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jicai-blue" />
                  <div className="flex justify-between mt-2 text-sm text-gray-500"><span>60</span><span className="text-jicai-blue font-bold text-lg">{formData.gpa}</span><span>100</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">您的本科课程与德国目标专业匹配度 (ECTS) 预估</label>
                  <select value={formData.ectsMatch} onChange={(e) => handleInputChange('ectsMatch', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                    <option value="high">极高 (纯本专业直升，课程几乎一致)</option><option value="medium">中等 (同大类，但细分方向有略微差异)</option><option value="low">较低 (跨专业或国内本科严重缺课)</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">注：德国硕士极度看重学分匹配(Modulhandbuch)，跨专业极难。</p>
                </div>
              </>
            ) : (
              formData.highSchoolType === 'gaokao' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">预估高考分数情况 (德国规定：超满分70%可直录)</label>
                  <select value={formData.gaokaoPercent} onChange={(e) => handleInputChange('gaokaoPercent', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                    <option value="over70">稳超 70% (如 750满分考 525以上)</option><option value="under70">不足 70% (可能需读德国预科)</option>
                  </select>
                </div>
              )
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">第三步：语言与附加条件</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">目前德语/英语语言水平</label>
              <select value={formData.language} onChange={(e) => handleInputChange('language', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                <option value="german_c1">德语 C1 / TestDaF 4x4 / DSH-2 (名校直录标准)</option><option value="german_b2">德语 B2</option><option value="german_b1">德语 B1</option><option value="ielts_7">雅思 7.0+ (走英授项目)</option><option value="other">零基础 / 正在学</option>
              </select>
            </div>
            {formData.degree === 'master' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">是否准备考取 GRE / GMAT？</label>
                <div className="flex gap-4">
                  {['yes', 'no'].map((val) => (
                    <button key={val} onClick={() => handleInputChange('hasTest', val)} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${formData.hasTest === val ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                      {val === 'yes' ? '准备/已有成绩' : '不考虑 (避开TUM等)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
               <button onClick={handleGenerate} disabled={loading} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden h-16">
                 {loading ? (
                    <AnimatePresence mode="wait"><motion.span key={loadingStep} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="text-white/90 text-sm md:text-base font-medium">{loadingTexts[loadingStep]}</motion.span></AnimatePresence>
                 ) : '生成专属录取分析报告'}
               </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section id="assessment" className="py-20 bg-jicai-dark relative overflow-hidden">
      {/* 背景特效 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-jicai-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI 智能录取评估系统 2.0</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">内置巴伐利亚换算算法、ECTS学分匹配模型及最新全德高校受限专业(NC)数据库。</p>
          <div className="mt-4 inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300">
            🟢 已有 <span className="text-jicai-blue font-bold">{userCount}</span> 位同学完成了背景测评
          </div>
        </div>

        <div className="bg-jicai-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[450px]">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 md:p-12">
                 
                 {/* 进度条 */}
                 <div className="flex justify-between mb-8 relative">
                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 -translate-y-1/2"></div>
                   <div className="absolute top-1/2 left-0 h-0.5 bg-jicai-blue -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(formWizardStep - 1) * 50}%` }}></div>
                   {[1, 2, 3].map(s => (
                     <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${formWizardStep >= s ? 'bg-jicai-blue border-jicai-blue text-white' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>{s}</div>
                   ))}
                 </div>

                 {/* 表单区域 */}
                 <div className="min-h-[260px]">
                   <AnimatePresence mode="wait">
                     {renderFormStep()}
                   </AnimatePresence>
                 </div>

                 {/* 底部导航 */}
                 {formWizardStep < 3 && !loading && (
                   <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                     <button onClick={prevStep} className={`px-6 py-2 rounded-lg text-sm transition-colors ${formWizardStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>上一步</button>
                     <button onClick={nextStep} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm flex items-center gap-2 transition-colors">下一步 <ChevronRight size={16} /></button>
                   </div>
                 )}
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12">
                
                {/* 报告头部 - 强化巴伐利亚分显示 */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-white/10 pb-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <svg className="w-24 h-24 transform -rotate-90"><circle className="text-gray-700" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" /><circle className="text-jicai-blue" strokeWidth="6" strokeDasharray={276} strokeDashoffset={276 - (276 * (result?.score || 0)) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="44" cx="48" cy="48" /></svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white">{result?.score}</span><span className="text-[10px] text-gray-400">系统综合评分</span></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">诊断报告生成完毕</h3>
                      <p className="text-gray-400 text-sm max-w-sm">{result?.suggestion}</p>
                      {formData.degree === 'master' && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-jicai-blue/10 border border-jicai-blue/30 px-3 py-1 rounded text-xs text-jicai-blue">
                          <span>您的德国巴伐利亚预估均分：</span><span className="font-bold text-lg">{result?.bavarianScoreDisplay}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 多维度诊断雷达与文字分析 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-jicai-blue/50 transition-colors">
                      <h4 className="text-jicai-blue text-sm font-bold mb-2">📚 学术与学分匹配</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">{result?.dimensions.academic}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-jicai-blue/50 transition-colors">
                      <h4 className="text-jicai-blue text-sm font-bold mb-2">🗣️ 语言及附加条件</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">{result?.dimensions.language}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-jicai-blue/50 transition-colors">
                      <h4 className="text-jicai-blue text-sm font-bold mb-2">🎯 风险评估预警</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">{result?.dimensions.strategy}</p>
                   </div>
                </div>

                {/* 核心院校名单 - 新增生活费与学费数据 */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2"><BarChart3 size={20} className="text-jicai-blue" /> 精选匹配院校动态监测</h4>
                  {result?.predictions.map((pred, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">{pred.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${pred.type === 'reach' ? 'border-red-500/50 text-red-400' : pred.type === 'match' ? 'border-blue-500/50 text-blue-400' : 'border-green-500/50 text-green-400'}`}>
                            {pred.type === 'reach' ? '冲刺院校' : pred.type === 'match' ? '核心匹配' : '稳妥保底'}
                          </span>
                        </div>
                        <span className="font-bold text-white">{pred.probability}%</span>
                      </div>
                      
                      {/* 数据条 */}
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3 overflow-hidden">
                        <motion.div animate={{ width: `${pred.probability}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${pred.probability < 40 ? 'bg-red-500' : pred.probability < 70 ? 'bg-jicai-blue' : 'bg-green-500'}`}></motion.div>
                      </div>

                      {/* 留德干货数据：生活费与学费 */}
                      <div className="flex flex-wrap gap-4 mt-2 border-t border-white/5 pt-2">
                         <div className="flex items-center gap-1 text-xs text-gray-400"><Euro size={12} className="text-gray-500"/> 预估生活费: {pred.livingCost}欧/月</div>
                         <div className={`flex items-center gap-1 text-xs ${pred.tuitionFee.includes('免学费') ? 'text-green-400/80' : 'text-orange-400/80'}`}><GraduationCap size={12}/> 政策: {pred.tuitionFee}</div>
                      </div>

                      {/* NC及特殊要求警告 */}
                      {pred.warningMsg && (
                         <div className="mt-2 text-xs text-red-400 flex items-start gap-1 bg-red-900/20 p-2 rounded border border-red-500/30">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" /><span>{pred.warningMsg}</span>
                         </div>
                      )}
                    </div>
                  ))}
                  
                  {/* 营销钩子：隐藏更多学校诱导加微信 */}
                  <div onClick={() => openLeadModal("获取完整版定校清单及详细专业评估")} className="w-full bg-jicai-blue/10 border border-jicai-blue/30 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-jicai-blue/20 transition-all group">
                     <Lock size={20} className="text-jicai-blue mb-2 group-hover:scale-110 transition-transform" />
                     <p className="text-sm text-jicai-blue font-bold">点击解锁剩余 45 所高校申请概率及专属提升方案</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button onClick={() => { setStep('form'); setFormWizardStep(1); setContactSubmitted(false); }} className="text-gray-500 hover:text-white text-sm underline">重新进行背景评估</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 留资弹窗逻辑保持 */}
      <AnimatePresence>
        {showFullReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullReport(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
              <button onClick={() => setShowFullReport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              
              {!contactSubmitted ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">{inquiryContext.includes('清单') ? '获取完整定校清单' : '专属深度咨询'}</h3>
                  <p className="text-gray-600 mb-6 text-sm">由于涉及各大学校最新的录取红线和学分审查，请输入联系方式，专家将针对【{formData.major}】为您发送一对一定制方案。</p>
                  
                  <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号或微信号 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="用于接收评估结果与资料" value={formData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-jicai-blue transition-colors" />
                  </div>
                  
                  <button onClick={submitLead} disabled={isSubmitting} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? '正在安全提交...' : '立即获取完整资料包'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-500" size={32} /></div>
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">预约成功！</h3>
                  <p className="text-gray-600 mb-6 text-sm">您的专属顾问已收到您的学术背景，将为您核对ECTS学分与最新NC限制，并尽快联系您。</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl inline-block mb-4 border border-gray-100">
                    <div className="w-40 h-40 bg-white flex items-center justify-center rounded-lg border border-gray-200 mx-auto p-1">
                       <img src="qrcode.png" alt="WeChat" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500"><p>等不及了？您也可以主动扫码添加顾问</p><p className="font-bold text-jicai-blue">微信: jicaixiaokefu</p></div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
