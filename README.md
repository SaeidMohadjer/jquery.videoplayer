jquery.videoplayer
==================

HTML5 Video Player based on jQuery

<h4>Features</h4>
<ul>
	<li>Flash fallback for non-HTML5 browsers via Flowplayer (free for commercial use)</li>
	<li>Parameters:
		<table class="options">
			<tr><th>Name</th><th>Value</th></tr>
			<tr><td>autoplay</td><td>true, false</td></tr>
			<tr><td>control_autohide</td><td>true, false</td></tr>
		</table>						
	</li>
</ul>
<h4>Bugs/issues</h4>
<ul>
	<li>In webkit browsers going from fullsize to normal size video is displayed in it's actual dimensions rather than respecting video's width and height attributes</li>
	<li>In Webkit progress bar is shorter than in Firefox</li>					
	<li>Flash version doesn't work in IE9's IE8 mode (but works in IE7 mode)</li>
</ul>
<h4>Wish List</h4>
<ul>
	<li>Poster image support</li>
	<li>Show video duration before playback starts</li>
	<li>Show a large play button that sits at the center of video when video is paused</li>
	<li>Hide controller if cursor is on video but stops moving, unhide as soon as cursor moves again</li>			
	<li>Do you have built a fallback for not supported video formats too? So if there is only a mp4 source for html5 firefox can not play it. Is firefox falling back to flash player to play the mp4?</li>
	<li>Can you make fade in, fade out and delay for navigationbar configurable?</li>
	<li>Do you have integrated fullscree-api? I know its not in firefox yet but fullscreen api is coming with firefox10 and I think it's a pretty cool feature</li>
</ul>
<h4>References</h4>
<ul>
	<li><a href="http://www.w3.org/2010/05/video/mediaevents.html">HTML5 Video Events and API</a></li>
	<li><a href="http://blog.steveheffernan.com/2010/04/how-to-build-an-html5-video-player/">how-to-build-an-html5-video-player</a></li>
	<li><a href="http://videojs.com/">videojs</a></li>
	<li><a href="http://people.mozilla.com/~cpearce/buffered-demo.html">buffered-demo</a></li>
	<li><a href="http://sublimevideo.net/">http://sublimevideo.net/</a></li>
	<li><a href="http://flowplayer.org/index.html">flowplayer</a></li>
</ul>