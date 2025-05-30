// header-footer.js
const HeaderFooter = {
  init: async () => {
    try {
      await HeaderFooter.loadHeader();
      await HeaderFooter.loadFooter();
      HeaderFooter.initHamburgerMenu();
      HeaderFooter.setCurrentPageLink();
      HeaderFooter.setBackgroundColors();
      HeaderFooter.handleSNSVisibility();
    } catch (error) {
      console.error('Error initializing header/footer:', error);
    }
  },

  loadHeader: async () => {
    const headerResponse = await fetch('/assets/include/header.html');
    const headerData = await headerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerData);
  },

  loadFooter: async () => {
    const footerResponse = await fetch('/assets/include/footer.html');
    const footerData = await footerResponse.text();
    const scriptTag = document.querySelector('script[src="/assets/js/all.js"]');
    if (scriptTag) {
      scriptTag.insertAdjacentHTML('beforebegin', footerData);
    }
  },

  initHamburgerMenu: () => {
    const body = document.body;
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger-menu-btn");
    const menutitle = document.querySelector(".hamburger-menu-guide-text");

    const overlay = document.createElement("div");
    overlay.classList.add("nav-overlay");
    header.appendChild(overlay);

    // メニューを閉じる処理
    const closeMenu = () => {
      body.classList.remove("nav-open");
      menutitle.innerText = "MENU";
    };

    // クリックイベントの設定
    hamburger.addEventListener("click", () => {
      body.classList.toggle("nav-open");
      menutitle.innerText = menutitle.innerText === "MENU" ? "BACK" : "MENU";
    });

    overlay.addEventListener("click", closeMenu);

    // レスポンシブ対応
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  },
  setCurrentPageLink: () => {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.header-menu-list-link, .footer-menu-list-link');
    
    menuLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      if (
        currentPath.endsWith(linkPath) || 
        (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))
      ) {
        link.style.color = 'red';
      }
    });
  },
  setBackgroundColors: () => {
    const currentPath = window.location.pathname;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    const isIndexPage = currentPath === '/' || 
      currentPath.endsWith('/') || 
      currentPath.endsWith('index.html');
    
    if (header) {
      if (isIndexPage) {
        header.style.backgroundImage = 'url(/assets/img/top/img_2022-11-26-16-13-37.jpg)';
        header.style.backgroundSize = 'cover';
        header.style.backgroundPosition = 'center';
        header.style.backgroundAttachment = 'fixed';
      } else {
        header.style.backgroundColor = '#000000';
      }
    }
    
    if (footer) {
      footer.style.backgroundColor = isIndexPage ? 'transparent' : '#000000';
    }
  },
  handleSNSVisibility: () => {
    const currentPath = window.location.pathname;
    const snsSection = document.querySelector('.sns');
    
    if (snsSection) {
      const isIndexPage = currentPath === '/' || 
        currentPath.endsWith('/') || 
        currentPath.endsWith('index.html');
      
      snsSection.style.display = isIndexPage ? 'block' : 'none';
    }
  }
};

// main.js - 機能の初期化
document.addEventListener('DOMContentLoaded', () => {
  HeaderFooter.init();
});