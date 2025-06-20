// masterpiece.js
const MasterpieceGallery = {
  currentIndex: 0,
  artworks: [
    {
      name: "ダイナミックな神獣たち",
      technique: "モダンテクニック",
      year: "2013年（中学1年）",
      imageSrc: "assets/img/masterpiece/img_masterpiece1.jpg",
    },
    {
      name: "海に浮かぶ城",
      technique: "スクラッチ絵",
      year: "2015年（中学3年）",
      imageSrc: "assets/img/masterpiece/img_masterpiece2.jpg",
    },
    {
      name: "平屋建専用住宅設計図",
      technique: "製図",
      year: "2018年（高校2年）",
      imageSrc: "assets/img/masterpiece/img_masterpiece3.jpg",
    },
    {
      name: "二級建築士 製図練習",
      technique: "製図",
      year: "2018年（高校2年）",
      imageSrc: "assets/img/masterpiece/img_masterpiece4.jpg",
    },
    {
      name: "Cats Cafe",
      technique: "製図",
      year: "2019年（高校3年）",
      imageSrc: "assets/img/masterpiece/img_masterpiece5.jpg",
    }
  ],
  init: () => {
    const container = document.querySelector('.masterpiece-container');
    if (container) {
      MasterpieceGallery.artworks.forEach((artwork, index) => {
        container.appendChild(MasterpieceGallery.generateArtworkHTML(artwork, index));
      });
      MasterpieceGallery.initializeModal();
    }
  },
  generateArtworkHTML: (artwork, index) => {
    const artworkTable = document.createElement("li");
    artworkTable.className = "masterpiece-detail";

    const imageID = `openModal-${index}`;
    artworkTable.innerHTML = `
      <div id="${imageID}" class="img-wrap">
        <img src="${artwork.imageSrc}" alt="${artwork.name}" class="c-img">
      </div>
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

    const modal = document.querySelector(".outside-modal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          MasterpieceGallery.closeModal();
        }
      });
    }
  },
  openModal: (imageSrc, artworkName) => {
    const modal = document.querySelector(".outside-modal");
    if (!modal) return;

    modal.style.display = "flex";
    modal.style.animation = "zoomIn 0.3s ease-in";
    
    const modalImg = document.querySelector(".inside-modal img");
    if (modalImg) {
      modalImg.setAttribute("src", imageSrc);
      modalImg.setAttribute("alt", artworkName);
    }

    MasterpieceGallery.currentIndex = MasterpieceGallery.artworks.findIndex(
      (artwork) => artwork.imageSrc === imageSrc
    );
    MasterpieceGallery.handleButtonState();
  },

  closeModal: () => {
    const modal = document.querySelector(".outside-modal");
    if (!modal) return;
    const handleAnimationEnd = () => {
      modal.style.display = "none";
      modal.removeEventListener("animationend", handleAnimationEnd);
    };
    
    modal.addEventListener("animationend", handleAnimationEnd);
    modal.style.animation = "zoomOut 0.3s ease-out";
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
    const modalImg = document.querySelector(".inside-modal img");
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
      forwardButton.disabled = MasterpieceGallery.currentIndex === 0;
      forwardButton.style.visibility = MasterpieceGallery.currentIndex === 0 ? "hidden" : "visible";
    }

    if (backButton) {
      const maxIndex = MasterpieceGallery.artworks.length - 1;
      backButton.disabled = MasterpieceGallery.currentIndex === maxIndex;
      backButton.style.visibility = MasterpieceGallery.currentIndex === maxIndex ? "hidden" : "visible";
    }
  }
};

// MasterpieceGalleryの初期化
document.addEventListener('DOMContentLoaded', () => {
  MasterpieceGallery.init();
});