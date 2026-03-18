import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, Users, ChevronDown, ChevronUp, PlayCircle, Lightbulb } from 'lucide-react';

// === APS 模拟器题库配置 ===
const APS_QUESTIONS: Record<string, {text: string, type: string, hint: string}[]> = {
  '机械工程': [
    { text: "请解释您在《机械原理》这门课中学到的四连杆机构，并举例说明。", type: "专业核心课", hint: "提示：曲柄摇杆机构、双曲柄机构、双摇杆机构等" },
    { text: "什么是应力和应变？它们之间的关系是什么？", type: "材料力学", hint: "提示：胡克定律 (Hooke's Law)" }
  ],
  '计算机': [
    { text: "请解释面向对象编程(OOP)的三大基本特性。", type: "编程基础", hint: "提示：封装 (Encapsulation)、继承 (Inheritance)、多态 (Polymorphism)" },
    { text: "什么是快速排序(Quick Sort)？它的平均时间复杂度是多少？", type: "数据结构与算法", hint: "提示：分治法，平均时间复杂度 O(n log n)" }
  ],
  '商科/经济学': [
    { text: "请解释微观经济学中的供需法则 (Law of Supply and Demand)。", type: "经济学基础", hint: "提示：价格上升需求下降，价格上升供给上升" },
    { text: "资产负债表(Balance Sheet)包含哪三个核心部分？", type: "会计学", hint: "提示：资产(Assets) = 负债(Liabilities) + 所有者权益(Equity)" }
  ],
  '电气工程': [
    { text: "请解释欧姆定律，并说明它在电路设计中的实际应用。", type: "电路基础", hint: "提示：U = I * R" },
    { text: "什么是交流电和直流电？各举一个工程应用场景。", type: "电学基础", hint: "提示：直流(DC) vs 交流(AC)" },
    { text: "请解释傅里叶变换在信号处理中的意义。", type: "信号系统", hint: "提示：将时域信号分解为不同频率的频域成分" }
  ],
  '化学/材料': [
    { text: "请解释化学键的类型（离子键、共价键、金属键），并举例。", type: "基础化学", hint: "提示：NaCl, H2O, Fe" },
    { text: "什么是摩尔(mol)？如何计算18g水中的分子数？", type: "化学计算", hint: "提示：1 mol = 6.02 x 10^23" },
    { text: "解释什么是材料的硬度和韧性，两者是否可以同时提高？", type: "材料科学", hint: "提示：硬度=抵抗变形，韧性=吸收能量" }
  ]
};

const timelines = {
  highschool: [
    { time: "阶段一", title: "语言与高考规划", desc: "开始德语初级学习。准备高考（达到满分70%可直申，否则需走预科路线）。" },
    { time: "阶段二", title: "APS审核与预科申请", desc: "参加留德人员审核部（APS）高中生程序审核，申请德国大学预科（Studienkolleg）及预科入学考试（Aufnahmeprüfung）。" },
    { time: "阶段三", title: "赴德就读预科", desc: "通过考试后，在德国进行为期一年的预科学习（T-Kurs/M-Kurs/W-Kurs等）。" },
    { time: "阶段四", title: "FSP结业与大学录取", desc: "通过预科结业考试（FSP），凭FSP成绩和高考成绩正式申请并入读德国大学本科。" }
  ],
  bachelor: [
    { time: "阶段一", title: "背景提升与语言", desc: "保持大学在校GPA（建议80分以上），系统学习德语或雅思，准备相关实习经历。" },
    { time: "阶段二", title: "APS面谈审核", desc: "完成6个学期后，准备材料并参加APS面谈审核，获取APS证书（留德最重要通行证）。", hasApsSim: true },
    { time: "阶段三", title: "Uni-assist 递交申请", desc: "通过Uni-assist或大学官网系统递交网申，撰写动机信(Motivation Letter)和个人简历(CV)。" },
    { time: "阶段四", title: "获签与注册报到", desc: "收到录取通知书（Zu），办理自保金冻结，递交签证。赴德完成落户、保险及大学注册。" }
  ],
  master: [
    { time: "阶段一", title: "学分匹配与定位", desc: "德国硕士极看重本科课程匹配度（Modulhandbuch）。根据目标院校要求调整大三/大四选课。" },
    { time: "阶段二", title: "APS面谈审核与标化", desc: "通过APS面谈。冲击TU9需考出德语TestDaF（通常4x4）或雅思6.5-7.0，部分商科需GMAT。", hasApsSim: true },
    { time: "阶段三", title: "多通道网申", desc: "制作高标准的文书，通过Uni-assist、VPD或Vorspann系统递交申请，准备可能出现的入学面试。" },
    { time: "阶段四", title: "签证与启程", desc: "拿到Master录取，办理德意志银行/Fintiba自保金，递签，预定学生宿舍（Studentenwerk）。" }
  ]
};

export const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highschool' | 'bachelor' | 'master'>('master');
  const [targetTerm, setTargetTerm] = useState<'winter' | 'summer'>('winter');
  
  // APS 模拟器状态
  const [showApsSim, setShowApsSim] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState('电气工程');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const tabs = [
    { id: 'highschool', label: '高中生 / 预科', icon: <BookOpen size={16} /> },
    { id: 'bachelor', label: '本科申请', icon: <Users size={16} /> },
    { id: 'master', label: '硕士申请', icon: <GraduationCap size={16} /> }
  ];

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter(i => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  return (
    <section id="timeline" className="py-20 bg-jicai-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专属留学时间规划与模拟</h2>
          <p className="text-gray-400 mb-6">德国申请极其严谨，请选择您的当前阶段及目标学期查看详细步骤</p>
          
          {/* 🌟 新增：学期切换器 */}
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setTargetTerm('winter')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${targetTerm === 'winter' ? 'bg-jicai-blue text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              冬季学期 (10月开学)
            </button>
            <button 
              onClick={() => setTargetTerm('summer')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${targetTerm === 'summer' ? 'bg-jicai-blue text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              夏季学期 (4月开学) <span className="text-[10px] font-normal bg-white/20 px-1.5 py-0.5 rounded">仅部分开放</span>
            </button>
          </div>
        </div>

        {/* 🌟 阶段标签切换器 */}
        <div className="flex justify-center mb-16">
          <div className="bg-jicai-dark p-1 rounded-xl flex border border-white/10 flex-wrap justify-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setShowApsSim(false); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-jicai-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* 中心时间线 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-jicai-blue/50 via-white/10 to-transparent hidden md:block"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + targetTerm}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {timelines[activeTab].map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-5/12"></div>
                  
                  <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-jicai-dark border-4 border-jicai-blue shadow-[0_0_15px_rgba(37,99,235,0.5)] shrink-0 my-4 md:my-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>

                  <div className="w-full md:w-5/12 bg-jicai-dark p-8 rounded-2xl border border-white/5 hover:border-jicai-blue/50 transition-all shadow-lg hover:shadow-jicai-blue/10 group relative">
                    <span className="text-jicai-blue text-xs font-bold uppercase tracking-wider bg-jicai-blue/10 px-3 py-1 rounded-full">{step.time}</span>
                    <h3 className="text-xl font-bold text-white mt-4 mb-3 group-hover:text-jicai-blue transition-colors">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    
                    {/* 🌟 融合进来的 APS 模拟器 */}
                    {(step as any).hasApsSim && (
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <button 
                          onClick={() => setShowApsSim(!showApsSim)}
                          className="w-full flex items-center justify-between text-sm font-bold text-jicai-blue bg-jicai-blue/10 hover:bg-jicai-blue/20 border border-jicai-blue/30 px-4 py-3 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-2"><PlayCircle size={18} /> 体验 APS 考官模拟面谈</span>
                          {showApsSim ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        <AnimatePresence>
                          {showApsSim && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-4"
                            >
                              <div className="bg-gray-900 rounded-xl p-5 border border-white/10">
                                <label className="block text-xs font-bold text-gray-400 mb-2">选择你的专业以生成真题：</label>
                                <select 
                                  value={selectedMajor} 
                                  onChange={(e) => {setSelectedMajor(e.target.value); setRevealedHints([]);}}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-jicai-blue mb-4"
                                >
                                  {Object.keys(APS_QUESTIONS).map(major => (
                                    <option key={major} value={major}>{major}</option>
                                  ))}
                                </select>

                                <div className="space-y-4">
                                  <h5 className="text-red-400 font-bold text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Prüfer (考官) 提问中：</h5>
                                  {APS_QUESTIONS[selectedMajor].slice(0, 2).map((q, qIndex) => (
                                    <div key={qIndex} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 mb-2 inline-block">{q.type}</span>
                                      <p className="text-sm text-gray-200 mb-3">{q.text}</p>
                                      
                                      <button 
                                        onClick={() => toggleHint(qIndex)}
                                        className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                                      >
                                        <Lightbulb size={12} /> {revealedHints.includes(qIndex) ? '隐藏解题思路' : '查看解题思路'}
                                      </button>
                                      
                                      {revealedHints.includes(qIndex) && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded">
                                          {q.hint}
                                        </motion.div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
                                <button onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })} className="mt-4 w-full bg-white/5 hover:bg-white/10 text-gray-300 py-2.5 rounded-lg transition-colors text-xs font-bold border border-white/10">
                                  感觉吃力？预约专家获取定制APS辅导
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
