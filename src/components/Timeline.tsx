import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FileText, CheckCircle2, Clock, Plane, AlertCircle, ChevronDown, ChevronUp, PlayCircle, Calendar } from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  description: string;
  tasks: string[];
  warning?: string;
  interactive?: {
    label: string;
    content: React.ReactNode;
  };
}

export const Timeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('aps');
  const [targetYear, setTargetYear] = useState<string>('2025');
  const [targetTerm, setTargetTerm] = useState<string>('winter'); // winter: 10月开学, summer: 4月开学
  const [showApsSim, setShowApsSim] = useState(false);

  const steps: TimelineStep[] = [
    {
      id: 'language',
      title: '语言冲刺与规划',
      icon: <BookOpen size={24} />,
      color: 'bg-blue-500',
      duration: '提前 12-18 个月',
      description: '无论是德授还是英授，合格的语言成绩是申请的敲门砖。',
      tasks: ['评估当前语言基础', '制定备考计划 (TestDaF / IELTS)', '报名考试并获取证书'],
      warning: '注意：部分大学（如TUM）在网申截止前必须提交合格语言成绩，不接受后补！'
    },
    {
      id: 'aps',
      title: 'APS 审核 (留德核心门槛)',
      icon: <FileText size={24} />,
      color: 'bg-red-500',
      duration: '提前 9-12 个月',
      description: '德国驻华使馆审核部对面谈者的学历真实性及专业匹配度进行面谈考察。',
      tasks: ['准备学历材料并做公证', '在线注册并汇款 2500 RMB', '深度复习大学核心专业课', '前往北京/上海参加 20 分钟面谈'],
      interactive: {
        label: '体验一次 APS 模拟面谈',
        content: (
          <div className="bg-gray-900 rounded-lg p-4 border border-red-500/30">
            <h5 className="text-red-400 font-bold mb-2 flex items-center gap-2"><PlayCircle size={18} /> 考官 (Prüfer) 正在提问：</h5>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="bg-white/5 p-3 rounded">1. Bitte erklären Sie uns, was Sie in dem Kurs "Maschinenbau" gelernt haben? (请解释您在《机械原理》这门课学了什么？)</li>
              <li className="bg-white/5 p-3 rounded">2. Welche Formel haben Sie in Ihrem Experiment verwendet und warum? (您的实验用了什么公式？为什么？)</li>
            </ul>
            <button className="mt-4 w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 py-2 rounded transition-colors text-sm font-bold border border-red-500/50">
              不知道怎么答？获取专业 APS 辅导方案
            </button>
          </div>
        )
      }
    },
    {
      id: 'apply',
      title: '选校、文书与网申',
      icon: <CheckCircle2 size={24} />,
      color: 'bg-purple-500',
      duration: '提前 6-8 个月',
      description: '通过 Uni-assist 或大学自有 Portal 递交申请。德国极度看重文书的严谨性。',
      tasks: ['撰写动机信 (Motivation Letter)', '排版德式简历 (Lebenslauf)', '核心：翻译并优化《课程描述》(Modulhandbuch)', '邮寄纸质材料 (部分学校需要)'],
      warning: '冬季学期(10月开学)的申请季通常在 4月-7月15日！'
    },
    {
      id: 'visa',
      title: '获取 Zu 与递签',
      icon: <Clock size={24} />,
      color: 'bg-orange-500',
      duration: '开学前 2-3 个月',
      description: '收到录取通知书 (Zulassung) 后，开启行前准备。',
      tasks: ['开通 Expatrio/Fintiba 保证金账户 (约11208欧)', '购买 TK/AOK/DAK 德国公立医疗保险', '前往使领馆递签']
    },
    {
      id: 'departure',
      title: '赴德落户与注册',
      icon: <Plane size={24} />,
      color: 'bg-green-500',
      duration: '开学前 1 个月',
      description: '安全抵达德国，开启留学生涯！',
      tasks: ['找房：学生宿舍 (Studentenwerk) 或私房 (WG)', '市政厅落户 (Anmeldung)', '大学线下/线上注册，获取学期票']
    }
  ];

  return (
    <section id="timeline" className="py-24 bg-jicai-black relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 头部标题区 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">全景留德时间轴模拟器</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">德国留学申请是一场严谨的马拉松。选择您的目标入学时间，系统将自动为您倒推关键节点。</p>
          
          {/* 动态时间控制器 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 bg-white/5 inline-flex p-4 rounded-2xl border border-white/10">
             <div className="flex items-center gap-2 text-gray-300">
               <Calendar size={20} className="text-jicai-blue" />
               <span>我的目标是</span>
             </div>
             <select value={targetYear} onChange={(e) => setTargetYear(e.target.value)} className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1.5 outline-none focus:border-jicai-blue">
               <option value="2025">2025 年</option>
               <option value="2026">2026 年</option>
             </select>
             <select value={targetTerm} onChange={(e) => setTargetTerm(e.target.value)} className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1.5 outline-none focus:border-jicai-blue">
               <option value="winter">冬季学期 (10月开学)</option>
               <option value="summer">夏季学期 (4月开学)</option>
             </select>
             <button className="bg-jicai-blue hover:bg-blue-600 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-colors">
               生成专属倒计时
             </button>
          </div>
        </div>

        {/* 交互式沙盘 Timeline */}
        <div className="relative">
          {/* 中心贯穿线 (桌面端) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-800 rounded-full"></div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const isEven = index % 2 === 0;

              return (
                <div key={step.id} className="relative flex flex-col md:flex-row items-center justify-center w-full">
                  
                  {/* 时间节点指示器 (中心) */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10 flex items-center justify-center">
                    <button 
                      onClick={() => setActiveStep(isActive ? '' : step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive ? `${step.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]` : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    >
                      {step.icon}
                    </button>
                  </div>

                  {/* 桌面端布局占位 */}
                  <div className={`hidden md:block w-1/2 ${isEven ? 'pr-16 text-right' : 'pl-16 text-left order-last'}`}>
                     <div className="h-full flex flex-col justify-center">
                        <span className="text-jicai-blue font-bold text-sm tracking-wider">{step.duration}</span>
                        <h3 className={`text-2xl font-bold text-white transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}>{step.title}</h3>
                     </div>
                  </div>

                  {/* 移动端标题显示 */}
                  <div className="md:hidden w-full pl-20 pr-4 mb-2 flex flex-col justify-center min-h-[48px]">
                     <span className="text-jicai-blue font-bold text-xs tracking-wider">{step.duration}</span>
                     <h3 className={`text-xl font-bold text-white ${isActive ? 'opacity-100' : 'opacity-80'}`}>{step.title}</h3>
                  </div>

                  {/* 详细内容展开卡片 */}
                  <div className={`w-full md:absolute md:w-[400px] transition-all duration-500 z-20 ${
                    isActive 
                      ? 'opacity-100 visible md:top-1/2 md:-translate-y-1/2 ' + (isEven ? 'md:left-[calc(50%+4rem)]' : 'md:right-[calc(50%+4rem)]')
                      : 'opacity-0 invisible hidden md:block h-0'
                  }`}>
                    {/* 移动端的边距处理 */}
                    <div className="pl-20 pr-4 md:px-0 md:pt-0">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl"
                      >
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{step.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-white font-bold text-sm mb-2">🎯 关键任务清单：</h4>
                          <ul className="space-y-2">
                            {step.tasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${step.color.replace('bg-', 'bg-')}`}></div>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {step.warning && (
                          <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg flex items-start gap-2 mb-4">
                            <AlertCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-orange-200">{step.warning}</p>
                          </div>
                        )}

                        {step.interactive && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <button 
                              onClick={() => setShowApsSim(!showApsSim)}
                              className="w-full flex items-center justify-between text-sm font-bold text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                            >
                              {step.interactive.label}
                              {showApsSim ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                              {showApsSim && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: 'auto', opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-3"
                                >
                                  {step.interactive.content}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
