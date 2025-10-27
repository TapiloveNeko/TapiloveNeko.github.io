// news.js
const NewsManager = {
  newsData: [],
  currentPage: 1,
  newsPerPage: 4,
  newsContainer: null,
  paginationContainer: null,
  
  init: async () => {
    NewsManager.newsContainer = document.getElementById('newsContainer');
    NewsManager.paginationContainer = document.getElementById('pagination');
    
    if (NewsManager.newsContainer && NewsManager.paginationContainer) {
      try {
        // 読み込み開始
        NewsManager.newsContainer.setAttribute('aria-busy', 'true');
        
        await NewsManager.loadNewsData();
        NewsManager.renderNewsList();
        NewsManager.renderPagination();
        
        // 読み込み完了
        NewsManager.newsContainer.setAttribute('aria-busy', 'false');
      } catch (error) {
        console.error('Error initializing news:', error);
        NewsManager.newsContainer.setAttribute('aria-busy', 'false');
        NewsManager.showError();
      }
    } else if (NewsManager.newsContainer) {
      NewsManager.initializeNewsDetail();
    }
  },
  
  loadNewsData: async () => {
    const response = await fetch('/assets/json/data.json');
    if (!response.ok) {
      throw new Error('Failed to load news data');
    }
    const data = await response.json();
    NewsManager.newsData = data.news.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  },
  
  renderNewsList: () => {
    const startIndex = (NewsManager.currentPage - 1) * NewsManager.newsPerPage;
    const endIndex = startIndex + NewsManager.newsPerPage;
    const currentNews = NewsManager.newsData.slice(startIndex, endIndex);
    
    NewsManager.newsContainer.innerHTML = '';
    
    if (currentNews.length === 0) {
      NewsManager.showNoNews();
      return;
    }
    
    currentNews.forEach(news => {
      const newsElement = NewsManager.createNewsElement(news);
      NewsManager.newsContainer.appendChild(newsElement);
    });
  },
  
  createNewsElement: (news) => {
    const article = document.createElement('article');
    article.className = 'news';
    
    const a = document.createElement('a');
    a.href = news.url || '#';
    a.className = 'news-link';
    
    // targetの設定を追加
    if (news.target) {
      a.target = news.target;
      // _blankの場合はセキュリティのためrel属性も設定
      if (news.target === '_blank') {
        a.rel = 'noopener noreferrer';
        // 新しいウィンドウで開くことを示す
        a.setAttribute('aria-label', `${news.summary}（新しいウィンドウで開きます）`);
      }
    }
    
    const date = new Date(news.date);
    const formattedDate = NewsManager.formatDate(date);
    
    a.innerHTML = `
      <div class="news-header-row">
        <time class="news-date" datetime="${news.date}">${formattedDate}</time>
        <h2 class="news-title">${news.summary}</h2>
      </div>
      <p class="news-summary">${news.detail}</p>
    `;
    
    article.appendChild(a);
    return article;
  },
  
  formatDate: (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  },
  
  renderPagination: () => {
    const totalPages = Math.ceil(NewsManager.newsData.length / NewsManager.newsPerPage);
    NewsManager.paginationContainer.innerHTML = '';
    
    // ページネーションが不要な場合（総ページ数が1以下）は何も表示しない
    if (totalPages <= 1) {
      return;
    }
    
    // nav要素にaria-labelを追加（親のnav要素が既にある前提）
    const navElement = NewsManager.paginationContainer.closest('nav');
    if (navElement && !navElement.hasAttribute('aria-label')) {
      navElement.setAttribute('aria-label', 'ニュース記事のページネーション');
    }
    
    // 「前へ」ボタンを表示（現在のページが1より大きい場合のみ）
    if (NewsManager.currentPage > 1) {
      const prevButton = NewsManager.createPaginationButton('前へ', NewsManager.currentPage - 1);
      NewsManager.paginationContainer.appendChild(prevButton);
    }
    
    // ページ番号（総ページ数が少ない場合は全て表示、多い場合は一部のみ）
    const showPageNumbers = NewsManager.getPageNumbersToShow(totalPages);
    showPageNumbers.forEach(pageNum => {
      if (pageNum === '...') {
        // 省略記号
        const ellipsis = document.createElement('li');
        ellipsis.className = 'ellipsis';
        ellipsis.setAttribute('aria-hidden', 'true');
        ellipsis.textContent = '...';
        NewsManager.paginationContainer.appendChild(ellipsis);
      } else {
        // ページ番号ボタン
        const pageButton = NewsManager.createPaginationButton(
          pageNum, 
          pageNum, 
          false, 
          pageNum === NewsManager.currentPage
        );
        NewsManager.paginationContainer.appendChild(pageButton);
      }
    });
    
    // 「次へ」ボタンを表示（現在のページが最終ページ未満の場合のみ）
    if (NewsManager.currentPage < totalPages) {
      const nextButton = NewsManager.createPaginationButton('次へ', NewsManager.currentPage + 1);
      NewsManager.paginationContainer.appendChild(nextButton);
    }
  },
  
  getPageNumbersToShow: (totalPages) => {
    const current = NewsManager.currentPage;
    const delta = 2; // 現在のページの前後に表示するページ数
    
    // 総ページ数が少ない場合は全て表示
    if (totalPages <= 7) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }
    
    const range = [];
    
    // 最初のページは常に表示
    range.push(1);
    
    // 左側の省略記号
    if (current - delta > 2) {
      range.push('...');
    }
    
    // 現在のページ周辺
    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }
    
    // 右側の省略記号
    if (current + delta < totalPages - 1) {
      range.push('...');
    }
    
    // 最後のページは常に表示
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  },
  
  createPaginationButton: (text, page, disabled = false, active = false) => {
    const li = document.createElement('li');
    if (disabled) li.className = 'disabled';
    if (active) li.className = 'is-current';
    
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = text;
    
    // 現在のページにaria-current属性を追加
    if (active) {
      a.setAttribute('aria-current', 'page');
      a.setAttribute('aria-label', `現在のページ、ページ${text}`);
    } else {
      a.setAttribute('aria-label', `ページ${text}へ移動`);
    }
    
    if (!disabled) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        NewsManager.goToPage(page);
      });
    }
    
    li.appendChild(a);
    return li;
  },
  
  goToPage: (page) => {
    NewsManager.currentPage = page;
    
    // 読み込み開始を通知
    NewsManager.newsContainer.setAttribute('aria-busy', 'true');
    
    NewsManager.renderNewsList();
    NewsManager.renderPagination();
    
    // 読み込み完了を通知
    NewsManager.newsContainer.setAttribute('aria-busy', 'false');
    
    // ページトップへスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // フォーカスをメインコンテンツへ移動
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  },
  
  showNoNews: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news" role="status">
        <h2 class="news-title">ニュースはありません</h2>
        <p class="news-summary">現在、お知らせする情報はありません。</p>
      </div>
    `;
  },
  
  showError: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news" role="alert">
        <h2 class="news-title">エラーが発生しました</h2>
        <p class="news-summary">ニュースの読み込みに失敗しました。しばらくしてから再度お試しください。</p>
      </div>
    `;
  },
  
  // 詳細ページ関連の処理
  initializeNewsDetail: () => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'news' && pathParts[2]) {
      const newsId = parseInt(pathParts[2]);
      NewsManager.loadNewsDetail(newsId);
    }
  },
  
  loadNewsDetail: async (newsId) => {
    try {
      NewsManager.newsContainer.setAttribute('aria-busy', 'true');
      
      const response = await fetch('/assets/json/data.json');
      if (!response.ok) {
        throw new Error('Failed to load news data');
      }
      const data = await response.json();
      const news = data.news.find(item => item.id === newsId);
      
      if (news) {
        NewsManager.renderNewsDetail(news);
      } else {
        NewsManager.showNotFound();
      }
      
      NewsManager.newsContainer.setAttribute('aria-busy', 'false');
    } catch (error) {
      console.error('Error loading news detail:', error);
      NewsManager.newsContainer.setAttribute('aria-busy', 'false');
      NewsManager.showDetailError();
    }
  },
  
  renderNewsDetail: (news) => {
    const date = new Date(news.date);
    const formattedDate = NewsManager.formatDetailDate(date);
    
    NewsManager.newsContainer.innerHTML = `
      <article class="news-detail">
        <header class="news-header">
          <div class="news-header-row">
            <time class="news-date" datetime="${news.date}">${formattedDate}</time>
            <h1 class="news-title">${news.summary}</h1>
          </div>
        </header>
        <div class="news-content">
          <p>${news.detail}</p>
        </div>
        <nav class="back-to-list" aria-label="ナビゲーション">
          <a href="/news">ニュース一覧へ戻る</a>
        </nav>
      </article>
    `;
  },
  
  formatDetailDate: (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  },
  
  showNotFound: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news-detail" role="status">
        <h1 class="news-title">ページが見つかりません</h1>
        <p>お探しのニュースは見つかりませんでした。</p>
        <nav class="back-to-list" aria-label="ナビゲーション">
          <a href="/news">ニュース一覧へ戻る</a>
        </nav>
      </div>
    `;
  },
  
  showDetailError: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news-detail" role="alert">
        <h1 class="news-title">エラーが発生しました</h1>
        <p>ニュースの読み込みに失敗しました。</p>
        <nav class="back-to-list" aria-label="ナビゲーション">
          <a href="/news">ニュース一覧へ戻る</a>
        </nav>
      </div>
    `;
  }
};

// NewsManagerの初期化
document.addEventListener('DOMContentLoaded', () => {
  NewsManager.init();
});