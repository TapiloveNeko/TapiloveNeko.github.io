// masterpiece.js
const MasterpieceGallery = {
  currentIndex: 0,
  focusedElementBeforeModal: null,
  scrollPositionBeforeModal: 0,
  artworks: [
    {
      name: "ダイナミックな神獣たち",
      technique: "モダンテクニック",
      year: "2013年（中学1年）",
      imageSrc: "/assets/img/masterpiece/img_masterpiece1.jpg",
    },
    {
      name: "海に浮かぶ城",
      technique: "スクラッチ絵",
      year: "2015年（中学3年）",
      imageSrc: "/assets/img/masterpiece/img_masterpiece2.jpg",
    },
    {
      name: "平屋建専用住宅設計図",
      technique: "製図",
      year: "2018年（高校2年）",
      imageSrc: "/assets/img/masterpiece/img_masterpiece3.jpg",
    },
    {
      name: "二級建築士 製図練習",
      technique: "製図",
      year: "2018年（高校2年）",
      imageSrc: "/assets/img/masterpiece/img_masterpiece4.jpg",
    },
    {
      name: "Cats Cafe",
      technique: "製図",
      year: "2019年（高校3年）",
      imageSrc: "/assets/img/masterpiece/img_masterpiece5.jpg",
    }
  ],
  init: () => {
    const container = document.querySelector('.masterpiece-container');
    if (container) {
      MasterpieceGallery.artworks.forEach((artwork, index) => {
        container.appendChild(MasterpieceGallery.generateArtworkHTML(artwork, index));
      });
      MasterpieceGallery.initializeModal();
      MasterpieceGallery.initializeKeyboardNavigation();
    }
  },
  generateArtworkHTML: (artwork, index) => {
    const artworkTable = document.createElement("li");
    artworkTable.className = "masterpiece-detail";

    const imageID = `openModal-${index}`;
    artworkTable.innerHTML = `
      <button id="${imageID}" class="img-wrap" aria-label="${artwork.name}を拡大表示">
        <img src="${artwork.imageSrc}" alt="${artwork.name}" class="c-img">
      </button>
      <dl class="c-description-list">
        <dt class="c-text--bold">作品名</dt>
        <dd class="c-text">${artwork.name}</dd>

        <dt class="c-text--bold">絵画技法</dt>
        <dd class="c-text">${artwork.technique}</dd>

        <dt class="c-text--bold">制作年</dt>
        <dd class="c-text">${artwork.year}</dd>
      </dl>
    `;
    artworkTable
      .querySelector(`#${imageID}`)
      .addEventListener("click", () => MasterpieceGallery.openModal(artwork.imageSrc, artwork.name));

    return artworkTable;
  },
  initializeModal: () => {
    document.getElementById("closeModal")
      ?.addEventListener("click", MasterpieceGallery.closeModal);

    document.getElementById("forwardButton")
      ?.addEventListener("click", () => MasterpieceGallery.changeImage(-1));

    document.getElementById("backButton")
      ?.addEventListener("click", () => MasterpieceGallery.changeImage(1));

    const modal = document.getElementById("modalOverlay");
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          MasterpieceGallery.closeModal();
        }
      });
    }
  },
  initializeKeyboardNavigation: () => {
    document.addEventListener('keydown', (e) => {
      const modalOverlay = document.getElementById('modalOverlay');
      if (modalOverlay && modalOverlay.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') {
          MasterpieceGallery.closeModal();
        } else if (e.key === 'ArrowLeft') {
          MasterpieceGallery.changeImage(-1);
        } else if (e.key === 'ArrowRight') {
          MasterpieceGallery.changeImage(1);
        }
      }
    });
  },
  openModal: (imageSrc, artworkName) => {
    const modal = document.getElementById("modalOverlay");
    if (!modal) return;
  
    MasterpieceGallery.focusedElementBeforeModal = document.activeElement;
    MasterpieceGallery.scrollPositionBeforeModal = window.scrollY;
  
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = "flex";
    modal.style.animation = "zoomIn 0.3s ease-in";
    
    const modalImg = document.getElementById("modalImage");
    if (modalImg) {
      modalImg.setAttribute("src", imageSrc);
      modalImg.setAttribute("alt", artworkName);
    }
  
    MasterpieceGallery.currentIndex = MasterpieceGallery.artworks.findIndex(
      (artwork) => artwork.imageSrc === imageSrc
    );
    MasterpieceGallery.handleButtonState();
  
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
      closeButton.focus();
    }
  
    MasterpieceGallery.enableFocusTrap();
  },

  closeModal: () => {
    const modal = document.getElementById("modalOverlay");
    if (!modal) return;
    
    const handleAnimationEnd = () => {
      modal.style.display = "none";
      modal.setAttribute('aria-hidden', 'true');
      modal.removeEventListener("animationend", handleAnimationEnd);
  
      window.scrollTo(0, MasterpieceGallery.scrollPositionBeforeModal);
      
      if (MasterpieceGallery.focusedElementBeforeModal) {
        MasterpieceGallery.focusedElementBeforeModal.focus({ preventScroll: true });
      }
    };
    
    modal.addEventListener("animationend", handleAnimationEnd);
    modal.style.animation = "zoomOut 0.3s ease-out";
  
    MasterpieceGallery.disableFocusTrap();
  },
  changeImage: (direction) => {
    const maxIndex = MasterpieceGallery.artworks.length - 1;
    MasterpieceGallery.currentIndex += direction;

    if (MasterpieceGallery.currentIndex < 0) {
      MasterpieceGallery.currentIndex = 0;
    } else if (MasterpieceGallery.currentIndex > maxIndex) {
      MasterpieceGallery.currentIndex = maxIndex;
    }

    const currentArtwork = MasterpieceGallery.artworks[MasterpieceGallery.currentIndex];
    const modalImg = document.getElementById("modalImage");
    if (modalImg) {
      modalImg.setAttribute("src", currentArtwork.imageSrc);
      modalImg.setAttribute("alt", currentArtwork.name);
    }
    
    MasterpieceGallery.handleButtonState();
  },
  handleButtonState: () => {
    const forwardButton = document.getElementById("forwardButton");
    const backButton = document.getElementById("backButton");
    
    if (forwardButton) {
      const isDisabled = MasterpieceGallery.currentIndex === 0;
      forwardButton.disabled = isDisabled;
      forwardButton.style.visibility = isDisabled ? "hidden" : "visible";
      forwardButton.setAttribute('aria-hidden', isDisabled ? 'true' : 'false');
      forwardButton.tabIndex = isDisabled ? -1 : 0;
    }
    
    if (backButton) {
      const maxIndex = MasterpieceGallery.artworks.length - 1;
      const isDisabled = MasterpieceGallery.currentIndex === maxIndex;
      backButton.disabled = isDisabled;
      backButton.style.visibility = isDisabled ? "hidden" : "visible";
      backButton.setAttribute('aria-hidden', isDisabled ? 'true' : 'false');
      backButton.tabIndex = isDisabled ? -1 : 0;
    }
  },
  enableFocusTrap: () => {
    const modal = document.getElementById('masterpieceModal');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]):not([aria-hidden="true"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    MasterpieceGallery.trapFocusHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener('keydown', MasterpieceGallery.trapFocusHandler);
  },

  disableFocusTrap: () => {
    const modal = document.getElementById('masterpieceModal');
    if (modal && MasterpieceGallery.trapFocusHandler) {
      modal.removeEventListener('keydown', MasterpieceGallery.trapFocusHandler);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MasterpieceGallery.init();
});