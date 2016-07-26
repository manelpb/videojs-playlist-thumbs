# videojs-playlist-thumbs

Continous plays videos and display the list on a sidebar with thumbnail and title 

![alt tag](https://raw.githubusercontent.com/manelpb/videojs-playlist-thumbs/master/screenshot.png)

## Installation

```sh
npm install --save videojs-playlist-thumbs
```

## Usage

To include videojs-playlist on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-youtube/dist/Youtube.js"></script>
<script src="//path/to/videojs-playlist.min.js"></script>
<link href="//path/to/videojs-playlist.css" rel="stylesheet">

<script>
  var player = videojs('my-video', { preload: true, techOrder: ["youtube", "html5"], controls: true});
  var videosList = [
  	{
      "src" : "https://www.youtube.com/watch?v=fk4BbF7B29w",
      "type": "video/youtube",
      "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "thumbnail": "https://i.ytimg.com/vi/fk4BbF7B29w/hqdefault.jpg"
    },
    {
      "src" : "https://www.youtube.com/watch?v=_gMq3hRLDD0",
      "type": "video/youtube",
      "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "thumbnail": "https://i.ytimg.com/vi/_gMq3hRLDD0/hqdefault.jpg"
    }
  ];

  player.playlist({ videos: videosList, playlist: { hideSidebar: false, upNext: true, hideIcons: false, thumbnailSize: 300, items: 3 } });
</script>
```

## Documentation

### videos

You should pass an array of objects with the following structure

```
var playlist = [
        {
          "src" : "https://www.youtube.com/watch?v=fk4BbF7B29w",
          "type": "video/youtube",
          "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "thumbnail": "https://i.ytimg.com/vi/fk4BbF7B29w/hqdefault.jpg"
        },
        {
          "src" : "http://vjs.zencdn.net/v/oceans.mp4",
          "type": "video/mp4",
          "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "thumbnail": "https://i.ytimg.com/vi/nmcdLOjGVzw/hqdefault.jpg"
        },
        {
          "src" : "https://www.youtube.com/watch?v=_gMq3hRLDD0",
          "type": "video/youtube",
          "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "thumbnail": "https://i.ytimg.com/vi/_gMq3hRLDD0/hqdefault.jpg"
        },
        {
          "src" : "https://www.youtube.com/watch?v=_wYtG7aQTHA",
          "type": "video/youtube",
          "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "thumbnail": "https://i.ytimg.com/vi/_wYtG7aQTHA/hqdefault.jpg"
        }
      ];
```

### playlist options

#### hideSidebar

It just hides the side bar, but the playlist keeps working

#### upNext

Shows a legend on the first video of the list

#### hideIcons

Hides the buttons (next/prev) on the control bar

#### thumbnailSize

Size of the video thumbnail on the sidebar

#### items

Number of videos on the sidebar 


## License

MIT. Copyright (c) Emmanuel Alves / http://github.com/manelpb


[videojs]: http://videojs.com/
