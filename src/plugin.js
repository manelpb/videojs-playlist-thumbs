import videojs from 'video.js';

// Default options for the plugin.
const defaults = {};
let current = 0;
let videos = [];
let playlistsElemen = null;
let prevBtn;
let nextBtn;

const createVideoElement = (idx, title, thumbnail) => {
	let videoElement = document.createElement("li");
	videoElement.innerHtml = "<span>"+ title +"</span>"
	videoElement.style = "background-image: url('"+ thumbnail +"');";
	videoElement.setAttribute("data-index", idx);

	videoElement.onclick = function(ev) {
		var idx = parseInt(ev.target.getAttribute("data-index"));

		playVideo(idx, true);

		console.log(idx);
	};

	return videoElement;
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
	videos = options.videos;

	createElements(player);
  updateElementWidth(player);
};

/**
* Creates the root html elements for the playlist
*/
const createElements = (player) => {
	let playerId = player.el().id;

	playlistsElemen = document.createElement("ul");
	playlistsElemen.className = "vjs-playlist-items";

	player.el().appendChild(playlistsElemen);

	videos.map(function(video, idx) {
		playlistsElemen.appendChild(createVideoElement(idx, video.title, video.thumbnail));
	});

	if(videos.length > 0) {
		playVideo(0);
	}

	// create next and previous button
	prevBtn = document.createElement("button");
	prevBtn.className = "vjs-button-prev";
	prevBtn.onclick = onPrevClick;

	player.controlBar.el().insertBefore(prevBtn, player.controlBar.playToggle.el());

	nextBtn = document.createElement("button");
	nextBtn.className = "vjs-button-next";
	nextBtn.onclick = onNextClick;

	player.controlBar.el().insertBefore(nextBtn, player.controlBar.volumeMenuButton.el());

  player.addClass('vjs-playlist');
};

const onNextClick = (ev) => {
	nextVideo();
};

const onPrevClick = (ev) => {
	previousVideo();
};

/**
* updates the main video player width
*/
const updateElementWidth = (player) => {
	let resize = function(p) {	
		let playlistWidth = playlistsElemen.offsetWidth;
		let playerWidth = p.el().offsetWidth;
		let youtube = p.$(".vjs-tech");
		let newSize = playerWidth - playlistWidth;
		let controllers = player.$(".vjs-control-bar");
		let modals = player.$(".vjs-modal-dialog");
		let buttoms = player.$(".vjs-big-play-button");

		player.$(".vjs-big-play-button").style = "margin-left: -110px";
		player.$(".vjs-loading-spinner").style = "margin-left: -90px";

		/*var innerElemnts = player.children();
		innerElemnts.map(function(item) {
			item.style = "width: " + newSize + "px !important";
		});*/

		if(newSize >= 0) {
			modals.style = 
				controllers.style = 
					youtube.style = "width: " + newSize + "px !important";
		}

		console.log(newSize, playlistWidth);
	};

	window.onresize = function() {
		resize(player);
	};

	if(player) {
		resize(player);
	}
};

const playVideo = (idx, autoPlay) => {
	let video = { type: videos[idx].type, src: videos[idx].src};
	player.src(video);
	player.poster(videos[idx].thumbnail);

	if(autoPlay) {
		try {
				player.play();
		} catch(e) {
			console.log(e);
		}
	}
};

const nextVideo = () => {
	if(current < videos.length) {
		current++;
	} else {
		current = 0;
	}

	console.log(current);
	playVideo(current, true);
};

const previousVideo = () => {
	if(current > 0) {
		current--;
	} else {
		current = videos.length - 1;
	}

	console.log(current);
	playVideo(current, true);
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function playlist
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const playlist = function(options) {
  this.ready(() => {
  	onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('playlist', playlist);

// Include the version number.
playlist.VERSION = '__VERSION__';

export default playlist;
