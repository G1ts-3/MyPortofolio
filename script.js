import { GEMINI_API_KEY } from './config.js';

// Initialize AOS (Animate on Scroll)
AOS.init({
    once: true,
    mirror: false,
    offset: 50,
    duration: 600,
    easing: 'ease-out'
});

/* ------------------- Custom Cursor ------------------- */
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const interactives = document.querySelectorAll('a, button, .interactive-btn, .product-card');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

/* ------------------- Magnetic Elements ------------------- */
const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', function() {
        this.style.transform = `translate(0px, 0px)`;
    });
});

/* ------------------- Scroll Progress & Navigation ------------------- */
const scrollProgress = document.getElementById('scroll-progress');
const nav = document.querySelector('.primary-nav');

window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';

    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

/* ------------------- Intersection Observer for Reveals ------------------- */
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const revealText = entry.target.querySelector('.reveal-text');
            if (revealText) revealText.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

/* ------------------- Typing Animation ------------------- */
const typingElement = document.getElementById('typing-text');
const phrases = [
    "SOFTWARE ENGINEERING STUDENT.",
    "BUILDING EFFICIENT SOLUTIONS.",
    "CODING SINCE VOCATIONAL SCHOOL.",
    "FULL STACK ENTHUSIAST."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    type();
});

/* ------------------- Parallax Effect ------------------- */
document.addEventListener('mousemove', (e) => {
    const heroImg = document.querySelector('.campaign-tile img');
    if (heroImg) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        heroImg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    }
});

/* ------------------- UI Logic ------------------- */
const navAiChatBtn = document.getElementById('nav-ai-chat-btn');

/* ------------------- Gemini AI Chat Widget Logic ------------------- */
const chatPopup = document.getElementById('chat-popup');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatHeaderAction = document.getElementById('chat-header-action');
const chatOutput = document.getElementById('chat-output');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

function toggleChat() {
    if (chatPopup.classList.contains('chat-open')) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    chatPopup.classList.add('chat-open');
    chatInput.focus();
}

function closeChat() {
    chatPopup.classList.remove('chat-open');
}

// Event Listeners for Chat Toggles
if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
if (chatHeaderAction) chatHeaderAction.addEventListener('click', toggleChat);

if (navAiChatBtn) {
    navAiChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openChat();
    });
}

// System Prompt for AI
const systemPrompt = `
    You are Raghid Muhammad's AI Assistant. Your tone is professional, direct, and slightly athletic/kinetic, matching the Nike-inspired design of this portfolio.
    Answer as Raghid himself (use "I" / "my").

    Profile Data:
    - Name: Raghid Muhammad (GITS)
    - Status: 1st Semester Software Engineering Student at Telkom University.
    - Experience: 3+ years coding, started in Vocational School (SMK).
    - Tech Stack: Python, Java, PHP (Laravel), Dart (Flutter), MySQL, Git.
    - Projects: Library System (Laravel), CLI Logic (Python), Calculator, Stopwatch (Flutter).
    - Persona: Introvert, focused, detail-oriented, perfeksionis, honest.
    - Interests: Academics, JKT48 (Ella), Investment (Mutual Funds, Crypto), Gaming (Mobile Legends, COC).
    - Philosophy: "Photography speaks, the chrome doesn't." (Minimalist, functional design).

    Guidelines:
    - Be concise (2-3 sentences max).
    - Use Markdown for emphasis.
    - Stay within the "Nike Editorial" persona: bold, absolute, neutral but energetic.
`;

// Helper: Add message to UI
function appendMessage(role, text, isLoading = false) {
    const div = document.createElement('div');
    div.className = role === 'user' ? 'user-bubble' : 'ai-bubble';

    if (isLoading) {
        div.innerHTML = `
            <div class="flex gap-1 items-center h-4 px-2">
                <div class="w-1.5 h-1.5 bg-current rounded-full typing-dot"></div>
                <div class="w-1.5 h-1.5 bg-current rounded-full typing-dot"></div>
                <div class="w-1.5 h-1.5 bg-current rounded-full typing-dot"></div>
            </div>
        `;
    } else {
        const contentHtml = role === 'model' && typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`;
        div.innerHTML = contentHtml;
    }
    
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
    return div;
}

// Handle Submit
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        appendMessage('user', userMessage);
        chatInput.value = '';
        chatInput.disabled = true;
        sendBtn.disabled = true;

        const loadingBubble = appendMessage('model', '', true);

        if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('YOUR_REAL_API_KEY')) {
                chatOutput.removeChild(loadingBubble);
                appendMessage('model', "⚠️ **API Key not configured.**");
                chatInput.disabled = false;
                sendBtn.disabled = false;
                return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });

            const data = await response.json();
            chatOutput.removeChild(loadingBubble);

            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiResponse) {
                appendMessage('model', aiResponse);
            } else {
                appendMessage('model', "I'm having trouble processing that right now.");
            }

        } catch (error) {
            chatOutput.removeChild(loadingBubble);
            console.error("Gemini Error:", error);
            appendMessage('model', "Connection error. Please try again.");
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    });
}