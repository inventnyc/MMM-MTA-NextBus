/* Magic Mirror
 * Node Helper: MMM-MTA-NextBus
 *
 * By tie624
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	/**
	 * Called when a socket notification arrives.
	 * @param {string} notification - The identifier of the notification.
	 * @param {object} payload - The payload of the notification.
	 */
	socketNotificationReceived(notification, payload) {
		if (notification === "CONFIG") {
			this.config = payload;
			this.getData();

			setInterval(() => {
				this.getData();
			}, this.config.updateInterval);
		} else if (notification === "GET_DATA") {
			this.getData();
		}
	},

	/**
	 * Fetches bus arrival data from the MTA Bus Time API.
	 */
	async getData() {
		const url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${this.config.apiKey}&version=2&OperatorRef=MTA&MonitoringRef=${this.config.busStopCode}`;

		try {
			const response = await fetch(url);

			if (response.status === 401) {
				console.error(this.name, "Unauthorized - check your API key");
				this.sendSocketNotification("ERROR", "Unauthorized");
				return;
			}

			if (!response.ok) {
				console.error(this.name, `Could not load data: ${response.status}`);
				this.scheduleRetry();
				return;
			}

			const data = await response.json();
			this.sendSocketNotification("DATA", data);
		} catch (error) {
			console.error(this.name, "Communications error:", error.message);
			this.scheduleRetry();
		}
	},

	/**
	 * Schedules a retry after a failed API call.
	 */
	scheduleRetry() {
		console.log(this.name, `Retrying in ${this.config.retryDelay}ms...`);
		setTimeout(() => {
			this.getData();
		}, this.config.retryDelay);
	}

});
