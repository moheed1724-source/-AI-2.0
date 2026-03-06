import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateScore, UserInput, AssessmentResult } from '../utils/scoring';
import { CheckCircle, AlertCircle, Lock, X } from 'lucide-react';

export const AssessmentSection: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const [formData, setFormData] = useState<UserInput>({
    degree: 'master',
    gpa: 85,
    language: 'german_b2',
    major: '机械工程',
    background: '211',
    city: '不限'
  });

  const handleInputChange = (field: keyof UserInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const scoreResult = calculateScore(formData);
      setResult(scoreResult);
      setLoading(false);
      setStep('result');
    }, 1500); // Simulate AI processing time
  };

  return (
    <section id="assessment" className="py-20 bg-jicai-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-jicai-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            AI 智能评估系统
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            基于大数据算法，3分钟精准预测您的德国名校录取概率
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto bg-jicai-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">申请学位</label>
                      <div className="flex gap-4">
                        {['bachelor', 'master'].map((type) => (
                          <button
                            key={type}
                            onClick={() => handleInputChange('degree', type)}
                            className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                              formData.degree === type 
                                ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {type === 'bachelor' ? '本科 (Bachelor)' : '硕士 (Master)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">平均分 (GPA/100)</label>
                      <input 
                        type="range" 
                        min="60" 
                        max="100" 
                        value={formData.gpa} 
                        onChange={(e) => handleInputChange('gpa', parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-jicai-blue"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>60</span>
                        <span className="text-jicai-blue font-bold text-lg">{formData.gpa}</span>
                        <span>100</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">院校背景</label>
                      <select 
                        value={formData.background}
                        onChange={(e) => handleInputChange('background', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors"
                      >
                        <option value="985">985 院校</option>
                        <option value="211">211 院校</option>
                        <option value="tier1">普通一本</option>
                        <option value="tier2">二本及其他</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">目标专业</label>
                      <select 
                        value={formData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors"
                      >
                        <option value="机械工程">机械工程</option>
                        <option value="计算机">计算机科学</option>
                        <option value="电气工程">电气工程</option>
                        <option value="商科">商科/管理</option>
                        <option value="经济学">经济学</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">语言水平</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jicai-blue transition-colors"
                      >
                        <option value="german_c1">德语 TestDaF 4x4 / C1</option>
                        <option value="german_b2">德语 B2</option>
                        <option value="german_b1">德语 B1</option>
                        <option value="ielts_7">雅思 7.0+</option>
                        <option value="ielts_6.5">雅思 6.5</option>
                        <option value="other">其他 / 暂无</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">意向城市</label>
                      <div className="flex flex-wrap gap-2">
                        {['不限', '慕尼黑', '柏林', '亚琛'].map((city) => (
                          <button
                            key={city}
                            onClick={() => handleInputChange('city', city)}
                            className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                              formData.city === city 
                                ? 'bg-jicai-blue/20 border-jicai-blue text-jicai-blue' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-jicai-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        正在AI运算中...
                      </>
                    ) : (
                      '生成 AI 评估报告'
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12"
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-jicai-blue mb-4 relative">
                    <span className="text-4xl font-bold text-white">{result?.score}</span>
                    <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">AI Score</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">申请竞争力评估</h3>
                  <p className="text-gray-400 mt-2">{result?.suggestion}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Reach */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-red-400">
                      <AlertCircle size={20} />
                      <span className="font-bold uppercase tracking-wider text-sm">冲刺院校</span>
                    </div>
                    <ul className="space-y-2">
                      {result?.reach.map((uni, i) => (
                        <li key={i} className="text-white font-medium">{uni}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Match */}
                  <div className="bg-jicai-blue/10 border border-jicai-blue/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-jicai-blue">
                      <CheckCircle size={20} />
                      <span className="font-bold uppercase tracking-wider text-sm">匹配院校</span>
                    </div>
                    <ul className="space-y-2">
                      {result?.match.map((uni, i) => (
                        <li key={i} className="text-white font-medium">{uni}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-green-400">
                      <CheckCircle size={20} />
                      <span className="font-bold uppercase tracking-wider text-sm">保底院校</span>
                    </div>
                    <ul className="space-y-2">
                      {result?.safety.map((uni, i) => (
                        <li key={i} className="text-white font-medium">{uni}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Lock className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">解锁完整留学方案</h4>
                      <p className="text-gray-400 text-sm">查看详细录取概率分析 + 真实成功案例 + 个性化选校建议</p>
                    </div>
                    <button 
                      onClick={() => setShowFullReport(true)}
                      className="bg-white text-jicai-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      获取完整报告
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setStep('form')}
                    className="text-gray-500 hover:text-white text-sm underline"
                  >
                    重新评估
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Conversion Popup */}
      <AnimatePresence>
        {showFullReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullReport(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowFullReport(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-jicai-black mb-2">获取完整留学方案</h3>
                <p className="text-gray-600 mb-6">扫码添加顾问，免费获取详细报告</p>
                
                <div className="bg-gray-100 p-4 rounded-xl inline-block mb-4">
                  {/* Placeholder for QR Code */}
                  <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg border border-gray-200">
                     <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://u.wechat.com/EAvk-7_777777" 
                        alt="WeChat QR Code" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                     />
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-bold text-jicai-blue">微信: jicaixiaokefu</p>
                  <p>邮箱: yujin@landwave.cn</p>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg">
                  <p>提示：扫码备注"AI评估"优先获取服务</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
