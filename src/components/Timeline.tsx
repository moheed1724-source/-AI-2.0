import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, Users, ChevronDown, ChevronUp, PlayCircle, Lightbulb, CalendarDays, Loader2 } from 'lucide-react';

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
    { title: "语言与高考规划", desc: "开始德语初级学习。准备高考（达到满分70%可直申，否则需走预科路线）。" },
    { title: "APS审核与预科申请", desc: "参加留德人员审核部（APS）高中生程序审核，申请德国大学预科（Studienkolleg）及预科入学考试。" },
    { title: "赴德就读预科", desc: "通过考试后，在德国进行为期一年的预科学习（T-Kurs/M-Kurs/W-Kurs等）。" },
    { title: "FSP结业与大学录取", desc: "通过预科结业考试（FSP），凭FSP成绩和高考成绩正式申请并入读德国大学本科。" }
  ],
  bachelor: [
    { title: "背景提升与语言", desc: "保持大学在校GPA（建议80分以上），系统学习德语或雅思，准备相关实习经历。" },
    { title: "APS面谈审核", desc: "完成6个学期后，准备材料并参加APS面谈审核，获取APS证书（留德最重要通行证）。", hasApsSim: true },
    { title: "Uni-assist 递交申请", desc: "通过Uni-assist或大学官网系统递交网申，撰写动机信(Motivation Letter)和个人简历(CV)。" },
    { title: "获签与注册报到", desc: "收到录取通知书（Zu），办理自保金冻结，递交签证。赴德完成落户、保险及大学注册。" }
  ],
  master: [
    { title: "学分匹配与定位", desc: "德国硕士极看重本科课程匹配度（Modulhandbuch）。根据目标院校要求调整大三/大四选课。" },
    { title: "APS面谈审核与标化", desc: "通过APS面谈。冲击TU9需考出德语TestDaF（通常4x4）或雅思6.5-7.0，部分商科需GMAT。", hasApsSim: true },
    { title: "多通道网申", desc: "制作高标准的文书，通过Uni-assist、VPD或Vorspann系统递交申请，准备可能出现的入学面试。" },
    { title: "签证与启程", desc: "拿到Master录取，办理德意志银行/Fintiba自保金，递签，预定学生宿舍（Studentenwerk）。" }
  ]
};

export const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highschool' | 'bachelor' | 'master'>('master');
  
  // 核心交互状态
  const [targetYear, setTargetYear] = useState<number>(2027); // 默认修正为2027年
  const [targetTerm, setTargetTerm] = useState<'winter' | 'summer'>('winter');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedDates, setCalculatedDates] = useState<string[] | null>(null);
  
  // APS模拟器状态
  const [showApsSim, setShowApsSim] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState('电气工程');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  // 动态日期计算引擎
  const calculateTimelineDates = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // 德国开学时间：冬季为10月，夏季为4月
      const startMonth = targetTerm === 'winter' ? 10 : 4;
      const startDate = new Date(targetYear, startMonth - 1, 1);
      
      const formatData = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月`;
      const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

      // 倒推四个核心阶段的时间区间
      const stage1 = `${formatData(addMonths(startDate, -18))} - ${formatData(addMonths(startDate, -12))}`;
      const stage2 = `${formatData(addMonths(startDate, -12))} - ${formatData(addMonths(startDate, -8))}`;
      const stage3 = `${formatData(addMonths(startDate, -8))} - ${formatData(addMonths(startDate, -5))}`;
      const stage4 = `${formatData(addMonths(startDate, -3))} - ${formatData(addMonths(startDate, -1))}`;
      
      setCalculatedDates([stage1, stage2, stage3, stage4]);
      setIsCalculating(false);
    }, 1200); // 模拟运算延迟，增加真实感
  };

  const tabs = [
    { id: 'highschool', label: '高中生 / 预科', icon: <BookOpen size={16} /> },
    { id: 'bachelor', label: '本科申请', icon: <Users size={16} /> },
    { id: 'master', label: '硕士申请', icon: <GraduationCap size={16} /> }
  ];

  const defaultStageNames = ["早期储备阶段", "核心考核阶段", "冲刺网申阶段", "行前准备阶段"];

  return (
    <section id="timeline" className="py-20 bg-jicai-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">留德时间轴动态推演</h2>
          <p className="text-gray-400 mb-8">选择您的目标入学年份与学期，系统将为您逆推每个关键节点的死线（Deadline）</p>
          
          {/* 交互式时间选择面板 */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl inline-flex flex-col md:flex-row items-center gap-4 shadow-xl">
             <div className="flex items-center gap-2 text-gray-300">
                <CalendarDays className="text-jicai-blue" size={20} /> 目标入学：
             </div>
             
             <div className="flex gap-2">
               <select 
                 value={targetYear} 
                 onChange={(e) => {setTargetYear(Number(e.target.value)); setCalculatedDates(null);}}
                 className="bg-jicai-dark text-white border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-jicai-blue"
               >
                 <option value={2027}>2027 年</option>
                 <option value={2028}>2028 年</option>
                 <option value={2029}>2029 年</option>
               </select>
               
               <select 
                 value={targetTerm} 
                 onChange={(e) => {setTargetTerm(e.target.value as any); setCalculatedDates(null);}}
                 className="bg-jicai-dark text-white border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-jicai-blue"
               >
                 <option value="winter">冬季 (10月开学)</option>
                 <option value="summer">夏季 (4月开学)</option>
               </select>
             </div>

             <button 
                onClick={calculateTimelineDates}
                disabled={isCalculating}
                className="bg-jicai-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center min-w-[160px]"
             >
                {isCalculating ? <Loader2 className="animate-spin" size={20} /> : '生成专属倒计时'}
             </button>
          </div>
        </div>

        {/* 阶段标签切换器 */}
        <div className="flex justify-center mb-12">
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

        {/* 稳固的左侧主轴线布局 (防重叠设计) */}
        <div className="relative pl-4 md:pl-8">
          {/* 左侧贯穿线条 */}
          <div className="absolute left-[35px] md:left-[51px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-jicai-blue via-jicai-blue/50 to-transparent"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {timelines[activeTab].map((step, index) => (
                <div key={index} className="relative flex items-start gap-6 group">
                  
                  {/* 时间节点圈 */}
                  <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-jicai-dark border-4 border-jicai-blue shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white font-bold text-sm md:text-base">{index + 1}</span>
                  </div>

                  {/* 内容卡片 */}
                  <div className="flex-1 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors shadow-lg">
                    {/* 日期/阶段标识头 */}
                    <div className="inline-block bg-jicai-blue/20 text-jicai-blue border border-jicai-blue/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4">
                      {calculatedDates ? calculatedDates[index] : defaultStageNames[index]}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-jicai-blue transition-colors">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    
                    {/* APS 模拟器注入 */}
                    {(step as any).hasApsSim && (
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <button 
                          onClick={() => setShowApsSim(!showApsSim)}
                          className="w-full flex items-center justify-between text-sm font-bold text-white bg-jicai-blue/80 hover:bg-jicai-blue px-4 py-3 rounded-xl transition-all shadow-lg"
                        >
                          <span className="flex items-center gap-2"><PlayCircle size={18} /> 开启 APS 考官全真模拟面谈</span>
                          {showApsSim ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        
                        <AnimatePresence>
                          {showApsSim && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-4"
                            >
                              <div className="bg-gray-900 rounded-xl p-5 border border-white/10 shadow-inner">
                                <label className="block text-xs font-bold text-gray-400 mb-2">选择您的专业方向获取真实题库：</label>
                                <select 
                                  value={selectedMajor} 
                                  onChange={(e) => {setSelectedMajor(e.target.value); setRevealedHints([]);}}
                                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-jicai-blue mb-5"
                                >
                                  {Object.keys(APS_QUESTIONS).map(major => (
                                    <option key={major} value={major}>{major}</option>
                                  ))}
                                </select>

                                <div className="space-y-4">
                                  <h5 className="text-red-400 font-bold text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Prüfer (德国考官) 正在向你提问：</h5>
                                  {APS_QUESTIONS[selectedMajor].slice(0, 2).map((q, qIndex) => (
                                    <div key={qIndex} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 mb-2 inline-block">{q.type}</span>
                                      <p className="text-sm text-gray-200 mb-3 leading-relaxed">{q.text}</p>
                                      
                                      <button 
                                        onClick={() => {
                                          if (revealedHints.includes(qIndex)) setRevealedHints(revealedHints.filter(i => i !== qIndex));
                                          else setRevealedHints([...revealedHints, qIndex]);
                                        }}
                                        className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                                      >
                                        <Lightbulb size={12} /> {revealedHints.includes(qIndex) ? '隐藏专家破题思路' : '查看专家破题思路'}
                                      </button>
                                      
                                      {revealedHints.includes(qIndex) && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-yellow-600 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                          {q.hint}
                                        </motion.div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
                                <button onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })} className="mt-5 w-full bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl transition-colors text-xs font-bold border border-white/10">
                                  感觉吃力？预约专家获取定制 APS 辅导方案
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
