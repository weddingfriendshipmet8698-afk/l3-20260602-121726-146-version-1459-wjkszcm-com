function initPlayer(videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hlsInstance = null;
    var loaded = false;

    if (!video || !overlay || !source) {
        return;
    }

    function attachSource() {
        if (loaded) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
        loaded = true;
    }

    function startPlayback() {
        attachSource();
        overlay.style.display = 'none';
        video.setAttribute('controls', 'controls');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    overlay.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
        if (!loaded || video.paused) {
            startPlayback();
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
