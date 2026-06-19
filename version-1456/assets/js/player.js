document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("video-player");
  var trigger = document.getElementById("play-trigger");

  if (!video || !trigger) {
    return;
  }

  var source = trigger.getAttribute("data-source");
  var hlsInstance = null;

  function playVideo() {
    if (!source) {
      return;
    }

    trigger.classList.add("is-hidden");

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          trigger.classList.remove("is-hidden");
        });
      });

      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal && hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
          video.src = source;
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", function () {
        video.play().catch(function () {
          trigger.classList.remove("is-hidden");
        });
      }, { once: true });
    } else {
      video.src = source;
      video.play().catch(function () {
        trigger.classList.remove("is-hidden");
      });
    }
  }

  trigger.addEventListener("click", playVideo);
});
