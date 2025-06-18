// 企業データ（実際のデータに置き換えてください）
const companies = [
    {
        name: '企業名1',
        industry: '製造業',
        icon: 'fas fa-cogs',
        filename: '企業名1.html'
    },
    {
        name: '企業名2',
        industry: 'テクノロジー',
        icon: 'fas fa-microchip',
        filename: '企業名2.html'
    },
    {
        name: '企業名3',
        industry: '自動車',
        icon: 'fas fa-car',
        filename: '企業名3.html'
    },
    {
        name: '企業名4',
        industry: '化学',
        icon: 'fas fa-flask',
        filename: '企業名4.html'
    },
    {
        name: '企業名5',
        industry: '食品',
        icon: 'fas fa-utensils',
        filename: '企業名5.html'
    },
    {
        name: '企業名6',
        industry: '電子機器',
        icon: 'fas fa-mobile-alt',
        filename: '企業名6.html'
    },
    {
        name: '企業名7',
        industry: '建設',
        icon: 'fas fa-hard-hat',
        filename: '企業名7.html'
    },
    {
        name: '企業名8',
        industry: '繊維',
        icon: 'fas fa-tshirt',
        filename: '企業名8.html'
    },
    {
        name: '企業名9',
        industry: 'エネルギー',
        icon: 'fas fa-bolt',
        filename: '企業名9.html'
    },
    {
        name: '企業名10',
        industry: '医療機器',
        icon: 'fas fa-heartbeat',
        filename: '企業名10.html'
    },
    {
        name: '企業名11',
        industry: '航空宇宙',
        icon: 'fas fa-rocket',
        filename: '企業名11.html'
    },
    {
        name: '企業名12',
        industry: '環境',
        icon: 'fas fa-leaf',
        filename: '企業名12.html'
    }
];

// ページ読み込み後の初期化
document.addEventListener('DOMContentLoaded', function() {
    generateCompanyCards();
    initializeAnimations();
    setupScrollIndicator();
});

// 企業カードを動的に生成
function generateCompanyCards() {
    const grid = document.getElementById('companiesGrid');
    
    companies.forEach((company, index) => {
        const card = createCompanyCard(company, index);
        grid.appendChild(card);
    });
}

// 企業カードを作成
function createCompanyCard(company, index) {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="company-logo">
            <i class="${company.icon}"></i>
        </div>
        <div class="company-info">
            <h3 class="company-name">${company.name}</h3>
            <p class="company-industry">${company.industry}</p>
        </div>
    `;
    
    // クリックイベントを追加
    card.addEventListener('click', () => {
        navigateToCompany(company.filename);
    });
    
    // ホバーエフェクトを追加
    card.addEventListener('mouseenter', () => {
        playHoverSound();
    });
    
    return card;
}

// 企業ページに遷移
function navigateToCompany(filename) {
    // 実際のファイルに遷移（ファイルが存在する場合）
    window.location.href = filename;
}

// アニメーション初期化
function initializeAnimations() {
    // スクロール時のアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // 観察対象要素を追加
    document.querySelectorAll('.overview-card, .company-card').forEach(el => {
        observer.observe(el);
    });
}

// スクロールインジケーターの設定
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('.event-overview').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // スクロール時にインジケーターを非表示
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ホバー音効果（オプション）
function playHoverSound() {
    // Web Audio APIを使用した簡単な音効果
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // 音効果が再生できない場合は無視
        console.log('Audio context not available');
    }
}

// パーティクル効果（オプション）
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particleContainer.appendChild(particle);
    }
}

// ページの読み込み完了時に実行
window.addEventListener('load', () => {
    // すべてのアニメーションが準備完了
    document.body.classList.add('loaded');
});