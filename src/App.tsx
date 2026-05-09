import React, { useEffect, useState, useRef } from 'react';
import { Target, Zap, Briefcase, GraduationCap, Building, MapPin, Globe } from 'lucide-react';
import { MD, ProjectData } from './data';

export default function App() {
  const [selectedCase, setSelectedCase] = useState<ProjectData | null>(null);
  
  // Custom cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorExpand, setCursorExpand] = useState(false);
  
  // Progress bar & Nav scroll
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Observers
  useEffect(() => {
    // Scroll progress & Nav
    const handleScroll = () => {
      const st = document.documentElement.scrollTop;
      const dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((st / dh) * 100);
      setIsScrolled(window.scrollY > 55);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Mouse move for custom cursor
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Reveal Observer
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });
    
    document.querySelectorAll('.rev').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Stats Count Up Observer
    function countUp(el: Element, target: number, dur = 1400) {
      let st: number | null = null;
      const step = (ts: number) => {
        if (!st) st = ts;
        const p = Math.min((ts - st) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(e * target).toString();
        if (p < 1) requestAnimationFrame(step); else el.textContent = target.toString();
      };
      requestAnimationFrame(step);
    }

    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.cnt').forEach(c => {
            const num = parseInt((c as HTMLElement).dataset.t || '0', 10);
            countUp(c, num);
          });
          statsObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    
    const statsEl = document.getElementById('stats');
    if (statsEl) statsObs.observe(statsEl);
    
    return () => statsObs.disconnect();
  }, []);

  useEffect(() => {
    // Timeline Observer
    const tlObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const tlf = document.getElementById('tlf');
          if (tlf) tlf.style.height = '100%';
          tlObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
    
    const expEl = document.getElementById('experience');
    if (expEl) tlObs.observe(expEl);
    
    return () => tlObs.disconnect();
  }, []);

  useEffect(() => {
    // Blob Parallax
    const handleBlobScroll = () => {
      const sy = window.scrollY;
      document.querySelectorAll('.blob').forEach((b, i) => {
        (b as HTMLElement).style.transform = `translateY(${sy * (0.18 + i * 0.06)}px)`;
      });
    };
    window.addEventListener('scroll', handleBlobScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleBlobScroll);
  }, []);

  // Loader Delay
  const [loaderState, setLoaderState] = useState<'visible' | 'out'>('visible');
  const [hw1, setHw1] = useState(false);
  const [hw2, setHw2] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaderState('out');
      setTimeout(() => {
        setHw1(true);
        setTimeout(() => setHw2(true), 160);
      }, 100);
    }, 820);
  }, []);

  return (
    <>
      {/* ── LOADER ── */}
      <div id="loader" className={loaderState === 'out' ? 'out' : ''}>
        <div className="loader-mark">ДИ<span>.</span></div>
      </div>

      {/* ── CURSOR ── */}
      <div 
        id="cur" 
        style={{ left: cursorPos.x, top: cursorPos.y }}
        className={cursorExpand ? 'expand' : ''}
      ></div>

      {/* ── PROGRESS ── */}
      <div id="prog" style={{ width: `${scrollProgress}%` }}></div>

      {/* ── MESH BG ── */}
      <div className="mesh-bg">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>

      {/* ── NAV ── */}
      <nav id="nav" className={isScrolled ? 'sc' : ''}>
        <a 
          href="#hero" 
          className="nav-logo"
          onMouseEnter={() => setCursorExpand(true)}
          onMouseLeave={() => setCursorExpand(false)}
        >
          <div className="nav-mark">ДИ</div>
          Денис Исламов
        </a>
        <ul className="nav-links">
          <li>
            <a href="#cases" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Проекты</a>
          </li>
          <li>
            <a href="#skills" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Стек</a>
          </li>
          <li>
            <a href="#experience" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Опыт</a>
          </li>
          <li>
            <a href="#about" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>О себе</a>
          </li>
        </ul>
        <a 
          href="#contact" 
          className="nav-cta"
          onMouseEnter={() => setCursorExpand(true)}
          onMouseLeave={() => setCursorExpand(false)}
        >
          Связаться →
        </a>
      </nav>

      <main>
        {/* ════ HERO ════ */}
        <section id="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <div className="hero-tag">AI Integration Lead · Product Architect · Automation</div>
                <h1 className="hero-name">
                  <span className="hw-block"><span className={`hw ${hw1 ? 'in' : ''}`} id="hw1">Денис</span></span>
                  <span className="hw-block"><span className={`hw hw-accent ${hw2 ? 'in' : ''}`} id="hw2">Исламов</span></span>
                </h1>
                <p className="hero-tagline">Нахожу где AI даст реальный эффект, проектирую архитектуру и довожу до использования командой. Не координирую — делаю сам.</p>
                <div className="hero-pills">
                  <span className="hero-pill">AI Architect</span>
                  <span className="hero-pill">Product Thinking</span>
                  <span className="hero-pill">Claude · Python</span>
                  <span className="hero-pill">Bitrix24 · RAG</span>
                </div>
                <div className="hero-btns">
                  <a href="#cases" className="btn-p" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Смотреть проекты →</a>
                  <a href="#contact" className="btn-o" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Написать</a>
                </div>
              </div>

              <div className="hero-right">
                <div className="fcard fc1">
                  <div className="code-bar">
                    <span className="cd" style={{ background: '#ff5f57' }}></span>
                    <span className="cd" style={{ background: '#ffbd2e' }}></span>
                    <span className="cd" style={{ background: '#28ca41' }}></span>
                    <span className="cfn">architecture.yml</span>
                  </div>
                  <span className="cl"><span className="c-cm"># Core business automation</span></span>
                  <span className="cl"><span className="c-kw">pipeline:</span></span>
                  <span className="cl">&nbsp;&nbsp;<span className="c-fn">- phase:</span> <span className="c-str">"Process Audit"</span></span>
                  <span className="cl">&nbsp;&nbsp;&nbsp;&nbsp;<span className="c-fn">action:</span> <span className="c-str">"identify_bottlenecks"</span></span>
                  <span className="cl">&nbsp;&nbsp;<span className="c-fn">- phase:</span> <span className="c-str">"Deployment & Handoff"</span></span>
                  <span className="cl">&nbsp;&nbsp;&nbsp;&nbsp;<span className="c-fn">impact:</span></span>
                  <span className="cl">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="c-fn">manual_overhead:</span> <span className="c-nu">"-70%"</span></span>
                </div>

                <div className="fcard fc2">
                  <div className="fc2-lbl">Manual Overhead</div>
                  <div className="fc2-val" style={{color: 'var(--accent)'}}>-70%</div>
                  <div className="fc2-sub">после внедрения системы</div>
                </div>

                <div className="fcard fc3">
                  <div className="fc3-chain">Анализ<span className="arr">→</span>Архитектура<span className="arr">→</span>Деплой</div>
                  <div className="fc3-badge">Production ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ VALUE PROPOSITION ════ */}
        <section id="stats" style={{ padding: '80px 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--bg-card)' }}>
          <div className="wrap">
            <div className="slabel rev">value</div>
            <h2 className="sec-h2 rev d1" style={{ marginBottom: '40px' }}>Как я строю работу</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <div className="rev d1" style={{ background: 'var(--bg-subtle)', padding: '36px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ marginBottom: '20px' }}><Target size={32} color="var(--accent)" strokeWidth={1.5} /></div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.3px', color: 'var(--text)' }}>От бизнес-задачи, а не от кода</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>Не предлагаю AI ради хайпа. Сначала аудит процессов — ищем «узкие места», где компания теряет время и деньги. Если задачу можно решить простым n8n сценарием, я не буду строить сложные нейросети.</p>
              </div>
              <div className="rev d2" style={{ background: 'var(--bg-subtle)', padding: '36px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ marginBottom: '20px' }}><Zap size={32} color="var(--accent)" strokeWidth={1.5} /></div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.3px', color: 'var(--text)' }}>Проверяем гипотезы за дни</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>Использую Vibe Coding и API существующих сервисов, чтобы выкатить первую MVP-версию продукта не за месяцы, а за неделю. Бизнес сразу видит результат, и мы быстро масштабируем успешные паттерны.</p>
              </div>
              <div className="rev d3" style={{ background: 'var(--bg-subtle)', padding: '36px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ marginBottom: '20px' }}><Briefcase size={32} color="var(--accent)" strokeWidth={1.5} /></div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.3px', color: 'var(--text)' }}>Система, а не прототип</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>Разработать бота — это 20% дела. Оставшиеся 80% — это внедрение продукта в реальные процессы. Я настраиваю аналитику, пишу регламенты и провожу онбординг команды, чтобы инструмент реально приносил выгоду.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════ CASES ════ */}
        <section id="cases">
          <div className="wrap">
            <div className="slabel rev">projects</div>
            <h2 className="sec-h2 rev d1">Что я строил</h2>

            {/* FEATURED */}
            <div className="featured-label rev d2">
              <span className="featured-badge">Ключевые кейсы</span>
              <span className="featured-line"></span>
            </div>
            <div className="cases-featured">
              {[MD['mf1'], MD['mf2'], MD['mf3']].map((project, i) => (
                <div 
                  key={project.id}
                  className="case-card feat rev d1" 
                  style={{ '--ch': '#e8f4fd', '--cb': '#b0c8ec' } as React.CSSProperties}
                  onClick={() => setSelectedCase(project)}
                  onMouseEnter={() => setCursorExpand(true)}
                  onMouseLeave={() => setCursorExpand(false)}
                >
                  <div className="case-head">
                    <span className="case-ico">{project.icon}</span>
                    <div className="case-tags">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="ctag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="case-body">
                    <div className="case-metric">{project.metrics.map(m => m.v).join(' · ')}</div>
                    <h3 className="case-title">{project.title}</h3>
                    <p className="case-desc">{project.task.substring(0, 80)}...</p>
                    <div className="case-foot">
                      <div className="case-tags">
                        <span className="ctag">{project.tags[2]}</span>
                      </div>
                      <span className="case-arr">Подробнее →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* REST GRID */}
            <span className="cases-rest-label rev">// остальные проекты</span>
            <div className="cases-grid">
              {['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16'].map((key, index) => {
                const project = MD[key];
                const restStyles = [
                  { '--ch': '#f8fafc', '--cb': '#cbd5e1' },
                  { '--ch': '#f8f9fa', '--cb': '#e2e8f0' }
                ];
                const bgStyle = restStyles[index % restStyles.length];
                return (
                  <div 
                    key={project.id}
                    className="case-card rev d1" 
                    style={bgStyle as React.CSSProperties}
                    onClick={() => setSelectedCase(project)}
                    onMouseEnter={() => setCursorExpand(true)}
                    onMouseLeave={() => setCursorExpand(false)}
                  >
                    <div className="case-head">
                      <span className="case-ico">{project.icon}</span>
                      <div className="case-tags">
                        {project.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="ctag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="case-body">
                      <div className="case-metric">{project.metrics.map(m => m.v).join(' · ')}</div>
                      <h3 className="case-title">{project.title}</h3>
                      <p className="case-desc">{project.task}</p>
                      <div className="case-foot">
                        <div className="case-tags">
                          <span className="ctag">{project.tags[0]}</span>
                        </div>
                        <span className="case-arr">Подробнее →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════ SKILLS ════ */}
        <section id="skills">
          <div className="wrap">
            <div className="slabel rev">skills</div>
            <h2 className="sec-h2 rev d1">Стек</h2>
            <div className="skills-cloud">
              <span className="stag sl rev d1" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Claude</span>
              <span className="stag sl rev d1" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>ChatGPT</span>
              <span className="stag sl rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Python</span>
              <span className="stag sl rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Vibe Coding</span>
              <span className="stag sl rev d3" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Bitrix24</span>
              <span className="stag sm rev d1" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Telegram Bot API</span>
              <span className="stag sm rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>REST API</span>
              <span className="stag sm rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>CatBoost</span>
              <span className="stag sm rev d3" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Vercel</span>
              <span className="stag sm rev d3" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Prompt Engineering</span>
              <span className="stag sm rev d4" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>n8n</span>
              <span className="stag ss rev d1" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Google Sheets</span>
              <span className="stag ss rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Яндекс.Директ</span>
              <span className="stag ss rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Metrika</span>
              <span className="stag ss rev d3" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>SEO</span>
              <span className="stag ss rev d4" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>Figma</span>
            </div>
          </div>
        </section>

        {/* ════ EXPERIENCE ════ */}
        <section id="experience">
          <div className="wrap">
            <div className="slabel rev">experience</div>
            <h2 className="sec-h2 rev d1">Опыт работы</h2>
            <div className="timeline">
              <div className="tl-bar"><div className="tl-fill" id="tlf"></div></div>
              <div className="tl-item rev d1">
                <div className="tl-dot"></div>
                <div className="tl-per">2022 — Настоящее время</div>
                <div className="tl-role">Product Owner / AI Architect</div>
                <div className="tl-co">Строительная компания</div>
                <p className="tl-desc">Строил AI-продукты с нуля: от идеи до запуска. Разрабатывал инструменты автоматизации, внедрял ML-модели, интегрировал AI в бизнес-процессы.</p>
              </div>
              <div className="tl-item rev d2">
                <div className="tl-dot"></div>
                <div className="tl-per">3+ года</div>
                <div className="tl-role">Digital-маркетолог / Автоматизация</div>
                <div className="tl-co">Digital-агентство</div>
                <p className="tl-desc">AI-аутрич, аналитика, настройка воронок. Автоматизация лидогенерации, работа с данными и AI-инструментами для роста конверсий клиентов.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════ ABOUT ════ */}
        <section id="about">
          <div className="wrap">
            <div className="slabel rev">about</div>
            <h2 className="sec-h2 rev d1">О себе</h2>
            <div className="about-grid">
              <div>
                <p className="about-text rev d2">
                  Я не просто пишу код — я решаю бизнес-задачи. Мой подход основан на <strong>полной автономности</strong>: вы делегируете мне проблему, а я возвращаю внедренное, работающее решение. Я умею декомпозировать сложные процессы, находить оптимальные инструменты (от простых API-интеграций до сложных AI-агентов) и доводить их до продакшна.<br/><br/>
                  Особый фокус на бизнес-мышление мне дала программа <strong>«Практикум» Московской школы управления СКОЛКОВО</strong>, которую я успешно прошел совместно с руководителем компании. Это научило меня смотреть на разработку не как на набор строчек кода, а как на инструмент для кратного роста ключевых метрик компании, построения системной архитектуры и стратегического управления изменениями.
                </p>
              </div>
              <div className="about-facts">
                <div className="afact rev d1" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}><span className="afact-ico"><GraduationCap size={18} /></span>Строительный университет, ПГС, 3 курс</div>
                <div className="afact rev d2" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}><span className="afact-ico"><Building size={18} /></span>МШУ Сколково: Практикум</div>
                <div className="afact rev d3" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}><span className="afact-ico"><MapPin size={18} /></span>Санкт-Петербург</div>
                <div className="afact rev d4" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}><span className="afact-ico"><Globe size={18} /></span>English: B1/B2</div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ CONTACT ════ */}
        <section id="contact">
          <div className="wrap">
            <div className="contact-box rev">
              <div className="slabel" style={{ marginBottom: '14px' }}>contact</div>
              <h2 className="contact-title">Давайте работать</h2>
              <p className="contact-sub">Открыт к проектной занятости и полной удалённой работе</p>
              <div className="contact-btns">
                <a href="https://t.me/username" className="btn-tg" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.603c-.15.658-.557.818-1.126.508l-3.108-2.29-1.5 1.442c-.165.166-.305.305-.627.305l.222-3.158 5.76-5.197c.25-.221-.055-.344-.386-.123L6.55 14.52l-2.942-.92c-.639-.2-.652-.638.134-.945l11.546-4.452c.532-.194 1.0.13.274.045z"/></svg>
                  Telegram
                </a>
                <a href="mailto:email@mail.ru" className="btn-p" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email
                </a>
                <a href="#" className="btn-dl" onMouseEnter={() => setCursorExpand(true)} onMouseLeave={() => setCursorExpand(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Резюме PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>© 2025 Денис Исламов &nbsp;·&nbsp; AI Builder &nbsp;·&nbsp; Санкт-Петербург</footer>

      {/* ════ MODAL ════ */}
      <div 
        id="mbd" 
        className={selectedCase ? 'open' : ''} 
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedCase(null);
        }}
      >
        <div id="mbox">
          {selectedCase && (
            <div id="mc">
              <div className="m-hd">
                <div>
                  <span className="m-emoji">{selectedCase.icon}</span>
                  <div className="m-title">{selectedCase.title}</div>
                  <div className="m-sub">{selectedCase.sub}</div>
                </div>
                <button 
                  className="m-close" 
                  onClick={() => setSelectedCase(null)}
                  onMouseEnter={() => setCursorExpand(true)}
                  onMouseLeave={() => setCursorExpand(false)}
                >
                  ×
                </button>
              </div>
              <div className="m-sec"><div className="m-sec-lbl">Задача</div><p>{selectedCase.task}</p></div>
              <div className="m-sec"><div className="m-sec-lbl">Решение</div><p>{selectedCase.solution}</p></div>
              <div className="m-sec"><div className="m-sec-lbl">Результат</div><p>{selectedCase.result}</p></div>
              <div className="m-metrics">
                {selectedCase.metrics.map((m, i) => (
                  <div className="m-met" key={i}>
                    <div className="m-met-v">{m.v}</div>
                    <div className="m-met-l">{m.l}</div>
                  </div>
                ))}
              </div>
              <div className="m-sec">
                <div className="m-sec-lbl">Стек</div>
                <div className="m-tags">
                  {selectedCase.tags.map(t => (
                    <span className="m-tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
