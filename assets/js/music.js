/**
 * 1. Render sóng
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song ( render lại, nhưng dữ liệu lớn thì làm xóa class)
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MP3_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  isPlaying: false,
  isRanDom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  currentIndex: 0,
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
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
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div class="thumb" style="background-image: url('${
            song.image
          }')"></div>
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
    playlist.innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Khi song được phép play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi tiến độ bài hát thay đổi

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Xử lý next song
    nextBtn.onclick = function () {
      if (_this.isRanDom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý prev song
    prevBtn.onclick = function () {
      if (_this.isRanDom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    randomBtn.onclick = function () {
      _this.isRanDom = !_this.isRanDom;
      _this.setConfig("isRanDom", _this.isRanDom);
      randomBtn.classList.toggle("active", _this.isRanDom);
    };

    // Xử lý lặp lại một song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended (kết thúc thì next song)
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
          console.log(songNode.dataset.index);
        }

        // xử lý khi click vào song của option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  //load config
  loadConfig: function () {
    this.isRanDom = this.config.isRanDom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  start: function () {
    // Gán cấu hình từ config vao ứng dụng
    this.loadConfig();
    // Định nghĩa các thuộc tính cho object
    this.definedProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiện thị trạng thái ban đầu của  button repeat & random
    randomBtn.classList.toggle("active", this.isRanDom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
