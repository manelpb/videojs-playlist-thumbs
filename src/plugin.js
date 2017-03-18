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
let currentIdx = [];
let videos = [];
let playlistsElemen = null;
let players = [];
let playlistsElemens = [];

/**
* creates each video on the playlist
*/
const createVideoElement = (player_id, idx, title, thumbnail) => {
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
		let videosBefore = videos[player_id].splice(0, idx);

		videosBefore.map(function(video) {
			// adds to the end of the array
			videos[player_id].push(video);
		});

		// and play this video
		updatePlaylistAndPlay(player_id, true);
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
	videos[player.id_] = options.videos;
	currentIdx[player.id_] = 0;

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

const updatePlaylistAndPlay = (player_id, autoplay) => {
	
	if (!player_id)	{
		player_id = player.id_;
	}

	// plays the first video on the playlist
	playVideo(player_id, 0, autoplay); 

	// and move this video to the end of the playlist
	let first = videos[player_id].splice(0, 1);
	
	// then add at the end of the array
	videos[player_id].push(first[0]);

	// clean the playlist
	while (playlistsElemens[player_id].firstChild) {
	    playlistsElemens[player_id].removeChild(playlistsElemens[player_id].firstChild);
	}
	
	// add each video on the playlist
	videos.map(function(video, idx) {
		playlistsElemens[player_id].appendChild(createVideoElement(player_id, idx, video.title, video.thumbnail));
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
	var player_id = ev.target.parentNode.parentNode.id;
	nextVideo(player_id);
};

const onPrevClick = (ev) => {
	var player_id = ev.target.parentNode.parentNode.id;
	previousVideo(player_id);
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

		let playerId = p.el().id;

		if(newSize >= 0) {
		  let style = document.createElement('style');
		  let def = ' #' + playerId + '.vjs-playlist .vjs-poster { width: ' + newSize + 'px !important; }' +
			' #' + playerId + '.vjs-playlist .vjs-playlist-items { width: ' + itemWidth + 'px !important; }' +
			' #' + playerId + '.vjs-playlist .vjs-playlist-items li { width: ' + itemWidth + 'px !important; height: ' + itemHeight + 'px !important; }' +
			' #' + playerId + '.vjs-playlist .vjs-modal-dialog { width: ' + newSize + 'px !important; } ' +
			' #' + playerId + '.vjs-playlist .vjs-control-bar, #' + playerId + '.vjs-playlist .vjs-tech { width: ' + newSize + 'px !important; } ' +
			' #' + playerId + '.vjs-playlist .vjs-big-play-button, #' + playerId + '.vjs-playlist .vjs-loading-spinner { left: ' + Math.round(newSize / 2) + 'px !important; } ' +
			' #' + playerId + ' .vimeoFrame { width: ' + newSize + 'px !important; } ' +
			' #' + playerId + ' .vimeoFrame.vimeoHidden { padding-bottom: 0 !important; } ';

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
const playVideo = (player_id, idx, autoPlay) => {
	if (!player_id)	{
		player_id = player.id_;
	}
	players[player_id].pause();
	players[player_id].error(null);
	let video = { type: videos[player_id][idx].type, src: videos[player_id][idx].src};

	let curVideoId = 'vimeo_wrapper_' + player_id;
	let vimeos = players[player_id].el().getElementsByClassName('vimeoFrame');
	for (let i = 0; i < vimeos.length; i++)
	{
		vimeos[i].classList.add('vimeoHidden');
	}
	if (video.type == 'video/vimeo')
	{
		document.getElementById(curVideoId).classList.remove('vimeoHidden');
	}

	players[player_id].src(video);
	players[player_id].poster(videos[player_id][idx].thumbnail);

	if(autoPlay || players[player_id].options_.autoplay) {
		try {
			players[player_id].play();
		} catch(e) {			
		}
	}
};

/**
* plays the next video, if it comes to the end, loop 
*/
const nextVideo = (player_id) => {
	if (!player_id)	{
		player_id = player.id_;
	}
	if(currentIdx[player_id] < videos[player_id].length) {
		currentIdx[player_id]++;
	} else {
		currentIdx[player_id] = 0;
	}

	updatePlaylistAndPlay(true);
};

/**
* plays the previous video, if it comes to the first video, loop
*/
const previousVideo = (player_id) => {
	if (!player_id)	{
		player_id = player.id_;
	}
	if(currentIdx[player_id] > 0) {
		currentIdx[player_id]--;
	} else {
		currentIdx[player_id] = videos.length - 1;
	}
	playVideo(player_id, currentIdx[player_id], true);
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
  		players[player.id_] = player;
		onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('playlist', playlist);

// Include the version number.
playlist.VERSION = '__VERSION__';

export default playlist;
