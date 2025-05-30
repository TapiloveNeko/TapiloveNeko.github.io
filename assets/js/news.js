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
        await NewsManager.loadNewsData();
        NewsManager.renderNewsList();
        NewsManager.renderPagination();
      } catch (error) {
        console.error('Error initializing news:', error);
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
    const a = document.createElement('a');
    a.href = news.url || '#';
    a.className = 'news-link';
    
    // targetの設定を追加
    if (news.target) {
      a.target = news.target;
      // _blankの場合はセキュリティのためrel属性も設定
      if (news.target === '_blank') {
        a.rel = 'noopener noreferrer';
      }
    }
    
    const div = document.createElement('div');
    div.className = 'news';
    
    const date = new Date(news.date);
    const formattedDate = NewsManager.formatDate(date);
    
    div.innerHTML = `
      <div class="news-header-row">
        <div class="news-date">${formattedDate}</div>
        <h3 class="news-title">${news.summary}</h3>
      </div>
      <p class="news-summary">${news.detail}</p>
    `;
    
    a.appendChild(div);
    return a;
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
        ellipsis.textContent = '...';
        NewsManager.paginationContainer.appendChild(ellipsis);
      } else {
        // ページ番号ボタン
        const pageButton = NewsManager.createPaginationButton(pageNum, pageNum, false, pageNum === NewsManager.currentPage);
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
    NewsManager.renderNewsList();
    NewsManager.renderPagination();
    
    // ページトップへスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },
  
  showNoNews: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news">
        <h5 class="news-title">ニュースはありません</h5>
        <p class="news-summary">現在、お知らせする情報はありません。</p>
      </div>
    `;
  },
  
  showError: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news">
        <h5 class="news-title">エラーが発生しました</h5>
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
    } catch (error) {
      console.error('Error loading news detail:', error);
      NewsManager.showDetailError();
    }
  },
  
  renderNewsDetail: (news) => {
    const date = new Date(news.date);
    const formattedDate = NewsManager.formatDetailDate(date);
    
    NewsManager.newsContainer.innerHTML = `
      <div class="news-detail">
        <div class="news-header">
          <div class="news-header-row">
            <div class="news-date">${formattedDate}</div>
            <h1 class="news-title">${news.summary}</h1>
          </div>
        </div>
        <div class="news-content">
          <p>${news.detail}</p>
        </div>
        <div class="back-to-list">
          <a href="/news">ニュース一覧へ戻る</a>
        </div>
      </div>
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
      <div class="news-detail">
        <h1 class="news-title">ページが見つかりません</h1>
        <p>お探しのニュースは見つかりませんでした。</p>
        <div class="back-to-list">
          <a href="/news">ニュース一覧へ戻る</a>
        </div>
      </div>
    `;
  },
  
  showDetailError: () => {
    NewsManager.newsContainer.innerHTML = `
      <div class="news-detail">
        <h1 class="news-title">エラーが発生しました</h1>
        <p>ニュースの読み込みに失敗しました。</p>
        <div class="back-to-list">
          <a href="/news">ニュース一覧へ戻る</a>
        </div>
      </div>
    `;
  }
};

// NewsManagerの初期化
document.addEventListener('DOMContentLoaded', () => {
  NewsManager.init();
});