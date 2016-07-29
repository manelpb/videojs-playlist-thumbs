import videojs from 'video.js';

// Default options for the plugin.
let defaults = {
	thumbnailSize : 190,
	playlistItems: 3,
	hideIcons: false,
	upNext : true,
	hideSidebar : false
};

let player;
let currentIdx = 0;
let videos = [];
let playlistsElemen = null;

/**
* creates each video on the playlist
*/
const createVideoElement = (idx, title, thumbnail) => {
	let videoElement = document.createElement("li");
	let videoTitle = document.createElement("div");
	videoTitle.className = "vjs-playlist-video-title";

	if(idx == 0) {
		if(defaults.upNext) {
			let upNext = document.createElement("div");
			upNext.className = "vjs-playlist-video-upnext";
			upNext.innerText = "UP Next";

			videoTitle.appendChild(upNext);
		}		
	}

	if(title) {		
		let videoTitleText = document.createElement("div");
		videoTitleText.innerText = title;

		videoTitle.appendChild(videoTitleText);// = "<span>" + title + "</span>";

		videoElement.appendChild(videoTitle);
	}

	videoElement.setAttribute("style", "background-image: url('"+ thumbnail +"');");
	videoElement.setAttribute("data-index", idx);

	// when the user clicks on the playlist, the video will start playing
	videoElement.onclick = function(ev) {
		var idx = parseInt(ev.target.getAttribute("data-index"));

		// updates the list and everything before this index should be moved to the end
		let videosBefore = videos.splice(0, idx);

		videosBefore.map(function(video) {
			// adds to the end of the array
			videos.push(video);
		});

		// and play this video
		updatePlaylistAndPlay(true);
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

	if(options.playlist && options.playlist.thumbnailSize) {
		defaults.thumbnailSize = options.playlist.thumbnailSize.toString().replace("px", "");
	}

	if(options.playlist && options.playlist.items) {
		defaults.playlistItems = options.playlist.items;
	}

	if(options.playlist && options.playlist.hideIcons) {
		defaults.hideIcons = options.playlist.hideIcons;
	}

	if(options.playlist && options.playlist.hideSidebar) {
		defaults.hideSidebar = options.playlist.hideSidebar;
	}

	createElements(player, options);
  	updateElementWidth(player);
};

const updatePlaylistAndPlay = (autoplay) => {
	// plays the first video on the playlist
	playVideo(0, autoplay); 

	// and move this video to the end of the playlist
	let first = videos.splice(0, 1);
	
	// then add at the end of the array
	videos.push(first[0]);

	// clean the playlist
	while (playlistsElemen.firstChild) {
	    playlistsElemen.removeChild(playlistsElemen.firstChild);
	}
	
	// add each video on the playlist
	videos.map(function(video, idx) {
		playlistsElemen.appendChild(createVideoElement(idx, video.title, video.thumbnail));
	});
};

/**
* Creates the root html elements for the playlist
*/
const createElements = (player, options) => {
	// creates the playlist items and add on the video player
	playlistsElemen = document.createElement("ul");
	playlistsElemen.className = "vjs-playlist-items";	

	if(!defaults.hideSidebar) {
		player.el().appendChild(playlistsElemen);
	}

	// plays the first video
	if(videos.length > 0) {
		updatePlaylistAndPlay(false);
	}

	// create next and previous button
	if(!defaults.hideIcons) {
		let prevBtn = document.createElement("button");
		prevBtn.className = "vjs-button-prev";
		prevBtn.onclick = onPrevClick;

		player.controlBar.el().insertBefore(prevBtn, player.controlBar.playToggle.el());

		let nextBtn = document.createElement("button");
		nextBtn.className = "vjs-button-next";
		nextBtn.onclick = onNextClick;

		player.controlBar.el().insertBefore(nextBtn, player.controlBar.volumeMenuButton.el());
	}

	// creates the loading next on video ends
	player.on("ended", createPlayingNext);

	// adds the main class on the player
  player.addClass('vjs-playlist');
};

const createPlayingNext = () => {
	nextVideo();
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
		let itemWidth = defaults.thumbnailSize;

		let playerWidth = p.el().offsetWidth;
		let playerHeight = p.el().offsetHeight;
		let itemHeight = Math.round(playerHeight / defaults.playlistItems);

		let youtube = p.$(".vjs-tech");
		let newSize = playerWidth - itemWidth;

		if(newSize >= 0) {
		  let style = document.createElement('style');
		  let def = ' ' +
		    '.vjs-playlist .vjs-poster { width: '+ newSize +'px !important; }' +
		    '.vjs-playlist .vjs-playlist-items { width: '+ itemWidth +'px !important; }'+
		    '.vjs-playlist .vjs-playlist-items li { width: '+ itemWidth +'px !important; height: '+ itemHeight +'px !important; }' +
		    '.vjs-playlist .vjs-modal-dialog { width: '+ newSize +'px !important; } ' + 
		    '.vjs-playlist .vjs-control-bar, .vjs-playlist .vjs-tech { width: '+ newSize +'px !important; } ' + 
		    '.vjs-playlist .vjs-big-play-button, .vjs-playlist .vjs-loading-spinner { left: '+ Math.round(newSize/2) +'px !important; } ';

		  style.setAttribute('type', 'text/css');
		  document.getElementsByTagName('head')[0].appendChild(style);

		  if(style.styleSheet) {
	      style.styleSheet.cssText = def;
	    } else {
	      style.appendChild(document.createTextNode(def));
	    }
		}
	};

	if(!defaults.hideSidebar) {
		window.onresize = function() {
			resize(player);
		};

		if(player) {
			resize(player);
		}
	}
};

/**
* plays the video based on an index
*/
const playVideo = (idx, autoPlay) => {
	let video = { type: videos[idx].type, src: videos[idx].src};

	player.src(video);
	player.poster(videos[idx].thumbnail);

	if(autoPlay || player.options_.autoplay) {
		try {
			player.play();
		} catch(e) {			
		}
	}
};

/**
* plays the next video, if it comes to the end, loop 
*/
const nextVideo = () => {
	if(currentIdx < videos.length) {
		currentIdx++;
	} else {
		currentIdx = 0;
	}

	updatePlaylistAndPlay(true);
};

/**
* plays the previous video, if it comes to the first video, loop
*/
const previousVideo = () => {
	if(currentIdx > 0) {
		currentIdx--;
	} else {
		currentIdx = videos.length - 1;
	}
	playVideo(currentIdx, true);
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
  		player = this;
		onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('playlist', playlist);

// Include the version number.
playlist.VERSION = '__VERSION__';

export default playlist;
