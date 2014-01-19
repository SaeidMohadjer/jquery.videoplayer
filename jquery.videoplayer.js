/**
* jquery.videoplayer.js v1.0.0 - jQuery plugin to play HTML5 video
* https://github.com/SaeidMohadjer/jquery.videoplayer
* Copyright 2014 Saeid Mohadjer
* Released under the MIT license - http://opensource.org/licenses/MIT
*/

if (typeof jQuery == 'function') {
	(function($) {
		$.fn.videoplayer = function(options) {
			if (this.length > 1){
				this.each(function() { $(this).videoplayer(options) });
				return this;
			}
			var isiPad = navigator.userAgent.match(/iPad/i) != null;			
			var settings = {
				autoplay : false,
				'control_autohide' : true, // default value is true but only kicks in when postion is set to over
				flash_src: '',
				callback: function() {}
				//position : 'below'  // 'over', 'below'
			}
			if (options) $.extend(true, settings, options);			
			
			//html5 video detection
			var supports_video = function() {
				return !!document.createElement('video').canPlayType;
			}				
			
			if (!supports_video()) {	//HTML5 video not supported		
				var url = settings.flash_src;
				$('.controller').hide();
				$('.jquery_videoplayer').empty().append('<object id="flowplayer" name="flowplayer" width="480" height="270" data="videos/flowplayer-3.2.7.swf" type="application/x-shockwave-flash">' +
					'<param name="movie" value="videos/flowplayer-3.2.7.swf" />' +
					'<param name="bgcolor" value="000000" />' + 
					'<param name="wmode" value="transparent" />' +
					'<param name="allowfullscreen" value="true" />' +
					'<param value="config={\'clip\':{\'url\':\'' + url + '\',\'autoPlay\':false,\'autoBuffering\':true, \'scaling\':\'orig\'}}" name="flashvars">' +
					'</object>');
			} else {				
				// private properties
				var video = this.get(0);					
				var controls = this.next('.controller');
				var controller_zindex_default = controls.css('z-index');			
				var playpause_btn = controls.find('.playpause');
				var audio = controls.find('.audio');		
				var progressBarWrapper = controls.find('.progressbar_wrapper');
				var pbar = controls.find('.pbar');
				var buffer = controls.find('.buffer');
				var time = controls.find('.time');
				var duration = controls.find('.duration');
				var fs_btn = controls.find('.fullscreen');
				var timer = null;
				var videoIsFullScreen = false;
				var vSlider;
				var currentElement;		
				var cursorIsOverVideo = false;			
				var icon = $(video).closest('.jquery_videoplayer').find('.video_play_icon');
				
				// private methods			
				var trackPlayProgress = function() {
					var durationIsNotAvailable = true;			
					timer = window.setInterval(function() {				
						//display video duration
						if (video.duration) {
							if (durationIsNotAvailable) {
								duration.html(formatTime(video.duration));
								durationIsNotAvailable = false;
							}
						
							if (video.buffered.end(0) < video.duration) {
								buffer.width( (video.buffered.end(0) / video.duration) * progressBarWrapper.width());					
							} else {
								buffer.width(progressBarWrapper.width());
							}
						}
						
						updateVideo();
					}, 33); 
				}
				 
				var updateVideo = function() {
					time.html(formatTime(video.currentTime));	
					if (video.duration) {
						pbar.width( (video.currentTime / video.duration) * progressBarWrapper.width());
					}	

					if (video.ended) {
						stopTrackingPlayProgress();
						//playpause_btn.trigger('click');
						settings.callback();							
					} 				
				} 
				 
				var stopTrackingPlayProgress = function(){
					clearInterval(timer);
				}
				
				var formatTime = function(seconds) {
					seconds = Math.round(seconds);
					minutes = Math.floor(seconds / 60);
					minutes = (minutes >= 10) ? minutes : "0" + minutes;
					seconds = Math.floor(seconds % 60);
					seconds = (seconds >= 10) ? seconds : "0" + seconds;
					return minutes + ":" + seconds;
				}					
			
				var setCurrentTime = function(e) {
					var left = e.pageX - progressBarWrapper.offset().left;
					var percent = left / progressBarWrapper.width();
					//if ( percent>0.99 ) percent = 0.99; //we set it to less than 1 since reaching 1 would tigger video's play event and video start playing...
					video.currentTime = percent * video.duration;
					updateVideo();
				}

				var volumeController = {			
					volume : controls.find('.volume'),
					init : function() {
						var that = this;
						this.volume.bind({
							//var volume = this.volume;
							mousedown: function(e) {
								var that = $(this);
								var volumeW = that.width();
								var volumeLeft = that.offset().left;
								e.preventDefault();
								$(document).bind({
									mousemove: function(e) {
										var x = parseInt(e.pageX - volumeLeft);	
										if (x > volumeW) x = volumeW;
										if (x < 0) x = 0;
										that.find('.slider_bar').width(x);
										video.volume = x/volumeW;
									},
									//use .one instead of .bind to bind .mouseup to document and then remove unbind('mouseup') line
									mouseup: function() {
										$(document).unbind('mousemove');
										$(document).unbind('mouseup');									
										//console.log(video.volume);
									}
								});
							}
						});
						//set volume to 50%
						that.volume.find('.slider_bar').width(this.volume.width()/2);
						video.volume = 0.5;
					}
				};
				
				var controller = {
					hide: function() {
						cursorIsOverVideo = false;
						setTimeout(function() {
							if (!cursorIsOverVideo) {
								controls.fadeOut('fast');
							}
						}, 500);				
					},
					position: function() {
						var top = parseInt( $(video).height() + $(video).offset().top - controls.outerHeight() );
						controls.css({
							top: top,
							left: (videoIsFullScreen) ? 0 : $(video).position().left,
							width: (videoIsFullScreen) ? $(window).width() : $(video).width(),
							'z-index': (videoIsFullScreen) ? $(video).css('z-index') + 1 : controller_zindex_default
						});
					}	
				};	

				var playVideo = function() {
					trackPlayProgress();
					video.play();
					playpause_btn.addClass('selected');
					if (playpause_btn.text() == "Play") playpause_btn.text('Pause');
					icon.hide();				
				}
				this.playVideo = playVideo;
				
				var pauseVideo = function() {
					stopTrackingPlayProgress();
					video.pause();
					playpause_btn.removeClass('selected');
					if (playpause_btn.text() == "Pause") playpause_btn.text('Play');
					
					//we have to use setTimeout otherwise click handler of icon fires
					setTimeout(function(){
						icon.show();	
					}, 500);						
				}
				this.pauseVideo = pauseVideo;
				
				var setHandlers = function() {
					playpause_btn.click(function(){				
						video.paused ? playVideo() : pauseVideo();
					});
					
					if (isiPad) {
						video.ontouchend = function() {
							playpause_btn.trigger('click');
						}
					} else {
						$(video).bind({
							click: function() {
								playpause_btn.trigger('click');
							},
							mouseenter: function() {
								if (settings.control_autohide) {
									cursorIsOverVideo = true;
									controls.fadeIn('fast', function() {
										//volumeController.position(); //why?
									});
								}
							},				
							mouseleave: function() {
								if (settings.control_autohide) {
									controller.hide();
								}
							}					
						});						
					}					
					
					
						
					//progress bar
					progressBarWrapper.bind({
						'mouseup': function(e) {
							setCurrentTime(e);
							trackPlayProgress();
							
						},
						'mousedown': function(e) {
							e.preventDefault();
							stopTrackingPlayProgress();
							$(document).bind({
								'mousemove' : function(e) {
									setCurrentTime(e);
								},
								'mouseup' : function() {
									$(document).unbind('mousemove');
									$(document).unbind('mouseup');
								}							
							});
						}						
					});	
							
					//audio button
					audio.bind({
						click: function() {
							if (video.muted) {
								video.muted = false;
								audio.removeClass('selected');
							} else {
								video.muted = true;		
								audio.addClass('selected');						
							}
						},
						mouseover: function() {
							currentElement = 'audio';
						}
					});					
					
					//controller autohide
					if (settings.control_autohide) {	
						controls.bind({
							mouseenter: function() {
								cursorIsOverVideo = true;
							},
							mouseleave: function() {
								controller.hide();
							}							
						});
					}		

					icon.click(function() {
						playVideo();
					});					
					
					//fullscreen button
					fs_btn.bind({
						click: function(){
							if (videoIsFullScreen) {
								$('html').css('overflow','auto');						
								$(video).css({
									width: video.videoWidth,
									height: video.videoHeight,
									position: 'static'
								});
							} else {
								$('html').css('overflow','hidden');
								$(video).css({
									width: $(window).width(),
									height: $(window).height(),
									position: 'absolute',
									//'z-index': 99999,
									top: 0,
									left: 0
								});
							}
							
							videoIsFullScreen = !videoIsFullScreen;
							videoIsFullScreen ? fs_btn.addClass('selected') : fs_btn.removeClass('selected');
							controller.position();
							positionVideoIcon();
						}					
					});
				}	
				
				//resizes fullscreen video when browser size changes
				$(window).bind({
					resize: function() {
						if (videoIsFullScreen) {
							$(video).css({
								width: $(window).width(),
								height: $(window).height()
							});					
						}
						controller.position();
					}
				});	

				var positionVideoIcon = function() {
					if (videoIsFullScreen) {
						icon.css({
							'left': ($(video).width() - $('.video_play_icon').width())/2,
							'top': ($(video).height() - controls.outerHeight() - $('.video_play_icon').height())/2,
							'margin-left': 0,
							'margin-top': 0
						});
					} else {
						icon.css({
							'margin-left': ($(video).width() - $('.video_play_icon').width())/2,
							'margin-top': ($(video).height() - controls.outerHeight() - $('.video_play_icon').height())/2,
							'top': 'auto',
							'left': 'auto'
						});					
					}
				}				
			
				var init = function() {	
					//trackPlayProgress(); //to show total time of video in control bar						
					controller.position();
					volumeController.init();
					setHandlers();
					if (settings.autoplay) playpause_btn.trigger('click');
					icon.show();
					positionVideoIcon();					
				}();
				
				return this;
			}
		}
	})(jQuery);
};		

			
