const metrics = {
	totalRequests: 0,
	totalResponseTimeMs: 0,
	minResponseTimeMs: Infinity,
	maxResponseTimeMs: 0,
	byMethod: {},
	byStatus: {},
	byEndpoint: {},
	recentRequests: [],
};

const MAX_RECENT = 10;

export const requestLogger = (req, res, next) => {
	const startHr = process.hrtime.bigint();
	const startIso = new Date().toISOString();

	console.log(`[${startIso}] ${req.method} ${req.originalUrl}`);

	res.on("finish", () => {
		const endHr = process.hrtime.bigint();
		const durationMs = Number(endHr - startHr) / 1_000_000;

		metrics.totalRequests += 1;
		metrics.totalResponseTimeMs += durationMs;
		metrics.minResponseTimeMs = Math.min(
			metrics.minResponseTimeMs,
			durationMs,
		);
		metrics.maxResponseTimeMs = Math.max(
			metrics.maxResponseTimeMs,
			durationMs,
		);

		metrics.byMethod[req.method] = (metrics.byMethod[req.method] || 0) + 1;

		const statusKey = String(res.statusCode);
		metrics.byStatus[statusKey] = (metrics.byStatus[statusKey] || 0) + 1;

		const endpointKey = `${req.method} ${req.route?.path || req.baseUrl + req.path}`;
		metrics.byEndpoint[endpointKey] =
			(metrics.byEndpoint[endpointKey] || 0) + 1;

		metrics.recentRequests.unshift({
			method: req.method,
			url: req.originalUrl,
			status: res.statusCode,
			durationMs: +durationMs.toFixed(3),
			timestamp: startIso,
		});
		if (metrics.recentRequests.length > MAX_RECENT) {
			metrics.recentRequests.pop();
		}

		console.log(
			`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
				`→ ${res.statusCode} (${durationMs.toFixed(2)}ms)`,
		);
	});

	next();
};

export const getMetricsReport = () => {
	const avg =
		metrics.totalRequests === 0
			? 0
			: metrics.totalResponseTimeMs / metrics.totalRequests;

	return {
		totalRequests: metrics.totalRequests,
		averageResponseTimeMs: +avg.toFixed(3),
		minResponseTimeMs:
			metrics.minResponseTimeMs === Infinity
				? 0
				: +metrics.minResponseTimeMs.toFixed(3),
		maxResponseTimeMs: +metrics.maxResponseTimeMs.toFixed(3),
		byMethod: metrics.byMethod,
		byStatus: metrics.byStatus,
		byEndpoint: metrics.byEndpoint,
		recentRequests: metrics.recentRequests,
		collectedSince: process.uptime().toFixed(2) + "s",
	};
};

export const resetMetrics = () => {
	metrics.totalRequests = 0;
	metrics.totalResponseTimeMs = 0;
	metrics.minResponseTimeMs = Infinity;
	metrics.maxResponseTimeMs = 0;
	metrics.byMethod = {};
	metrics.byStatus = {};
	metrics.byEndpoint = {};
	metrics.recentRequests = [];
};
