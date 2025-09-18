// script.js - メインページの動的コンテンツ生成

// 企業データを読み込み
async function loadCompanies() {
    try {
        const response = await fetch('company.json');
        const companies = await response.json();
        generateCompanyCards(companies);
    } catch (error) {
        console.error('企業データの読み込みエラー:', error);
        // エラー時は既存の静的コンテンツを維持
    }
}

// 企業カードを動的に生成
function generateCompanyCards(companies) {
    const grid = document.querySelector('.company-grid');
    
    // 既存のカードをクリア
    grid.innerHTML = '';
    
    companies.forEach((company, index) => {
        const card = createCompanyCard(company, index);
        grid.appendChild(card);
    });
}

// 企業カードを作成
function createCompanyCard(company, index) {
    const card = document.createElement('a');
    card.className = 'company-card';
    card.href = `company.html?id=${company.id}`;
    card.style.animationDelay = `${index * 0.1}s`;
    
    // テーマカラーがある場合は適用
    if (company.themeColor && company.themeColor !== '#808080') {
        card.style.borderColor = company.themeColor;
    }
    
    // 業種に基づいてアイコンを取得（フォールバック付き）
    const iconHtml = company.industry ? getIndustryIcon(company.industry) : getCompanyEmoji(company.id);
    
    card.innerHTML = `
        <div class="emoji">${iconHtml}</div>
        <span>${company.name}</span>
    `;
    
    // ホバーエフェクトを追加
    card.addEventListener('mouseenter', () => {
        if (company.themeColor && company.themeColor !== '#808080') {
            card.style.backgroundColor = company.themeColor + '20'; // 透明度20%
        }
        playHoverSound();
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.backgroundColor = '#fff';
    });
    
    return card;
}

// 業種に基づいてアイコンを取得
function getIndustryIcon(industry) {
    const industryIcons = {
        '金属加工': '<i class="fas fa-hammer"></i>',
        'ばね製造': '<i class="fas fa-circle-notch"></i>',
        '縫製': '<i class="fas fa-cut"></i>',
        '木工': '<i class="fas fa-tree"></i>',
        '溶接': '<i class="fas fa-fire"></i>',
        '歯車製造': '<i class="fas fa-cog"></i>',
        '建材製造': '<i class="fas fa-building"></i>',
        '測量・建設機械': '<i class="fas fa-ruler-combined"></i>',
        '機械製造': '<i class="fas fa-wrench"></i>',
        '電子機器': '<i class="fas fa-microchip"></i>',
        '自動車': '<i class="fas fa-car"></i>',
        '化学': '<i class="fas fa-flask"></i>',
        '食品': '<i class="fas fa-utensils"></i>',
        '医療機器': '<i class="fas fa-heartbeat"></i>',
        'エネルギー': '<i class="fas fa-bolt"></i>',
        '環境': '<i class="fas fa-leaf"></i>',
        '樹脂成型': '<i class="fas fa-cube"></i>',
        'FA装置製造': '<i class="fas fa-robot"></i>',
        '精密加工': '<i class="fas fa-drafting-compass"></i>',
        'その他': '<i class="fas fa-industry"></i>'
    };
    
    return industryIcons[industry] || industryIcons['その他'];
}

// 企業IDに基づいてエモジを取得（フォールバック用）
function getCompanyEmoji(id) {
    const iconClasses = [
        '<i class="fas fa-cog"></i>', '<i class="fas fa-wrench"></i>', '<i class="fas fa-industry"></i>', 
        '<i class="fas fa-hammer"></i>', '<i class="fas fa-tools"></i>', '<i class="fas fa-hard-hat"></i>', 
        '<i class="fas fa-bolt"></i>', '<i class="fas fa-cube"></i>', '<i class="fas fa-building"></i>', 
        '<i class="fas fa-car"></i>', '<i class="fas fa-microchip"></i>', '<i class="fas fa-robot"></i>', 
        '<i class="fas fa-cut"></i>', '<i class="fas fa-fire"></i>', '<i class="fas fa-dharmachakra"></i>'
    ];
    return iconClasses[(id - 1) % iconClasses.length];
}

// ページ読み込み後の初期化
document.addEventListener('DOMContentLoaded', function() {
    loadCompanies();
    initializeAnimations();
    setupScrollIndicator();
});

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
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.overview').scrollIntoView({
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

// ページの読み込み完了時に実行
window.addEventListener('load', () => {
    // すべてのアニメーションが準備完了
    document.body.classList.add('loaded');
});