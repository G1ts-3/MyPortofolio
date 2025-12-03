import { GEMINI_API_KEY } from './config.js';

// Inisialisasi AOS (Animasi Scroll)
AOS.init({
    once: true,
    mirror: false,
    offset: 50,
    duration: 600,
    easing: 'ease-out',
    disable: 'mobile'
});

/* ------------------- UI Logic (Navbar & Theme) ------------------- */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const desktopToggle = document.getElementById('theme-toggle-desktop');
const mobileToggle = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;
const moonIcon = '<i class="fas fa-moon"></i>';
const sunIcon = '<i class="fas fa-sun text-yellow-500"></i>';

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));
}

function checkTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateIcons(true);
    } else {
        html.classList.remove('dark');
        updateIcons(false);
    }
}

function updateIcons(isDark) {
    const icon = isDark ? sunIcon : moonIcon;
    if (desktopToggle) desktopToggle.innerHTML = icon;
    if (mobileToggle) mobileToggle.innerHTML = icon;
}

function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
        updateIcons(false);
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
        updateIcons(true);
    }
}

if (desktopToggle) desktopToggle.addEventListener('click', toggleTheme);
if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
checkTheme();

/* ------------------- Language Logic (i18n) ------------------- */
const langBtnDesktop = document.getElementById('lang-btn-desktop');
const langDropdownDesktop = document.getElementById('lang-dropdown-desktop');
const langLabel = document.getElementById('current-lang-label');
const langBtnMobile = document.getElementById('lang-btn-mobile');

const translations = {
    en: {
        nav_home: "Home", nav_about: "About", nav_skills: "Skills", nav_projects: "Projects", nav_ai: "AI Chat", nav_contact: "Contact",
        hero_subtitle: "Software Engineering Student", hero_greeting: "Hello, I am", hero_desc: "1st Semester Student who has been coding since Vocational School. Focused on building efficient and functional software solutions.",
        btn_projects: "View Projects", btn_contact: "Contact Me",
        about_title: "About Me", about_p1: "My journey in the world of technology started in the <strong>1st grade of Vocational School (SMK)</strong>. Early interest in programming logic led me to experiment with various languages like Java and Python.", about_p2: "Currently, I am pursuing a <strong>Bachelor's in Software Engineering (Semester 1)</strong> to deepen my understanding of software architecture. I believe that a strong foundation since SMK and high curiosity are the keys to becoming a reliable engineer.",
        stat_edu: "Software Engineering", stat_exp_val: "3+ Years", stat_exp_label: "Coding (Since SMK)", stat_focus_val: "Full Stack", stat_focus_label: "Main Interest",
        skills_title: "Tech Stack & Skills", skill_backend: "Backend & Logic", skill_frontend: "Frontend & Mobile", skill_tools: "Data & Tools",
        proj_title: "My Projects", proj_desc: "Some results of exploration and tasks I have done, ranging from basic logic, web apps, to mobile.",
        p1_title: "Library Information System", p1_desc: "Web app for borrowing and returning books. Built using Laravel framework and MySQL database.",
        p2_title: "Cashier & Game Program", p2_desc: "Collection of Python logic programs: Simple cashier simulation and Rock Paper Scissors game.",
        p3_title: "Calculator App", p3_desc: "Basic math logic exploration implemented in three different languages for comparative study.",
        p4_title: "Stopwatch & Timer", p4_desc: "Simple Android app for measuring time developed using Android Studio.",
        ai_title: "Ask Virtual Git", ai_desc: "Curious about my experience or projects? Ask my AI Assistant trained with this portfolio data.", ai_welcome: "Hello! I'm Git's AI assistant. You can ask me about coding skills, projects, or background. What would you like to know? 😊",
        contact_title: "Connect with Me", contact_desc: "Interested in discussing technology or viewing my code in more detail?", btn_email: "Send Email",
        btn_github_all: "View All Projects on GitHub →"
    },
    id: {
        nav_home: "Beranda", nav_about: "Tentang", nav_skills: "Keahlian", nav_projects: "Proyek", nav_ai: "Tanya AI", nav_contact: "Kontak",
        hero_subtitle: "Mahasiswa Software Engineering", hero_greeting: "Halo, saya", hero_desc: "Mahasiswa semester 1 yang telah menekuni dunia koding sejak SMK. Fokus membangun solusi perangkat lunak yang efisien dan fungsional.",
        btn_projects: "Lihat Proyek", btn_contact: "Hubungi Saya",
        about_title: "Tentang Saya", about_p1: "Perjalanan saya di dunia teknologi dimulai sejak saya duduk di bangku <strong>kelas 1 SMK</strong>. Ketertarikan awal pada logika pemrograman membawa saya untuk bereksperimen dengan berbagai bahasa seperti Java dan Python.", about_p2: "Saat ini, saya sedang menempuh pendidikan <strong>S1 Software Engineering (Semester 1)</strong> untuk memperdalam pemahaman saya tentang arsitektur perangkat lunak. Saya percaya bahwa fondasi yang kuat sejak SMK dan rasa ingin tahu yang tinggi adalah kunci untuk menjadi engineer yang handal.",
        stat_edu: "Software Engineering", stat_exp_val: "3+ Tahun", stat_exp_label: "Koding (Sejak SMK)", stat_focus_val: "Full Stack", stat_focus_label: "Minat Utama",
        skills_title: "Tech Stack & Keahlian", skill_backend: "Backend & Logika", skill_frontend: "Frontend & Mobile", skill_tools: "Data & Tools",
        proj_title: "Proyek Saya", proj_desc: "Beberapa hasil eksplorasi dan tugas yang telah saya kerjakan, mulai dari logika dasar, aplikasi web, hingga mobile.",
        p1_title: "Sistem Informasi Perpustakaan", p1_desc: "Aplikasi web untuk peminjaman dan pengembalian buku. Dibangun menggunakan Laravel dan MySQL.",
        p2_title: "Program Kasir & Game", p2_desc: "Kumpulan program logika Python: Simulasi kasir sederhana dan game Gunting Batu Kertas.",
        p3_title: "Aplikasi Kalkulator", p3_desc: "Eksplorasi logika matematika dasar yang diimplementasikan dalam tiga bahasa berbeda untuk studi komparasi.",
        p4_title: "Stopwatch & Timer", p4_desc: "Aplikasi Android sederhana untuk mengukur waktu yang dikembangkan menggunakan Android Studio.",
        ai_title: "Tanya Virtual Git", ai_desc: "Penasaran tentang pengalaman atau proyek saya? Tanyakan pada Asisten AI saya yang sudah dilatih dengan data portofolio ini.", ai_welcome: "Halo! Saya asisten AI Git. Kamu bisa tanya tentang skill koding, proyek, atau latar belakang pendidikan Git. Mau tanya apa? 😊",
        contact_title: "Terhubung dengan Saya", contact_desc: "Tertarik berdiskusi tentang teknologi atau melihat kode saya lebih detail?", btn_email: "Kirim Email",
        btn_github_all: "Lihat Semua Proyek di GitHub →"
    },
    ja: {
        nav_home: "ホーム", nav_about: "プロフィール", nav_skills: "スキル", nav_projects: "プロジェクト", nav_ai: "AIチャット", nav_contact: "お問い合わせ",
        hero_subtitle: "ソフトウェア工学専攻 学生", hero_greeting: "こんにちは、私は", hero_desc: "職業高校（SMK）1年生からプログラミングを始めた、ソフトウェア工学専攻の大学1年生です。効率的で機能的なソフトウェアソリューションの構築に注力しています。",
        btn_projects: "プロジェクトを見る", btn_contact: "連絡する",
        about_title: "私について", about_p1: "テクノロジーの世界への旅は、<strong>職業高校（SMK）1年生</strong>の時に始まりました。プログラミングロジックへの興味から、JavaやPythonなど様々な言語に触れるようになりました。", about_p2: "現在は、<strong>ソフトウェア工学の学士課程（1学期）</strong>で、ソフトウェアアーキテクチャへの理解を深めています。SMK時代からの強固な基礎と好奇心が、信頼できるエンジニアになる鍵だと信じています。",
        stat_edu: "ソフトウェア工学", stat_exp_val: "3年以上", stat_exp_label: "プログラミング歴", stat_focus_val: "フルスタック", stat_focus_label: "主な関心分野",
        skills_title: "技術スタック & スキル", skill_backend: "バックエンド & ロジック", skill_frontend: "フロントエンド & モバイル", skill_tools: "データ & ツール",
        proj_title: "マイプロジェクト", proj_desc: "基本的なロジックからWebアプリ、モバイルアプリまで、これまでの学習と課題の成果です。",
        p1_title: "図書館情報システム", p1_desc: "本の貸出・返却管理Webアプリ。LaravelフレームワークとMySQLデータベースを使用。",
        p2_title: "レジ & ゲームプログラム", p2_desc: "Pythonロジックプログラム集：簡易レジシミュレーションとじゃんけんゲーム。",
        p3_title: "電卓アプリ", p3_desc: "比較学習のために3つの異なる言語で実装された基本的な数学ロジックの探求。",
        p4_title: "ストップウォッチ & タイマー", p4_desc: "Android Studioを使用して開発された、時間を計測するシンプルなAndroidアプリ。",
        ai_title: "バーチャルGitに質問", ai_desc: "私の経験やプロジェクトについて気になりますか？このポートフォリオデータでトレーニングされたAIアシスタントに聞いてみてください。", ai_welcome: "こんにちは！GitのAIアシスタントです。コーディングスキル、プロジェクト、経歴について質問できます。何を知りたいですか？😊",
        contact_title: "連絡先", contact_desc: "技術についての議論や、コードの詳細に興味がありますか？", btn_email: "メールを送る",
        btn_github_all: "GitHubですべてのプロジェクトを見る →"
    },
    zh: {
        nav_home: "主页", nav_about: "关于", nav_skills: "技能", nav_projects: "项目", nav_ai: "AI 聊天", nav_contact: "联系",
        hero_subtitle: "软件工程专业学生", hero_greeting: "你好，我是", hero_desc: "从职业高中开始编程的第一学期大学生。专注于构建高效实用的软件解决方案。",
        btn_projects: "查看项目", btn_contact: "联系我",
        about_title: "关于我", about_p1: "我的技术之旅始于<strong>职业高中一年级</strong>。对编程逻辑的早期兴趣促使我尝试了 Java 和 Python 等各种语言。", about_p2: "目前，我正在攻读<strong>软件工程学士学位（第一学期）</strong>，以加深对软件架构的理解。我相信，自高中打下的坚实基础和强烈的好奇心是成为一名可靠工程师的关键。",
        stat_edu: "软件工程", stat_exp_val: "3+ 年", stat_exp_label: "编程（自职高起）", stat_focus_val: "全栈", stat_focus_label: "主要兴趣",
        skills_title: "技术栈与技能", skill_backend: "后端与逻辑", skill_frontend: "前端与移动端", skill_tools: "数据与工具",
        proj_title: "我的项目", proj_desc: "我完成的一些探索和任务成果，从基础逻辑到网络应用及移动端开发。",
        p1_title: "图书馆信息系统", p1_desc: "用于借阅和归还书籍的 Web 应用程序。使用 Laravel 框架和 MySQL 数据库构建。",
        p2_title: "收银与游戏程序", p2_desc: "Python 逻辑程序集合：简单的收银模拟和石头剪刀布游戏。",
        p3_title: "计算器应用", p3_desc: "用三种不同语言实现的基础数学逻辑探索，用于比较研究。",
        p4_title: "秒表与计时器", p4_desc: "使用 Android Studio 开发的简单 Android 计时应用。",
        ai_title: "询问虚拟 Git", ai_desc: "对我的经验或项目感到好奇吗？请询问我已经过此作品集数据训练的 AI 助手。", ai_welcome: "你好！我是 Git 的 AI 助手。你可以问我关于编程技能、项目或背景的问题。你想知道什么？😊",
        contact_title: "与我联系", contact_desc: "有兴趣讨论技术或更详细地查看我的代码吗？", btn_email: "发送邮件",
        btn_github_all: "在 GitHub 上查看所有项目 →"
    },
    ko: {
        nav_home: "홈", nav_about: "소개", nav_skills: "기술", nav_projects: "프로젝트", nav_ai: "AI 채팅", nav_contact: "연락처",
        hero_subtitle: "소프트웨어 공학 학생", hero_greeting: "안녕하세요, 저는", hero_desc: "직업 고등학교 때부터 코딩을 해온 1학년 대학생입니다. 효율적이고 기능적인 소프트웨어 솔루션을 구축하는 데 집중하고 있습니다.",
        btn_projects: "프로젝트 보기", btn_contact: "연락하기",
        about_title: "저에 대해", about_p1: "저의 기술 여정은 <strong>직업 고등학교 1학년</strong> 때 시작되었습니다. 프로그래밍 논리에 대한 초기 관심으로 Java 및 Python과 같은 다양한 언어를 실험하게 되었습니다.", about_p2: "현재 저는 소프트웨어 아키텍처에 대한 이해를 깊게 하기 위해 <strong>소프트웨어 공학 학사 과정(1학기)</strong>을 밟고 있습니다. 고등학교 때부터 다져온 탄탄한 기초와 높은 호기심이 신뢰할 수 있는 엔지니어가 되는 열쇠라고 믿습니다.",
        stat_edu: "소프트웨어 공학", stat_exp_val: "3년 이상", stat_exp_label: "코딩 (고교 시절부터)", stat_focus_val: "풀 스택", stat_focus_label: "주요 관심사",
        skills_title: "기술 스택 및 능력", skill_backend: "백엔드 및 로직", skill_frontend: "프론트엔드 및 모바일", skill_tools: "데이터 및 도구",
        proj_title: "내 프로젝트", proj_desc: "기본 로직부터 웹 앱, 모바일에 이르기까지 제가 수행한 탐구 및 과제의 결과물입니다.",
        p1_title: "도서관 정보 시스템", p1_desc: "책 대출 및 반납을 위한 웹 앱입니다. Laravel 프레임워크와 MySQL 데이터베이스를 사용하여 구축되었습니다.",
        p2_title: "계산원 및 게임 프로그램", p2_desc: "Python 로직 프로그램 모음: 간단한 계산원 시뮬레이션 및 가위바위보 게임.",
        p3_title: "계산기 앱", p3_desc: "비교 연구를 위해 세 가지 다른 언어로 구현된 기초 수학 로직 탐구입니다.",
        p4_title: "스톱워치 및 타이머", p4_desc: "Android Studio를 사용하여 개발된 간단한 시간 측정 Android 앱입니다.",
        ai_title: "가상 Git에게 질문하기", ai_desc: "제 경험이나 프로젝트가 궁금하신가요? 이 포트폴리오 데이터로 훈련된 제 AI 비서에게 물어보세요.", ai_welcome: "안녕하세요! Git의 AI 비서입니다. 코딩 기술, 프로젝트 또는 배경에 대해 물어보실 수 있습니다. 무엇을 도와드릴까요? 😊",
        contact_title: "연결하기", contact_desc: "기술에 대해 논의하거나 제 코드를 더 자세히 보고 싶으신가요?", btn_email: "이메일 보내기",
        btn_github_all: "GitHub에서 모든 프로젝트 보기 →"
    },
    ar: {
        nav_home: "الرئيسية", nav_about: "من أنا", nav_skills: "المهارات", nav_projects: "المشاريع", nav_ai: "محادثة AI", nav_contact: "تواصل",
        hero_subtitle: "طالب هندسة برمجيات", hero_greeting: "مرحباً، أنا", hero_desc: "طالب في الفصل الدراسي الأول يبرمج منذ المدرسة الثانوية المهنية. أركز على بناء حلول برمجية فعالة وعملية.",
        btn_projects: "عرض المشاريع", btn_contact: "تواصل معي",
        about_title: "عني", about_p1: "بدأت رحلتي في عالم التكنولوجيا منذ <strong>الصف الأول في المدرسة الثانوية المهنية</strong>. قادني اهتمامي المبكر بمنطق البرمجة إلى تجربة لغات مختلفة مثل Java و Python.", about_p2: "حالياً، أدرس <strong>بكالوريوس هندسة البرمجيات (الفصل الأول)</strong> لتعميق فهمي لهندسة البرمجيات. أؤمن أن الأساس القوي منذ الثانوية والفضول العالي هما المفتاح لأصبح مهندساً موثوقاً.",
        stat_edu: "هندسة البرمجيات", stat_exp_val: "+3 سنوات", stat_exp_label: "برمجة (منذ الثانوية)", stat_focus_val: "فول ستاك", stat_focus_label: "الاهتمام الرئيسي",
        skills_title: "التقنيات والمهارات", skill_backend: "الخلفية والمنطق", skill_frontend: "الواجهة والهاتف", skill_tools: "البيانات والأدوات",
        proj_title: "مشاريعي", proj_desc: "بعض نتائج الاستكشاف والمهام التي أنجزتها، من المنطق الأساسي وتطبيقات الويب إلى تطبيقات الهاتف.",
        p1_title: "نظام معلومات المكتبة", p1_desc: "تطبيق ويب لاستعارة وإرجاع الكتب. مبني باستخدام إطار عمل Laravel وقاعدة بيانات MySQL.",
        p2_title: "برنامج الكاشير والألعاب", p2_desc: "مجموعة برامج منطقية بـ Python: محاكاة كاشير بسيطة ولعبة حجر-ورقة-مقص.",
        p3_title: "تطبيق الآلة الحاسبة", p3_desc: "استكشاف للمنطق الرياضي الأساسي تم تنفيذه بثلاث لغات مختلفة للدراسة المقارنة.",
        p4_title: "ساعة إيقاف ومؤقت", p4_desc: "تطبيق Android بسيط لقياس الوقت تم تطويره باستخدام Android Studio.",
        ai_title: "اسأل Git الافتراضي", ai_desc: "هل لديك فضول حول خبرتي أو مشاريعي؟ اسأل مساعد الذكاء الاصطناعي المدرب ببيانات هذا الملف الشخصي.", ai_welcome: "مرحباً! أنا مساعد الذكاء الاصطناعي الخاص بـ Git. يمكنك سؤالي عن مهارات البرمجة أو المشاريع أو الخلفية. ماذا تود أن تعرف؟ 😊",
        contact_title: "تواصل معي", contact_desc: "هل أنت مهتم بمناقشة التكنولوجيا أو رؤية الكود الخاص بي بمزيد من التفصيل؟", btn_email: "إرسال بريد إلكتروني",
        btn_github_all: "عرض جميع المشاريع على GitHub →"
    }
};

// Toggle Desktop Dropdown
if(langBtnDesktop) {
    langBtnDesktop.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdownDesktop.classList.toggle('hidden');
    });
}

// Mobile toggle cycles languages
const langsList = ['en', 'id', 'ja', 'zh', 'ko', 'ar']; // Updated list
if(langBtnMobile) {
    langBtnMobile.addEventListener('click', () => {
        let current = localStorage.getItem('lang') || 'en';
        let idx = langsList.indexOf(current);
        let next = langsList[(idx + 1) % langsList.length];
        setLanguage(next);
    });
}

// Close dropdown when clicking outside
window.addEventListener('click', () => {
    if(langDropdownDesktop && !langDropdownDesktop.classList.contains('hidden')) {
        langDropdownDesktop.classList.add('hidden');
    }
});

// Expose setLanguage globally so onclick in HTML works
window.setLanguage = function(lang) {
    // 1. Fade out text
    const elements = document.querySelectorAll('.fade-lang');
    elements.forEach(el => el.classList.add('opacity-0'));

    // 2. Wait for fade out, then change text and fade in
    setTimeout(() => {
        localStorage.setItem('lang', lang);
        const data = translations[lang];
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                if(el.innerHTML.includes('<strong>')) { 
                        el.innerHTML = data[key];
                } else {
                        el.textContent = data[key];
                }
            }
        });

        // Update Label
        if(langLabel) langLabel.textContent = lang.toUpperCase();

        // Handle RTL for Arabic
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('font-arabic');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('font-arabic');
        }

        // Fade in
        elements.forEach(el => el.classList.remove('opacity-0'));
    }, 300); // Match transition duration
};

// Init Lang on Load (Default EN)
const savedLang = localStorage.getItem('lang') || 'en';
window.setLanguage(savedLang);


/* ------------------- Gemini AI Logic ------------------- */
const chatOutput = document.getElementById('chat-output');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Konteks Sistem (Data Portofolio untuk AI)
const systemPrompt = `
            Kamu adalah asisten AI untuk website portofolio milik Git (Raghid Muhammad). 
            Tugasmu adalah menjawab pertanyaan pengunjung tentang Git secara profesional, singkat, jelas, menarik, interaktif, gaul, dan ramah.

            Berikut adalah data profil Git:

            - **Nama:** Git (Raghid Muhammad)   
            - **Status Saat Ini:** Mahasiswa Semester 1, S1 Software Engineering di Telkom University.   
            - **Pengalaman Coding:** Mulai belajar sejak kelas 1 SMK; lebih dari 3 tahun belajar.   
            - **Kepribadian:** ISFP-T (Adventurer).   
            - **Umur/Kelahiran:** 18/10 juni .
            - **Sekolah SMK:** SMK Telkom Jakarta.
            - **Kuliah di:** Telkom University Bandung.
            - **Asal:** Jakarta Selatan.
            - **Zodiak/Bintang:** Gemini.
            - **Gol. Darah:** O.
            - **Status Saat Ini:** Mahasiswa Semester 1, S1 Software Engineering di Telkom University.
            - **Kebiasaan Bahasa:** Menggunakan sapaan "aku-kamu" untuk percakapan santai.

            - **Keahlian Utama:**
                - **Backend:** Python, Java, PHP, Laravel, Dart.
                - **Frontend/Mobile:** HTML5, CSS3, Tailwind CSS, Flutter.
                - **Database/Tools:** MySQL, PHPMyAdmin, Git, Android Studio, VS Code, Sublime Text.

            - **Proyek yang Pernah Dibuat:**
                1. **Sistem Informasi Perpustakaan:** Web app (Laravel + MySQL + Bootstrap) untuk peminjaman/pengembalian buku.
                2. **Program Kasir & Game:** Proyek CLI Python (logika kasir sederhana & game suit).
                3. **Aplikasi Kalkulator:** Dibuat dalam Java, Python, dan HTML/CSS untuk perbandingan logika.
                4. **Stopwatch & Timer:** Aplikasi Android menggunakan Flutter & Dart.
                5. **Halaman Web Dealer Management System (DMS):** Proyek laporan kerja praktik.
                6. **Smart Personal Finance Automation** Saya membangun sebuah sistem asisten berbasis AI untuk membantu keuangan pribadi yang menghubungkan Telegram langsung ke Google Sheets.

            - **Jika User tertarik dengan proyek, bisa langsung melihat ke GitHub/Social Media ku.**
            - **Jika User bertanya dimana Sistem automatisasi keuangan, bisa langsung melihat ke GitHub/Social Media ku(bilang karna Git belum menambahkannya di Portofolio ini).**
            
            - **Investasi:** Memiliki investasi reksadana (Majoris Pasar Uang Syariah Indonesia, Majoris Sukuk Negara Indonesia), saham,   
            dan crypto (BTC) melalui Pluang.   

            - **Ketertarikan:** - Perkembangan akademik di kampus.   
            - JKT48 (oshi: Gabriela Abigail/Ella). 
            - Investasi Reksadana, obligasi, dan saham. 

            - **Sifat Git (Blak-blakan & Jujur):**
            - Pendiam di awal, tapi hangat dan nyaman kalau sudah kenal.
            - Lebih suka komunikasi langsung ke inti, kurang suka basa-basi.
            - Introvert: senang bekerja dalam suasana tenang dan fokus.
            - Sensitif kalau lagi capek atau overstimulated, biasanya memilih menyendiri dulu.
            - Teliti dan cenderung perfeksionis saat mengerjakan tugas atau coding.
            - Tidak suka keributan atau drama; lebih prefer suasana stabil.
            - Setia pada komitmen dan konsisten ketika sudah memulai sesuatu.
            - Punya humor yang kering dan kadang nyeletuk spontan.

            - **Pengalaman:** Internship di PT. Magna Solusindo (6 Bulan Sebagai Support Developer, Mulai dari Frontend, Backend, dan mengelola Database perusahaan).

            - **Hobi:** - Bermain game mobile legend(rank saat ini mythic honor), Clash of Clans(Saat ini TH 13)
            - membaca manga romance.
            - menonton animasi di youtube(tekotok, podton, serena).
            - mononton podcast di youtube (Hanya podhub, namun agak sedih podcastnya udh galanjut lagi).

            - **Kontak:** Email: raghidmuhammad3@gmail.com   
            WhatsApp: +6281381222576   
            GitHub: G1ts-3   
            LinkedIn: Raghid Muhammad
            Instagram: @raghm_
            X / Twitter: @ramaa3_

            **Panduan Jawaban:**
            - Jawab sebagai Git(jadi kalo ditanya 'kamu' jawab pake 'aku')
            - Jawab dalam **bahasa yang sama** dengan pertanyaan pengunjung.
            - Answer in the **same language** as the user's question (English, Indonesian, Japanese, etc).
            - Jawaban harus singkat, padat, dan relevan (maksimal 3-4 kalimat kecuali diminta detail).
            - Gunakan Markdown bila perlu (bold, list).
            - Jika ditanya mengenai hal yang tidak ada dalam profil (misalnya hobi masak), jawab dengan sopan bahwa kamu hanya mengetahui informasi profesional Git.
            - Tunjukkan antusiasme mengenai perjalanan Git dari SMK hingga masuk Telkom University.
            `;

// Helper: Tambah pesan ke UI
function appendMessage(role, text, isLoading = false) {
    const div = document.createElement('div');
    div.className = `flex items-start gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`;
    
    const avatar = role === 'user' 
        ? `<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300"><i class="fas fa-user"></i></div>`
        : `<div class="w-8 h-8 rounded-full bg-primary/20 dark:bg-green-900/40 flex-shrink-0 flex items-center justify-center text-primary dark:text-green-400 text-xs">AI</div>`;
    
    const bubbleClass = role === 'user'
        ? `bg-primary text-white rounded-2xl rounded-tr-none shadow-md`
        : `bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 prose dark:prose-invert prose-sm max-w-none`;

    let contentHtml = '';
    if (isLoading) {
        contentHtml = `
            <div class="flex gap-1 items-center h-6 px-2">
                <div class="w-2 h-2 bg-current rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-current rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-current rounded-full typing-dot"></div>
            </div>
        `;
    } else {
        contentHtml = role === 'model' && typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`;
    }

    div.innerHTML = `
        ${avatar}
        <div class="${bubbleClass} p-3 px-4 max-w-[85%]">
            ${contentHtml}
        </div>
    `;
    
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto scroll ke bawah
    return div;
}

// Handle Submit
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // 1. Tampilkan pesan user
        appendMessage('user', userMessage);
        chatInput.value = '';
        chatInput.disabled = true;
        sendBtn.disabled = true;

        // 2. Tampilkan loading bubble
        const loadingBubble = appendMessage('model', '', true);

        // Gunakan API Key dari config.js
        if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('YOUR_REAL_API_KEY')) {
                chatOutput.removeChild(loadingBubble);
                appendMessage('model', "⚠️ **API Key belum diatur.** Pemilik situs perlu mengatur key di file `config.js`.");
                chatInput.disabled = false;
                sendBtn.disabled = false;
                return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

        // 3. Panggil Gemini API
        try {
            const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        const res = await fetch(url, options);
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return await res.json();
                    } catch (err) {
                        if (i === retries - 1) throw err;
                        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                    }
                }
            };

            const payload = {
                contents: [{ parts: [{ text: userMessage }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };

            const data = await fetchWithRetry(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            chatOutput.removeChild(loadingBubble);

            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiResponse) {
                appendMessage('model', aiResponse);
            } else {
                appendMessage('model', "Maaf, aku lagi loading banget nih.");
            }

        } catch (error) {
            chatOutput.removeChild(loadingBubble);
            console.error("Gemini Error:", error);
            appendMessage('model', "Maaf, ada gangguan koneksi sepertinya.");
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    });
}