// company.js - 企業詳細ページの動的コンテンツ生成

// URLパラメータから企業IDを取得
function getCompanyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// 電話番号にハイフンを追加
function formatPhoneNumber(phone) {
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
        return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (phoneStr.length === 11) {
        return phoneStr.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneStr;
}

// メディアコンテンツを読み込み
function loadMediaContent(company) {
    const mediaContainer = document.getElementById('mediaContainer');
    
    // スライドショーがある場合
    if (company.slideshow && company.slideshow.length > 0) {
        createSlideshow(company.slideshow, company.themeColor);
        return;
    }
    
    // 単一メディア（theme）の場合
    if (!company.theme) {
        showPlaceholder('メディアコンテンツがありません', company.themeColor);
        return;
    }
    
    const themePath = company.theme;
    const fileExtension = themePath.split('.').pop().toLowerCase();
    
    let mediaElement;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        // 画像の場合
        mediaElement = document.createElement('img');
        mediaElement.src = themePath;
        mediaElement.alt = '企業のテーマ画像';
        mediaElement.className = 'media-content';
        mediaElement.onerror = () => {
            showPlaceholder('画像を読み込めませんでした', company.themeColor);
        };
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
        // 動画の場合
        mediaElement = document.createElement('video');
        mediaElement.src = themePath;
        mediaElement.className = 'media-content';
        mediaElement.controls = true;
        mediaElement.loop = true;
        mediaElement.muted = true;
        mediaElement.onerror = () => {
            showPlaceholder('動画を読み込めませんでした', company.themeColor);
        };
    } else if (['glb', 'gltf'].includes(fileExtension)) {
        // 3Dモデルの場合
        mediaElement = document.createElement('model-viewer');
        mediaElement.src = themePath;
        mediaElement.alt = '3Dモデル';
        mediaElement.setAttribute('camera-controls', '');
        mediaElement.setAttribute('auto-rotate', '');
        mediaElement.setAttribute('environment-image', 'neutral');
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.addEventListener('error', () => {
            showPlaceholder('3Dモデルを読み込めませんでした', themeColor);
        });
    } else {
        showPlaceholder('対応していないファイル形式です', themeColor);
        return;
    }
    
    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(mediaElement);
}

// プレースホルダーを表示
function showPlaceholder(message, themeColor = '#ddd') {
    const mediaContainer = document.getElementById('mediaContainer');
    mediaContainer.innerHTML = `
        <div class="image-placeholder" style="background-color: ${themeColor}; opacity: 0.3;">
            ${message}
        </div>
    `;
}

// 企業データを読み込み
async function loadCompanyData() {
    try {
        const response = await fetch('company.json');
        const companies = await response.json();
        const companyId = getCompanyIdFromUrl();
        const company = companies.find(c => c.id.toString() === companyId);
        
        if (!company) {
            console.error('企業データが見つかりません');
            return;
        }
        
        displayCompanyData(company);
    } catch (error) {
        console.error('企業データの読み込みエラー:', error);
        displayErrorMessage();
    }
}

// 企業データを表示
function displayCompanyData(company) {
    // 基本情報
    document.getElementById('companyName').textContent = company.name;
    document.getElementById('companyOverview').innerHTML = company.overview;
    document.getElementById('eventContent').innerHTML = company.eventContent;
    document.getElementById('participationFee').textContent = company.participationFee;
    
    // 企業情報
    document.getElementById('address').innerHTML = company.address;
    document.getElementById('phone').textContent = formatPhoneNumber(company.phone);
    
    const websiteLink = document.getElementById('website');
    websiteLink.href = company.website;
    websiteLink.textContent = company.website;
    
    // SNSリンク
    const snsData = company.sns;
    Object.keys(snsData).forEach(platform => {
        const link = document.getElementById(platform);
        if (link && snsData[platform] && snsData[platform] !== 'No data' && snsData[platform].trim() !== '') {
            link.href = snsData[platform];
            link.style.display = 'inline-block';
        }
    });
    
    // ブース情報を表示
    displayBoothInfo(company);
    
    // メディアコンテンツを読み込み
    loadMediaContent(company);
    
    // テーマカラーを適用
    applyThemeColor(company.themeColor);
}

// ブース情報を表示
function displayBoothInfo(company) {
    const boothTypes = ['viewBooth', 'listenBooth', 'experienceBooth'];
    const boothKeys = ['viewBooth', 'listenBooth', 'experienceBooth'];
    
    boothTypes.forEach((boothType, index) => {
        const boothElement = document.getElementById(boothType);
        const boothContent = company[boothKeys[index]];
        
        if (boothContent && boothContent.trim() !== '' && boothContent !== 'No Data') {
            boothElement.style.display = 'block';
            boothElement.querySelector('.booth-description').innerHTML = boothContent;
        } else {
            boothElement.style.display = 'none';
        }
    });
}

// テーマカラーを適用
function applyThemeColor(themeColor) {
    if (!themeColor || themeColor === '#808080') return;
    
    const root = document.documentElement;
    root.style.setProperty('--theme-color', themeColor);
    
    // 各要素にテーマカラーを適用
    const elements = document.querySelectorAll('.company-name, .event-content h2, .booth-info h2, .company-info h2');
    elements.forEach(element => {
        element.style.color = themeColor;
    });
    
    const borderElements = document.querySelectorAll('.event-content, .booth-section, .company-info');
    borderElements.forEach(element => {
        element.style.borderLeftColor = themeColor;
    });
}

// スライドショーを作成
function createSlideshow(images, themeColor = '#ddd') {
    const mediaContainer = document.getElementById('mediaContainer');
    
    if (!images || images.length === 0) {
        showPlaceholder('画像がありません', themeColor);
        return;
    }
    
    // スライドショーコンテナを作成
    const slideshowContainer = document.createElement('div');
    slideshowContainer.className = 'slideshow-container';
    
    // 画像スライドを作成
    images.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === 0) slide.classList.add('active');
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `スライド ${index + 1}`;
        img.className = 'slide-image';
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPuOCpOODoeODvOOCuOOBpOiql+OBvuOBvuOBm+OCk+OBp+OBl+OBn+OAgTwvdGV4dD4KPHN2Zz4K';
        };
        
        slide.appendChild(img);
        slideshowContainer.appendChild(slide);
    });
    
    // ナビゲーションボタンを作成
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-btn prev-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-btn next-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // インジケーターを作成
    const indicators = document.createElement('div');
    indicators.className = 'slide-indicators';
    
    images.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    slideshowContainer.appendChild(prevBtn);
    slideshowContainer.appendChild(nextBtn);
    slideshowContainer.appendChild(indicators);
    
    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(slideshowContainer);
    
    // スライドショーの状態管理
    let currentSlide = 0;
    let autoSlideInterval;
    
    function goToSlide(slideIndex) {
        const slides = slideshowContainer.querySelectorAll('.slide');
        const indicatorButtons = slideshowContainer.querySelectorAll('.indicator');
        
        // 現在のアクティブスライドを非表示
        slides[currentSlide].classList.remove('active');
        indicatorButtons[currentSlide].classList.remove('active');
        
        // 新しいスライドを表示
        currentSlide = slideIndex;
        slides[currentSlide].classList.add('active');
        indicatorButtons[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % images.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + images.length) % images.length;
        goToSlide(prevIndex);
    }
    
    // イベントリスナーを追加
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 自動スライド機能
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // 4秒ごと
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // マウスオーバーで自動スライドを停止/再開
    slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
    slideshowContainer.addEventListener('mouseleave', startAutoSlide);
    
    // キーボード操作
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // 自動スライドを開始
    startAutoSlide();
}

// エラーメッセージを表示
function displayErrorMessage() {
    document.getElementById('companyName').textContent = 'データの読み込みに失敗しました';
    document.getElementById('companyOverview').innerHTML = 'ページを再読み込みしてお試しください。';
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadCompanyData);
