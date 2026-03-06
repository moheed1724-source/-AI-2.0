import React, { useRef, useState } from 'react';

const universities = [
  { name: "慕尼黑工业大学", en: "TU Munich", desc: "德国顶尖理工大学，诺贝尔奖得主摇篮，TU9联盟成员。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/TUM_Hauptgeb%C3%A4ude.jpg/800px-TUM_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/慕尼黑工业大学" },
  { name: "亚琛工业大学", en: "RWTH Aachen", desc: "欧洲顶尖理工大学，机械工程专业世界闻名。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hauptgeb%C3%A4ude_RWTH_Aachen_-_Panorama.jpg/800px-Hauptgeb%C3%A4ude_RWTH_Aachen_-_Panorama.jpg", link: "https://baike.baidu.com/item/亚琛工业大学" },
  { name: "海德堡大学", en: "Heidelberg University", desc: "德国最古老的大学，医学与生命科学领域的权威。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Heidelberg_Alte_Universit%C3%A4t.jpg/800px-Heidelberg_Alte_Universit%C3%A4t.jpg", link: "https://baike.baidu.com/item/海德堡大学" },
  { name: "柏林工业大学", en: "TU Berlin", desc: "德国最大的工业大学之一，坐落于首都柏林。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/TU_Berlin_Hauptgeb%C3%A4ude.jpg/800px-TU_Berlin_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/柏林工业大学" },
  { name: "卡尔斯鲁厄理工学院", en: "KIT", desc: "德国的MIT，计算机与工程的顶级殿堂。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Campus_S%C3%BCd_KIT.jpg/800px-Campus_S%C3%BCd_KIT.jpg", link: "https://baike.baidu.com/item/卡尔斯鲁厄理工学院" },
  { name: "慕尼黑大学", en: "LMU Munich", desc: "精英大学联盟成员，商科与文科全德顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/LMU_M%C3%BCnchen_Hauptgeb%C3%A4ude.jpg/800px-LMU_M%C3%BCnchen_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/慕尼黑大学" },
  { name: "斯图加特大学", en: "University of Stuttgart", desc: "位于德国汽车工业中心，汽车与航空工程顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Universit%C3%A4t_Stuttgart_Kollegiengeb%C3%A4ude_I.jpg/800px-Universit%C3%A4t_Stuttgart_Kollegiengeb%C3%A4ude_I.jpg", link: "https://baike.baidu.com/item/斯图加特大学" },
  { name: "达姆施塔特工业大学", en: "TU Darmstadt", desc: "TU9成员，计算机与人工智能领域领先。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Schloss_Darmstadt_2011.jpg/800px-Schloss_Darmstadt_2011.jpg", link: "https://baike.baidu.com/item/达姆施塔特工业大学" },
  { name: "汉诺威大学", en: "Leibniz University", desc: "以莱布尼茨命名，机械与电气工程实力雄厚。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Welfenschloss_Hannover_2011.jpg/800px-Welfenschloss_Hannover_2011.jpg", link: "https://baike.baidu.com/item/汉诺威大学" },
  { name: "科隆大学", en: "University of Cologne", desc: "德国第二大大学，经济系规模全德第一。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Universit%C3%A4t_zu_K%C3%B6ln_Hauptgeb%C3%A4ude.jpg/800px-Universit%C3%A4t_zu_K%C3%B6ln_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/科隆大学" }
];

export const UniversitySystem: React.FC = () => {
  const basePath = import.meta.env.BASE_URL;
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 🌟 拖拽控制状态
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setIsDragging(false); // 刚按下还不算拖拽
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度倍率
    scrollRef.current.scrollLeft = scrollLeft - walk;
    
    // 如果移动距离超过 5px，认定为拖拽行为（防止误触链接）
    if (Math.abs(walk) > 5) setIsDragging(true);
  };

  // 阻止拖拽时的意外点击跳转
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) e.preventDefault();
  };

  return (
    <section id="system" className="py-20 bg-jicai-black overflow-hidden relative">
      <style>
        {`
          /* 隐藏滚动条让视觉更干净 */
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
            <span>鼠标按住卡片可左右拖拽浏览</span>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {/* 左右侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-jicai-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-jicai-black to-transparent z-10 pointer-events-none"></div>

        {/* 🌟 核心拖拽容器 */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 px-4 md:px-32 overflow-x-auto hide-scrollbar pb-8 pt-4 select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {universities.map((uni, index) => (
            <a
              key={index}
              href={uni.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="w-[300px] md:w-[350px] shrink-0 group relative overflow-hidden rounded-2xl bg-jicai-dark border border-white/5 hover:border-jicai-blue/50 transition-all block shadow-lg hover:shadow-jicai-blue/10 transform hover:-translate-y-2"
              draggable="false"
            >
              <div className="h-48 overflow-hidden bg-gray-800">
                <img 
                  src={uni.image.startsWith('http') ? uni.image : `${basePath}${uni.image}`} 
                  alt={uni.name} 
                  draggable="false"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
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
