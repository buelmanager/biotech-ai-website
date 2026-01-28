/* ===========================
   법률AI - Main Script
   GSAP + Lenis + Canvas Particles
   =========================== */

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ticker
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

/* ===========================
   Particle Canvas Animation
   =========================== */
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 60;
        this.connectionDistance = 120;
        this.colors = {
            particle: '#c9a227',
            connection: 'rgba(201, 162, 39, 0.1)',
        };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - distance / this.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(201, 162, 39, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(network) {
        this.network = network;
        this.x = Math.random() * network.canvas.width;
        this.y = Math.random() * network.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
    }

    update() {
        if (this.network.mouse.x !== null && this.network.mouse.y !== null) {
            const dx = this.network.mouse.x - this.x;
            const dy = this.network.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.network.mouse.radius) {
                const force = (this.network.mouse.radius - distance) / this.network.mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force * 0.015;
                this.vy -= Math.sin(angle) * force * 0.015;
                this.radius = this.baseRadius + force * 1.5;
            } else {
                this.radius = this.baseRadius;
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.network.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.network.canvas.height) this.vy *= -1;

        this.vx *= 0.995;
        this.vy *= 0.995;

        if (Math.abs(this.vx) < 0.05) this.vx = (Math.random() - 0.5) * 0.3;
        if (Math.abs(this.vy) < 0.05) this.vy = (Math.random() - 0.5) * 0.3;
    }

    draw() {
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.network.ctx.fillStyle = this.network.colors.particle;
        this.network.ctx.globalAlpha = 0.4;
        this.network.ctx.fill();
        this.network.ctx.globalAlpha = 1;
    }
}

// Initialize Particle Network
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    new ParticleNetwork(canvas);
}

/* ===========================
   Navigation Scroll Effect
   =========================== */
const nav = document.querySelector('.nav');

ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 100) {
            nav.classList.add('scrolled');
        } else if (self.scroll() < 100) {
            nav.classList.remove('scrolled');
        }
    },
});

/* ===========================
   Hero Animations
   =========================== */
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTimeline
    .to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
    })
    .to(
        '.title-line',
        {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
        },
        '-=0.4'
    )
    .to(
        '.hero-description',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.6'
    )
    .to(
        '.hero-trust',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.5'
    )
    .to(
        '.hero-ai-notice',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.5'
    )
    .to(
        '.hero-chat',
        {
            opacity: 1,
            y: 0,
            duration: 1,
        },
        '-=0.6'
    );

// Set initial state for hero-chat
gsap.set('.hero-chat', { opacity: 0, y: 30 });

/* ===========================
   Blur Reveal Animation
   =========================== */
const blurElements = document.querySelectorAll('.blur-reveal');

blurElements.forEach((el) => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
    });
});

/* ===========================
   Feature Cards Animation
   =========================== */
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach((card, index) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
    });
});

/* ===========================
   Step Cards Animation
   =========================== */
const stepCards = document.querySelectorAll('.step-card');

stepCards.forEach((card, index) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
    });
});

/* ===========================
   Category Cards Animation
   =========================== */
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach((card, index) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: card.classList.contains('category-coming') ? 0.6 : 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
    });
});

/* ===========================
   Smooth Scroll Links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -100,
                duration: 1.2,
            });
        }
    });
});

/* ===========================
   Chat Functionality
   =========================== */
const chatInput = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const chatMessages = document.getElementById('chat-messages');
const exampleBtns = document.querySelectorAll('.example-btn');

// Enable/disable submit button based on input
if (chatInput && chatSubmit) {
    chatInput.addEventListener('input', () => {
        chatSubmit.disabled = chatInput.value.trim().length === 0;

        // Auto-resize textarea
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Handle Enter key (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!chatSubmit.disabled) {
                sendMessage().catch(console.error);
            }
        }
    });

    chatSubmit.addEventListener('click', () => sendMessage().catch(console.error));
}

// Example button click handlers
exampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        if (chatInput) {
            chatInput.value = question;
            chatInput.dispatchEvent(new Event('input'));

            // Focus input and send
            chatInput.focus();
            setTimeout(() => {
                sendMessage().catch(console.error);
            }, 300);
        }
    });
});

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Expand chat container when conversation starts
    const chatContainer = document.querySelector('.hero-chat .chat-container');
    if (chatContainer && !chatContainer.classList.contains('chat-expanded')) {
        chatContainer.classList.add('chat-expanded');
    }

    // Hide welcome message
    const welcomeEl = chatMessages.querySelector('.chat-welcome');
    if (welcomeEl) {
        welcomeEl.style.display = 'none';
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSubmit.disabled = true;

    // Show typing indicator
    const typingId = showTypingIndicator();

    // 먼저 로컬 데모 응답 확인 (빠른 응답을 위해)
    const demoResponse = getDemoResponse(message);
    const isDemoResponseGeneric = demoResponse.includes('더 구체적인 정보가 필요합니다');

    // 데모 응답이 일반적인 응답이면 AI API 시도
    if (isDemoResponseGeneric && HF_CONFIG.apiToken) {
        try {
            const apiResult = await callAIAPI(message);

            removeTypingIndicator(typingId);

            if (apiResult.success) {
                addMessage(apiResult.response, 'ai');
            } else {
                // API 실패 시 데모 응답 사용
                console.log('AI API 사용 불가, 데모 응답 사용:', apiResult.error);
                addMessage(demoResponse, 'ai');
            }
        } catch (error) {
            removeTypingIndicator(typingId);
            console.error('AI 응답 생성 오류:', error);
            addMessage(demoResponse, 'ai');
        }
    } else {
        // 데모 응답이 구체적이면 바로 사용 (API 호출 없이 빠른 응답)
        setTimeout(() => {
            removeTypingIndicator(typingId);
            addMessage(demoResponse, 'ai');
        }, 500 + Math.random() * 500);
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '나' : 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message message-ai';
    typingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content" style="display: flex; gap: 4px; padding: 16px 20px;">
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0s;"></span>
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0.2s;"></span>
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0.4s;"></span>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return id;
}

function removeTypingIndicator(id) {
    const typingEl = document.getElementById(id);
    if (typingEl) {
        typingEl.remove();
    }
}

// Add typing animation styles
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--color-gold);
        border-radius: 50%;
        opacity: 0.3;
    }

    @keyframes typingDot {
        0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
        30% { opacity: 1; transform: translateY(-4px); }
    }
`;
document.head.appendChild(typingStyles);

/* ===========================
   Hugging Face API Configuration
   =========================== */
const HF_CONFIG = {
    // 무료 추론 API 엔드포인트 (토큰 없이 사용 가능한 모델)
    apiUrl: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
    // API 토큰이 있으면 아래에 설정 (선택사항)
    apiToken: null,
    maxTokens: 500,
    temperature: 0.7
};

// AI API 호출 함수
async function callAIAPI(userMessage) {
    const systemPrompt = `당신은 대한민국 노동법 전문 AI 법률 상담사입니다.
사용자의 질문에 친절하고 정확하게 답변해주세요.
- 관련 법령 조문을 인용해주세요
- 쉬운 언어로 설명해주세요
- 답변 마지막에 "구체적인 사안은 변호사와 상담하시기 바랍니다"라고 안내해주세요
- 인사에는 친근하게 응대하고 어떤 도움이 필요한지 물어봐주세요`;

    const prompt = `<s>[INST] ${systemPrompt}

사용자: ${userMessage} [/INST]`;

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (HF_CONFIG.apiToken) {
            headers['Authorization'] = `Bearer ${HF_CONFIG.apiToken}`;
        }

        const response = await fetch(HF_CONFIG.apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: HF_CONFIG.maxTokens,
                    temperature: HF_CONFIG.temperature,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API 응답 오류: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        let aiResponse = data[0]?.generated_text || data.generated_text;

        if (aiResponse) {
            // HTML 포맷팅
            aiResponse = formatAIResponse(aiResponse);
            return { success: true, response: aiResponse };
        }

        throw new Error('응답을 생성할 수 없습니다.');
    } catch (error) {
        console.error('AI API 오류:', error);
        return { success: false, error: error.message };
    }
}

// AI 응답 HTML 포맷팅
function formatAIResponse(text) {
    // 기본 텍스트 정리
    let formatted = text.trim();

    // 줄바꿈을 <br>로 변환
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');

    // 법령 인용 강조 (예: 근로기준법 제60조)
    formatted = formatted.replace(/(제\d+조(?:의\d+)?)/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(근로기준법|최저임금법|남녀고용평등법|근로자퇴직급여\s?보장법)/g, '<strong>$1</strong>');

    // 숫자 강조
    formatted = formatted.replace(/(\d+일|\d+개월|\d+년|\d+%)/g, '<strong>$1</strong>');

    return `<p>${formatted}</p>`;
}

// Demo responses (for demonstration purposes)
function getDemoResponse(question) {
    const q = question.toLowerCase().trim();

    // 한국어 인사말 처리
    const greetings = ['안녕', '안녕하세요', '반갑습니다', '반가워요', '하이', 'hi', 'hello', '처음 뵙겠습니다'];
    const isGreeting = greetings.some(greeting => q.includes(greeting) || q === greeting);

    if (isGreeting) {
        return `
            <p>안녕하세요! 법률AI입니다. 반갑습니다. 😊</p>
            <p>노동법 관련 궁금한 점이 있으시면 편하게 질문해 주세요.</p>
            <p><strong>이런 질문들을 도와드릴 수 있어요:</strong></p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">퇴직금 계산 방법</li>
                <li style="margin-bottom: 8px;">부당해고 대응 방법</li>
                <li style="margin-bottom: 8px;">연차휴가 일수</li>
                <li style="margin-bottom: 8px;">임금체불 신고 방법</li>
                <li style="margin-bottom: 8px;">근로계약서 작성</li>
            </ul>
        `;
    }

    // 감사 인사 처리
    const thanks = ['감사', '고마워', '고맙습니다', '감사합니다', 'thanks', 'thank you'];
    const isThanks = thanks.some(t => q.includes(t));

    if (isThanks) {
        return `
            <p>도움이 되셨다니 기쁩니다! 😊</p>
            <p>추가로 궁금한 점이 있으시면 언제든지 질문해 주세요.</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 참고: 구체적인 법률 문제는 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 퇴직금 관련
    if (q.includes('퇴직금')) {
        if (q.includes('계산') || q.includes('얼마') || q.includes('어떻게')) {
            return `
                <p><strong>퇴직금 계산 방법</strong></p>
                <p>퇴직금은 다음 공식으로 계산됩니다:</p>
                <p style="background: rgba(201,162,39,0.1); padding: 12px; border-radius: 8px; margin: 12px 0;">
                    <strong>퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)</strong>
                </p>
                <p><strong>1일 평균임금</strong> = 퇴직 전 3개월간 임금 총액 ÷ 해당 기간의 총 일수</p>
                <p><strong>지급 조건:</strong></p>
                <ul style="margin: 12px 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">계속 근로기간 <strong>1년 이상</strong></li>
                    <li style="margin-bottom: 8px;">4주간 평균 <strong>주 15시간 이상</strong> 근무</li>
                </ul>
                <p><strong>관련 법령:</strong> 근로자퇴직급여 보장법 제8조</p>
                <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                    ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
                </p>
            `;
        }
        return `
            <p><strong>퇴직금 관련 안내</strong></p>
            <p>퇴직금에 대해 어떤 점이 궁금하신가요?</p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>계산 방법</strong> - "퇴직금 어떻게 계산하나요?"</li>
                <li style="margin-bottom: 8px;"><strong>지급 시기</strong> - "퇴직금 언제 받나요?"</li>
                <li style="margin-bottom: 8px;"><strong>미지급 시</strong> - "퇴직금 안 주면 어떻게 하나요?"</li>
            </ul>
        `;
    }

    // 부당해고 관련
    if (q.includes('부당해고') || q.includes('해고')) {
        return `
            <p><strong>부당해고 대응 방법</strong></p>
            <p>부당해고를 당했을 경우 다음과 같이 대응할 수 있습니다:</p>
            <ol style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">해고 사유와 날짜가 명시된 <strong>해고통지서</strong>를 요청하세요.</li>
                <li style="margin-bottom: 8px;">해고일로부터 <strong>3개월 이내</strong>에 노동위원회에 구제신청을 할 수 있습니다.</li>
                <li style="margin-bottom: 8px;">사업장 관할 <strong>지방노동위원회</strong>에 부당해고 구제신청서를 제출하세요.</li>
            </ol>
            <p><strong>부당해고의 유형:</strong></p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">정당한 사유 없는 해고</li>
                <li style="margin-bottom: 8px;">해고 예고(30일 전) 없는 즉시 해고</li>
                <li style="margin-bottom: 8px;">서면 통지 없는 해고</li>
            </ul>
            <p><strong>관련 법령:</strong> 근로기준법 제23조, 제27조, 제28조</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 연차휴가 관련
    if (q.includes('연차') || q.includes('휴가') || q.includes('연월차')) {
        return `
            <p><strong>연차휴가 일수</strong></p>
            <p>연차휴가는 근속기간에 따라 다음과 같이 부여됩니다:</p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>1년 미만 근무:</strong> 1개월 개근 시 1일씩 (최대 11일)</li>
                <li style="margin-bottom: 8px;"><strong>1년 이상 근무:</strong> 15일</li>
                <li style="margin-bottom: 8px;"><strong>3년 이상 근무:</strong> 2년마다 1일씩 추가 (최대 25일)</li>
            </ul>
            <p><strong>연차수당:</strong> 미사용 연차는 퇴직 시 수당으로 지급받을 수 있습니다.</p>
            <p><strong>관련 법령:</strong> 근로기준법 제60조</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 임금체불 관련
    if (q.includes('임금체불') || q.includes('월급') && (q.includes('안') || q.includes('못')) || q.includes('체불')) {
        return `
            <p><strong>임금체불 대응 방법</strong></p>
            <p>임금을 받지 못했을 경우 다음과 같이 대응할 수 있습니다:</p>
            <ol style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>고용노동부 신고:</strong> 관할 고용노동청에 임금체불 진정서 제출</li>
                <li style="margin-bottom: 8px;"><strong>체불임금 소액재판:</strong> 3,000만원 이하는 소액사건심판 신청 가능</li>
                <li style="margin-bottom: 8px;"><strong>체당금 제도:</strong> 회사 도산 시 고용노동부에서 체불임금 일부 지급</li>
            </ol>
            <p><strong>필요 서류:</strong> 근로계약서, 급여명세서, 출퇴근 기록 등</p>
            <p><strong>관련 법령:</strong> 근로기준법 제43조, 제109조</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 최저임금 관련
    if (q.includes('최저임금') || q.includes('최저시급')) {
        return `
            <p><strong>2024년 최저임금</strong></p>
            <p style="background: rgba(201,162,39,0.1); padding: 12px; border-radius: 8px; margin: 12px 0;">
                <strong>시급 9,860원</strong> (2024년 기준)
            </p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>일급 (8시간):</strong> 78,880원</li>
                <li style="margin-bottom: 8px;"><strong>월급 (209시간):</strong> 2,060,740원</li>
            </ul>
            <p><strong>최저임금 위반 시:</strong> 3년 이하 징역 또는 2천만원 이하 벌금</p>
            <p><strong>관련 법령:</strong> 최저임금법 제6조</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 근로계약서 관련
    if (q.includes('근로계약서') || q.includes('계약서')) {
        return `
            <p><strong>근로계약서 필수 기재사항</strong></p>
            <p>근로계약서에는 다음 사항이 반드시 포함되어야 합니다:</p>
            <ol style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>임금:</strong> 구성항목, 계산방법, 지급방법</li>
                <li style="margin-bottom: 8px;"><strong>근로시간:</strong> 소정근로시간</li>
                <li style="margin-bottom: 8px;"><strong>휴일:</strong> 주휴일</li>
                <li style="margin-bottom: 8px;"><strong>연차휴가:</strong> 연차 유급휴가</li>
                <li style="margin-bottom: 8px;"><strong>근무장소, 업무내용</strong></li>
            </ol>
            <p><strong>미작성 시:</strong> 500만원 이하 벌금</p>
            <p><strong>관련 법령:</strong> 근로기준법 제17조</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // 직장 내 괴롭힘 관련
    if (q.includes('괴롭힘') || q.includes('직장 내') || q.includes('갑질')) {
        return `
            <p><strong>직장 내 괴롭힘 대응 방법</strong></p>
            <p><strong>직장 내 괴롭힘이란?</strong></p>
            <p>사용자 또는 근로자가 직장에서의 지위나 관계 우위를 이용하여 다른 근로자에게 신체적·정신적 고통을 주는 행위</p>
            <p><strong>대응 방법:</strong></p>
            <ol style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>증거 수집:</strong> 녹음, 문자, 이메일, 목격자 진술 등</li>
                <li style="margin-bottom: 8px;"><strong>회사 신고:</strong> 인사팀 또는 내부 신고센터</li>
                <li style="margin-bottom: 8px;"><strong>노동청 신고:</strong> 회사가 조치를 취하지 않을 경우</li>
            </ol>
            <p><strong>관련 법령:</strong> 근로기준법 제76조의2, 제76조의3</p>
            <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
            </p>
        `;
    }

    // Default response
    return `
        <p>질문해 주셔서 감사합니다.</p>
        <p>입력하신 내용에 대해 더 구체적인 정보가 필요합니다. 다음과 같이 질문해 주시면 더 정확한 답변을 드릴 수 있어요:</p>
        <p><strong>질문 예시:</strong></p>
        <ul style="margin: 12px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">"퇴직금은 어떻게 계산하나요?"</li>
            <li style="margin-bottom: 8px;">"부당해고를 당했을 때 어떻게 해야 하나요?"</li>
            <li style="margin-bottom: 8px;">"연차휴가는 며칠이 주어지나요?"</li>
            <li style="margin-bottom: 8px;">"임금체불 신고는 어떻게 하나요?"</li>
            <li style="margin-bottom: 8px;">"최저임금은 얼마인가요?"</li>
        </ul>
        <p style="font-size: 0.85em; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
            ⚠️ 위 정보는 일반적인 법률 정보이며, 구체적인 사안은 변호사와 상담하시기 바랍니다.
        </p>
    `;
}

/* ===========================
   Mobile Menu Toggle
   =========================== */
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
    });
}

/* ===========================
   Preloader
   =========================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    ScrollTrigger.refresh();
});

/* ===========================
   Console Message
   =========================== */
console.log(
    '%c⚖️ 법률AI',
    'font-size: 24px; font-weight: bold; color: #c9a227;'
);
console.log(
    '%cAI가 제공하는 무료 법률 정보 서비스',
    'font-size: 14px; color: #d4af37;'
);
console.log(
    '%c본 서비스는 법률 정보 제공 목적이며, 법률 자문이 아닙니다.',
    'font-size: 12px; color: #888;'
);
