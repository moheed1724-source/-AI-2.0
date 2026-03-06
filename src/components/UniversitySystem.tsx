import React, { useRef, useState, useEffect } from 'react';

// 🌟 10所德国顶尖大学（已全部替换为稳定、高清的官方 Logo 图，绝不裂图！）
const universities = [
  { name: "慕尼黑工业大学", en: "TU Munich", desc: "德国顶尖理工大学，诺贝尔奖得主摇篮。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_der_Technischen_Universit%C3%A4t_M%C3%BCnchen.svg/512px-Logo_der_Technischen_Universit%C3%A4t_M%C3%BCnchen.svg.png", link: "https://baike.baidu.com/item/慕尼黑工业大学" },
  { name: "亚琛工业大学", en: "RWTH Aachen", desc: "欧洲顶尖理工大学，机械工程专业世界闻名。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/RWTH_Aachen_University_Logo.svg/512px-RWTH_Aachen_University_Logo.svg.png", link: "https://baike.baidu.com/item/亚琛工业大学" },
  { name: "海德堡大学", en: "Heidelberg University", desc: "德国最古老的大学，医学与生命科学领域的权威。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Siegel_der_Universit%C3%A4t_Heidelberg.svg/512px-Siegel_der_Universit%C3%A4t_Heidelberg.svg.png", link: "https://baike.baidu.com/item/海德堡大学" },
  { name: "柏林工业大学", en: "TU Berlin", desc: "德国最大的工业大学之一，坐落于首都柏林。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo_der_Technischen_Universit%C3%A4t_Berlin.svg/512px-Logo_der_Technischen_Universit%C3%A4t_Berlin.svg.png", link: "https://baike.baidu.com/item/柏林工业大学" },
  { name: "卡尔斯鲁厄理工学院", en: "KIT", desc: "德国的MIT，计算机与工程的顶级殿堂。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/KIT-Logo.svg/512px-KIT-Logo.svg.png", link: "https://baike.baidu.com/item/卡尔斯鲁厄理工学院" },
  { name: "慕尼黑大学", en: "LMU Munich", desc: "精英大学联盟成员，商科与文科全德顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/LMU_Muenchen_Logo.svg/512px-LMU_Muenchen_Logo.svg.png", link: "https://baike.baidu.com/item/慕尼黑大学" },
  { name: "斯图加特大学", en: "University of Stuttgart", desc: "位于德国汽车工业中心，汽车与航空工程顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Universit%C3%A4t_Stuttgart_Logo.svg/512px-Universit%C3%A4t_Stuttgart_Logo.svg.png", link: "https://baike.baidu.com/item/斯图加特大学" },
  { name: "达姆施塔特工业大学", en: "TU Darmstadt", desc: "TU9成员，计算机与人工智能领域领先。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/TU_Darmstadt_Logo.svg/512px-TU_Darmstadt_Logo.svg.png", link: "https://baike.baidu.com/item/达姆施塔特工业大学" },
  { name: "汉诺威大学", en: "Leibniz University", desc: "以莱布尼茨命名，机械与电气工程实力雄厚。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Leibniz_Universit%C3%A4t_Hannover_logo.svg/512px-Leibniz_Universit%C3%A4t_Hannover_logo.svg.png", link: "https://baike.baidu.com/item/汉诺威大学" },
  { name: "科隆大学", en: "University of Cologne", desc: "德国第二大大学，经济系规模全德第一。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Logo_Universit%C3%A4t_zu_K%C3%B6ln.svg/512px-Logo_Universit%C3%A4t_zu_K%C3%B6ln.svg.png", link: "https://baike.baidu.com/item/科隆大学" }
];

// 将数组复制一份，用于实现无缝的无限循环滚动
const duplicatedUniversities = [...universities, ...universities];

export const UniversitySystem: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 🌟 控制拖拽和自动滚动的状态
  const [isDown, setIsDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 🌟 高级平滑自动滚动引擎
  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      // 只有在没被拖拽、且鼠标没悬停时，才会自动滚动
      if (scrollRef.current && !isDown && !isHovered) {
        scrollRef.current.scrollLeft += 1; // 数字越大，滚得越快
        
        const { scrollLeft, scrollWidth } = scrollRef.current;
        // 如果滚到了复制数组的那一半，瞬间无缝拉回开头
        if (scrollLeft >= scrollWidth / 2) {
          scrollRef.current.scrollLeft = scrollLeft - (scrollWidth / 2);
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isDown, isHovered]);

  // 处理无缝拖拽的边缘碰撞
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    if (scrollLeft >= scrollWidth / 2) {
      scrollRef.current.scrollLeft = scrollLeft - (scrollWidth / 2);
    } else if (scrollLeft <= 0) {
      scrollRef.current.scrollLeft = scrollWidth / 2;
    }
  };

  // 鼠标交互事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setIsDragging(false); 
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => { setIsDown(false); setIsHovered(false); };
  const handleMouseUp = () => setIsDown(false);
  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 拖拽速度乘数
    scrollRef.current.scrollLeft = scrollLeft - walk;
    
    if (Math.abs(walk) > 5) setIsDragging(true); // 区分是点击还是拖拽
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) e.preventDefault(); // 如果在拖拽，阻止点击跳转
  };

  return (
    <section id="system" className="py-20 bg-jicai-black overflow-hidden relative">
      {/* 隐藏滚动条 */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">德国大学体系</h2>
            <p className="text-gray-400">严谨的学术传统与现代科技的完美结合</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-jicai-blue bg-jicai-blue/10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>悬停暂停 · 按住可自由拖拽</span>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {/* 左右侧黑色渐变遮罩（防止卡片边缘显得太生硬） */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-jicai-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-jicai-black to-transparent z-10 pointer-events-none"></div>

        {/* 🌟 核心滚动/拖拽容器 */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onScroll={handleScroll}
          className={`flex gap-6 px-4 md:px-32 overflow-x-auto hide-scrollbar pb-8 pt-4 select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {duplicatedUniversities.map((uni, index) => (
            <a
              key={index}
              href={uni.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              draggable="false"
              className="w-[280px] md:w-[320px] shrink-0 group relative overflow-hidden rounded-2xl bg-jicai-dark border border-white/5 hover:border-jicai-blue/50 transition-all block shadow-lg hover:shadow-jicai-blue/10 transform hover:-translate-y-2"
            >
              {/* 纯白底色的 Logo 区域 */}
              <div className="h-40 bg-white p-8 flex items-center justify-center">
                <img 
                  src={uni.image} 
                  alt={uni.name} 
                  draggable="false"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-jicai-blue transition-colors">{uni.name}</h3>
                <p className="text-sm text-jicai-blue mb-3">{uni.en}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{uni.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
