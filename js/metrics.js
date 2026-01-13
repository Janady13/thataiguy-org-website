/* WebSocket metrics: update simple counters if endpoint is reachable */
(() => {
  const elTick = document.getElementById('m-tick');
  const elAgents = document.getElementById('m-agents');
  const elLatency = document.getElementById('m-latency');
  if (!elTick || !('WebSocket' in window)) return;

  const loc = window.location;
  const sameHost = `${loc.protocol === 'https:' ? 'wss' : 'ws'}://${loc.host}/metrics`;
  const endpoints = [
    sameHost,
    'ws://10.88.0.1/metrics', // WG/dev example
  ];

  let ws;
  function connect(i = 0) {
    if (i >= endpoints.length) return; // no-op if not configured
    try {
      ws = new WebSocket(endpoints[i]);
      ws.onopen = () => {
        console.log('metrics: connected', endpoints[i]);
      };
      ws.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          if (d.tick != null) elTick.textContent = String(d.tick);
          if (d.active_agents != null) elAgents.textContent = String(d.active_agents);
          if (d.latency_ms != null) elLatency.textContent = `${d.latency_ms}ms`;
        } catch {}
      };
      ws.onclose = () => setTimeout(() => connect(i + 1), 1000);
      ws.onerror = () => setTimeout(() => connect(i + 1), 1000);
    } catch (e) {
      setTimeout(() => connect(i + 1), 500);
    }
  }
  connect();
})();
