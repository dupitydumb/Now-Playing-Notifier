// Now Playing Notifier Plugin
// Shows system notifications when track changes

(function () {
    'use strict';

    const NowPlayingNotifier = {
        name: 'Now Playing Notifier',
        lastTrackId: null,

        init(api) {
            console.log('[NowPlayingNotifier] Plugin initialized with API:', api);
            this.api = api;

            // Check for track changes periodically
            this.checkInterval = setInterval(() => this.checkTrack(), 1000);
        },

        checkTrack() {
            if (!this.api?.player?.getCurrentTrack) {
                console.log('[NowPlayingNotifier] No getCurrentTrack API');
                return;
            }

            try {
                // API returns value directly (not a promise)
                const track = this.api.player.getCurrentTrack();

                if (track && track.id !== this.lastTrackId) {
                    console.log('[NowPlayingNotifier] Track changed:', track.title);
                    this.lastTrackId = track.id;
                    this.showNotification(track);
                }
            } catch (err) {
                console.error('[NowPlayingNotifier] Error:', err);
            }
        },

        showNotification(track) {
            console.log('[NowPlayingNotifier] Showing notification for:', track.title);

            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification('Now Playing', {
                        body: `${track.title || 'Unknown'} - ${track.artist || 'Unknown Artist'}`,
                        silent: true
                    });
                } else {
                    console.log('[NowPlayingNotifier] Notification permission:', Notification.permission);
                }
            }
        },

        start() {
            console.log('[NowPlayingNotifier] Plugin started');
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    console.log('[NowPlayingNotifier] Permission result:', permission);
                });
            }
        },

        stop() {
            console.log('[NowPlayingNotifier] Plugin stopped');
        },

        destroy() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }
            console.log('[NowPlayingNotifier] Plugin destroyed');
        }
    };

    // Register plugin globally
    window.NowPlayingNotifier = NowPlayingNotifier;
    window.AudionPlugin = NowPlayingNotifier;
})();
