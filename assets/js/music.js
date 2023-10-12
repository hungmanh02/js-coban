/**
 * 1. Render sóng
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");

const app = {
  isPlaying: false,
  currentIndex: 0,
  songs: [
    {
      name: "Chờ Em Đến Bao Giờ? (New Mix)",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-2.jpg",
    },
    {
      name: "Hoa Cỏ Lau (Cukak Remix)",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-3.jpg",
    },
    {
      name: "Hoa Cỏ La",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-1.jpg",
    },
    {
      name: "Chờ Em Đến Bao Giờ? (New Mix)",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-3.jpg",
    },
    {
      name: "Hoa Cỏ Lau (Cukak Remix)",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-2.jpg",
    },
    {
      name: "Hoa Cỏ La",
      singer: "Phong Max",
      path: "./assets/music/ChoEmDenBaoGioNewMix-PhongMax-11822395.mp3",
      image: "./assets/images/song-1.jpg",
    },
  ],
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
        <div class="song" data-index="">
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        _this.isPlaying = false;
        audio.pause();
        player.classList.remove("playing");
      } else {
        _this.isPlaying = true;
        audio.play();
        player.classList.add("playing");
      }
    };
  },
  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.definedProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};
app.start();
