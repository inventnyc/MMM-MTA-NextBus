
/* Magic Mirror
 * Module: MMM-MTA-NextBus
 *
 * By tie624
 * MIT Licensed.
 */

Module.register("MMM-MTA-NextBus", {
	defaults: {
		timeFormat: config.timeFormat,
		maxEntries: 5,
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0",

	start() {
		this.dataRequest = null;
		this.sendSocketNotification("CONFIG", this.config);

		// Schedule update timer
		setInterval(() => {
			this.sendSocketNotification("GET_DATA");
		}, this.config.updateInterval);
	},

	getDom() {
		const wrapper = document.createElement("div");

		if (this.dataRequest) {
			this.dataRequest.forEach((data) => {
				const row = document.createElement("div");
				row.innerHTML = data;
				row.className = "small";
				wrapper.appendChild(row);
			});
		}

		return wrapper;
	},

	getScripts() {
		return ["moment.js"];
	},

	getStyles() {
		return ["MMM-MTA-NextBus.css"];
	},

	processData(data) {
		this.dataRequest = this.processActionNextBus(data);
		this.updateDom(this.config.animationSpeed);
	},

	processActionNextBus(response) {
		const result = [];
		const serviceDelivery = response.Siri.ServiceDelivery;
		const updateTimestamp = new Date(serviceDelivery.ResponseTimestamp);
		const visits = serviceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
		const visitsCount = Math.min(visits.length, this.config.maxEntries);

		for (let i = 0; i < visitsCount; i++) {
			const journey = visits[i].MonitoredVehicleJourney;
			let line = journey.PublishedLineName[0];
			const destinationName = journey.DestinationName[0];

			if (destinationName.startsWith("LIMITED")) {
				line += " LIMITED";
			}

			const monitoredCall = journey.MonitoredCall;
			let entry = `${line}, `;

			if (monitoredCall.ExpectedArrivalTime) {
				const mins = this.getArrivalEstimate(monitoredCall.ExpectedArrivalTime, updateTimestamp);
				entry += `${mins}, `;
			}

			entry += monitoredCall.ArrivalProximityText;
			result.push(i===0 ? `<span class='bright bold'>${entry}</span>` : entry);
		}

		result.push(`Last Updated: ${this.formatTimeString(updateTimestamp)}`);

		return result;
	},

	getArrivalEstimate(dateString, refDate) {
		const arrivalDate = new Date(dateString);
		const mins = Math.floor((arrivalDate - refDate) / 60000);

		return `${mins} minute${Math.abs(mins) === 1 ? "" : "s"}`;
	},

	formatTimeString(date) {
		const m = moment(date);
		const is24Hour = this.config.timeFormat === 24;
		const format = is24Hour ? "HH:mm" : "h:mm A";

		return m.format(format);
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "DATA") {
			this.processData(payload);
		} else if (notification === "ERROR") {
			this.updateDom(this.config.animationSpeed);
		}
	}
});
