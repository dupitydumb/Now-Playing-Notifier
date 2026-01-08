// Now Playing Notifier Plugin
// Shows system notifications when track changes

(function () {
    'use strict';

    const NowPlayingNotifier = {
        name: 'Now Playing Notifier',
        lastTrackId: null,

        init(api) {
            console.log('[NowPlayingNotifier] Plugin initialized');
            this.api = api;

            // Check for track changes periodically
            this.checkInterval = setInterval(() => this.checkTrack(), 1000);
        },

        async checkTrack() {
            if (!this.api?.player?.getCurrentTrack) return;

            try {
                const track = await this.api.player.getCurrentTrack();
                if (track && track.id !== this.lastTrackId) {
                    this.lastTrackId = track.id;
                    this.showNotification(track);
                }
            } catch (err) {
                console.error('[NowPlayingNotifier] Error:', err);
            }
        },

        showNotification(track) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Now Playing', {
                    body: `${track.title} - ${track.artist}`,
                    icon: track.albumArt || '/icon.png',
                    silent: true
                });
            }
        },

        start() {
            console.log('[NowPlayingNotifier] Plugin started');
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
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
