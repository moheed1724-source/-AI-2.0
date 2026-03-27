{/* 🌟 全新设计：取消百分比，采用竞争烈度星级与硬件诊断标签 */}
                <div className="space-y-4 mb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Crosshair size={20} className="text-jicai-blue" /> 【{formData.major}】硬件条件判定报告
                  </h4>
                  {result?.predictions.map((pred: any, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-lg">{pred.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${pred.type === 'reach' ? 'border-red-500/50 text-red-400' : pred.type === 'match' ? 'border-blue-500/50 text-blue-400' : 'border-green-500/50 text-green-400'}`}>
                            {pred.type === 'reach' ? '超高难度冲刺' : pred.type === 'match' ? '核心对标匹配' : '相对稳妥策略'}
                          </span>
                        </div>
                        {/* 竞争烈度展示 (用火焰或星星) */}
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <span>竞争烈度:</span>
                          <span className="text-orange-500 flex tracking-tighter">
                            {Array.from({ length: pred.difficultyStars }).map((_, idx) => (
                              <svg key={idx} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </span>
                        </div>
                      </div>
                      
                      {/* 🌟 核心：硬件诊断标签阵列 (完全替代进度条) */}
                      <div className="flex flex-wrap gap-2">
                        {pred.badges.map((badge: any, bIdx: number) => (
                          <div key={bIdx} className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1 border ${
                            badge.status === 'pass' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                            badge.status === 'warn' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                            'bg-red-500/10 border-red-500/30 text-red-400 font-bold'
                          }`}>
                            {badge.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
