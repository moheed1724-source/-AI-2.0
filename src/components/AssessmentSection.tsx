import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateScore, UserInput, AssessmentResult } from '../utils/scoring';
import { Lock, X, CheckCircle, AlertTriangle, Crosshair, Award, ShieldAlert, ChevronRight } from 'lucide-react';

export const AssessmentSection: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showFullReport, setShowFullReport] = useState(false);
  const [inquiryContext, setInquiryContext] = useState("获取完整评估报告"); 
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [formData, setFormData] = useState<UserInput & { contact: string }>({
    degree: 'master', gpa: 85, langType: 'none', major: '机械工程', background: '211', hasTest: 'no', 
    highSchoolType: 'gaokao', highSchoolScore: 'good', contact: '', province: 'other'
  });

  const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const loadingTexts = ["建立专属学术背景画像...", "正在调用巴伐利亚转换算法...", "全量检索 TU9 与精英大学核心库...", "生成济才多维录取诊断与专家意见..."];

  const handleGenerate = () => {
    setLoading(true); setLoadingStep(0);
    let currentStep = 0;
    const interval = setInterval(() => { currentStep += 1; if (currentStep < 4) setLoadingStep(currentStep); }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      try {
        setResult(calculateScore(formData as UserInput));
        setStep('result');
      } catch (error) { console.error("计算出错", error); }
      setLoading(false); 
    }, 6500); 
  };

  const openLeadModal = (context: string) => { setInquiryContext(context); setShowFullReport(true); };

  const submitLead = async () => {
    if (!formData.contact) return alert("请输入手机/微信号！");
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ access_key: "a531da67-7614-4c7b-992d-e87c02d63ac2", '咨询意向': inquiryContext, '联系方式': formData.contact, '专业': formData.major })
      });
      if (response.ok) setContactSubmitted(true);
    } catch (error) { console.error(error); }
    setIsSubmitting(false);
  };

  return (
    <section id="assessment" className="py-20 bg-jicai-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-jicai-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI 智能评估系统 V3.0</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">直连德国 TU9 与精英大学最新数据库，生成专业级留德规划诊断书</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-jicai-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* ====== 左侧 ====== */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">申请阶段</label>
                      <div className="flex gap-4">
                        {['bachelor', 'master'].map((type) => (
                          <button key={type} onClick={() => handleInputChange('degree', type)} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${formData.degree === type ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                            {type === 'bachelor' ? '本科 (Bachelor)' : '硕士 (Master)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.degree === 'master' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">国内均分 (GPA/100)</label>
                          <input type="range" min="60" max="100" value={formData.gpa} onChange={(e) => handleInputChange('gpa', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jicai-blue" />
                          <div className="flex justify-between mt-2 text-sm text-gray-500"><span>60</span><span className="text-jicai-blue font-bold text-lg">{formData.gpa}</span><span>100</span></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">国内院校层级</label>
                          <select value={formData.background} onChange={(e) => handleInputChange('background', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                            <option value="985">985 院校</option><option value="211">211 院校</option><option value="tier1">普通一本</option><option value="tier2">二本及其他</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">课程体系</label>
                          <select value={formData.highSchoolType} onChange={(e) => handleInputChange('highSchoolType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                            <option value="gaokao">普通高中 (走高考程序)</option><option value="AL">A-Level 课程</option><option value="IB">IB 课程</option><option value="AP">AP 课程</option>
                          </select>
                        </div>
                        {formData.highSchoolType === 'gaokao' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">预估/真实高考总分</label>
                            <input type="number" min="200" max="900" value={formData.gaokaoScore || ''} onChange={(e) => handleInputChange('gaokaoScore', parseInt(e.target.value) || undefined)} placeholder="输入分数, 如 588" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors" />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">预估水平</label>
                            <select value={formData.highSchoolScore} onChange={(e) => handleInputChange('highSchoolScore', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                              <option value="excellent">拔尖 (牛剑/藤校水平)</option><option value="good">良好</option><option value="average">中等 (可能需预科)</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* ====== 右侧 ====== */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">目标大类方向</label>
                      <select value={formData.major} onChange={(e) => handleInputChange('major', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors">
                        <option value="机械工程">机械工程</option><option value="计算机">计算机科学</option><option value="电气工程">电气工程</option><option value="商科">商科/管理</option><option value="经济学">经济学</option>
                      </select>
                    </div>

                    {/* 🌟 全新精细化语言表单 */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <label className="block text-sm font-bold text-white mb-3">语言准备通道设定</label>
                      <div className="flex gap-2 mb-4">
                        <button onClick={() => handleInputChange('langType', 'de')} className={`flex-1 py-2 rounded-lg border text-sm transition-all ${formData.langType === 'de' ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'border-white/10 text-gray-400'}`}>德语通道</button>
                        <button onClick={() => handleInputChange('langType', 'en')} className={`flex-1 py-2 rounded-lg border text-sm transition-all ${formData.langType === 'en' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-400'}`}>全英通道</button>
                        <button onClick={() => handleInputChange('langType', 'none')} className={`flex-1 py-2 rounded-lg border text-sm transition-all ${formData.langType === 'none' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-gray-400'}`}>暂无成绩</button>
                      </div>

                      {formData.langType === 'en' && (
                        <select value={formData.ieltsScore} onChange={(e) => handleInputChange('ieltsScore', e.target.value)} className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                          <option value="">选择雅思/托福等价分数段</option>
                          <option value="7.5">雅思 7.5 及以上</option><option value="7.0">雅思 7.0 (多数TU9英授底线)</option><option value="6.5">雅思 6.5</option><option value="6.0">雅思 6.0 及以下</option>
                        </select>
                      )}
                      {formData.langType === 'de' && (
                        <select value={formData.germanScore} onChange={(e) => handleInputChange('germanScore', e.target.value)} className="w-full bg-black/30 border border-jicai-blue/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-jicai-blue">
                          <option value="">选择德语考试类型与分数</option>
                          <option value="testdaf_16">德福 TestDaF 16分以上 (4x4等)</option><option value="dsh_2">DSH 2 / DSH 3</option><option value="goethe_c1">歌德 C1 / C2</option>
                          <option value="testdaf_14">德福 TestDaF 14-15分</option><option value="goethe_b2">歌德 B2</option><option value="goethe_b1">歌德 B1 及以下 (需语言班)</option>
                        </select>
                      )}
                    </div>

                    {formData.degree === 'master' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">是否具备标化成绩 (GRE/GMAT)？</label>
                          <div className="flex gap-4">
                            {['yes', 'no'].map((val) => (
                              <button key={val} onClick={() => handleInputChange('hasTest', val)} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${formData.hasTest === val ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                {val === 'yes' ? '是 (有成绩)' : '否 (暂无)'}
                              </button>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
                <div className="mt-10">
                  <button onClick={handleGenerate} disabled={loading} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden h-16">
                    {loading ? (
                       <AnimatePresence mode="wait"><motion.span key={loadingStep} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="text-white/90 font-medium">{loadingTexts[loadingStep]}</motion.span></AnimatePresence>
                    ) : '开始深度诊断并获取专家方案'}
                  </button>
                </div>
              </motion.div>
            ) : (
              // 🌟 结果页：左右双栏布局
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* ⬅️ 左侧：硬件判定与院校清单 (占2份宽度) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-jicai-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">您的基础硬件体检单</h3>
                    
                    {/* GPA 和 APS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 border border-jicai-blue/30 rounded-xl p-4">
                        <h4 className="text-jicai-blue text-sm font-bold mb-2">🎓 预估德国 GPA (巴伐利亚算法)</h4>
                        <div className="text-3xl font-bold text-white mb-1">{result?.bavarianScoreDisplay}</div>
                      </div>
                      <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4">
                        <h4 className="text-purple-400 text-sm font-bold mb-2">🛡️ 留德 APS 审核通行证预测</h4>
                        <div className="text-lg font-bold text-white mb-1">{result?.apsPrediction.split(' ')[0]}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{result?.apsPrediction.substring(result?.apsPrediction.indexOf('(') || 0)}</p>
                      </div>
                    </div>

                    {/* 维度诊断 */}
                    <div className="space-y-3 mb-8">
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5"><h4 className="text-white text-sm font-bold mb-1">📚 学术竞争力</h4><p className="text-gray-400 text-sm">{result?.dimensions.academic}</p></div>
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5"><h4 className="text-white text-sm font-bold mb-1">🗣️ 语言与通道判定</h4><p className="text-gray-400 text-sm">{result?.dimensions.language}</p></div>
                    </div>

                    <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Crosshair size={20} className="text-jicai-blue" /> 精选 TU9/精英大学 匹配测算</h4>
                    
                    {/* 院校卡片列表 */}
                    <div className="space-y-4">
                      {result?.predictions.map((pred: any, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-jicai-blue/50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-lg">{pred.name}</span>
                              {pred.isTU9 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-jicai-blue/20 text-jicai-blue border border-jicai-blue/30">TU9</span>}
                              {pred.isExcellence && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">精英大学</span>}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <span>竞争烈度:</span>
                              <span className="text-orange-500 flex">{Array.from({ length: pred.difficultyStars }).map((_, idx) => (<svg key={idx} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pred.badges.map((badge: any, bIdx: number) => (
                              <div key={bIdx} className={`text-xs px-2 py-1 rounded border ${badge.status === 'pass' ? 'bg-green-500/10 border-green-500/30 text-green-400' : badge.status === 'warn' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400 font-bold'}`}>{badge.text}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ➡️ 右侧：悬浮的济才专家专属建议区 (占1份宽度) */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-gradient-to-b from-jicai-blue/10 to-transparent border border-jicai-blue/30 rounded-2xl p-6 shadow-2xl shadow-jicai-blue/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-jicai-blue/20 pb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-jicai-blue bg-white flex-shrink-0">
                         <img src="teacher.jpg" alt="济才专家" className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src='https://ui-avatars.com/api/?name=专家&background=0D8ABC&color=fff'}}/>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{result?.jicaiAdvice.title}</h3>
                        <p className="text-xs text-jicai-blue">专属规划师深度批注</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {result?.jicaiAdvice.points.map((point, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <ChevronRight className="text-jicai-blue shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                      <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-2"><ShieldAlert size={16} /> 高危截流点提示</h4>
                      <p className="text-xs text-gray-400">系统显示您的本科 ECTS 学分模块未经人工核对。德国院校实行严苛的学分直录制度，硬件分数再高，缺核心学分照样拒录。</p>
                    </div>

                    <button onClick={() => openLeadModal("获取人工ECTS对齐与专属突围方案")} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2">
                      <Award size={20} /> {result?.jicaiAdvice.CTA}
                    </button>
                    
                    <button onClick={() => { setStep('form'); setContactSubmitted(false); }} className="w-full mt-4 py-2 text-gray-500 hover:text-white text-sm transition-colors border border-transparent hover:border-white/10 rounded-lg">
                      返回修改硬件参数
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 留资弹窗模块保持原样 */}
      <AnimatePresence>
        {showFullReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullReport(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
              <button onClick={() => setShowFullReport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              {!contactSubmitted ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">获取专家定制方案</h3>
                  <p className="text-gray-600 mb-6 text-sm">请输入联系方式，专属规划师将针对您的硬件出具【人工学分评估报告】。</p>
                  <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号或微信号 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="用于接收资料与规划" value={formData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-jicai-blue transition-colors" />
                  </div>
                  <button onClick={submitLead} disabled={isSubmitting} className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? '正在安全提交...' : '立即预约专家评估'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-500" size={32} /></div>
                  <h3 className="text-2xl font-bold text-jicai-black mb-2">预约已成功！</h3>
                  <p className="text-gray-600 mb-6 text-sm">济才专家团队已收到您的测算数据，将尽快联系您出具人工分析报告。</p>
                  <div className="bg-gray-50 p-4 rounded-xl inline-block mb-4 border border-gray-100">
                    <div className="w-40 h-40 bg-white flex items-center justify-center rounded-lg border border-gray-200 mx-auto">
                       <img src="qrcode.png" alt="WeChat" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500"><p>您也可以主动扫码添加顾问</p><p className="font-bold text-jicai-blue">微信: jicaixiaokefu</p></div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
