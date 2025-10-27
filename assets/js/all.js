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
    const scriptTag = document.querySelector('script[src*="all.js"]');
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
    overlay.setAttribute('aria-hidden', 'true');
    header.appendChild(overlay);

    const closeMenu = () => {
      body.classList.remove("nav-open");
      menutitle.innerText = "MENU";
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'メニューを開く');
    };

    hamburger.addEventListener("click", () => {
      const isOpen = body.classList.contains("nav-open");
      
      if (isOpen) {
        closeMenu();
      } else {
        body.classList.add("nav-open");
        menutitle.innerText = "BACK";
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'メニューを閉じる');
      }
    });

    overlay.addEventListener("click", closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  },

  setCurrentPageLink: () => {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.header-menu-list-link, .footer-menu-list-link');
    
    menuLinks.forEach(link => {
      link.style.color = '';
      
      const linkPath = link.getAttribute('href');
      const isTopPage = currentPath === '/' || currentPath === '/index.html';
      
      if (linkPath === 'index.html') {
        if (isTopPage) {
          link.style.color = 'red';
        }
      } else if (currentPath === linkPath || (linkPath.startsWith('/') && currentPath === linkPath)) {
        link.style.color = 'red';
      }
    });
  },

  setBackgroundColors: () => {
    const currentPath = window.location.pathname;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    const isTopPage = currentPath === '/' || 
      currentPath === '/index.html';
    
    if (header) {
      if (isTopPage) {
        header.style.backgroundImage = 'url(/assets/img/top/img_2022-11-26-16-13-37.jpg)';
        header.style.backgroundSize = 'cover';
        header.style.backgroundPosition = 'center';
        header.style.backgroundAttachment = 'fixed';
      } else {
        header.style.backgroundColor = '#000000';
      }
    }
    
    if (footer) {
      footer.style.backgroundColor = isTopPage ? 'transparent' : '#000000';
    }
  },

  handleSNSVisibility: () => {
    const currentPath = window.location.pathname;
    const snsSection = document.querySelector('.sns');
    
    if (snsSection) {
      const isTopPage = currentPath === '/' || 
        currentPath === '/index.html';
      
      snsSection.style.display = isTopPage ? 'block' : 'none';
    }
  }
};

// main.js - 機能の初期化
document.addEventListener('DOMContentLoaded', () => {
  HeaderFooter.init();
});