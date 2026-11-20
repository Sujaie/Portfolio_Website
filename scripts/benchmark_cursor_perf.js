import { spawn } from 'child_process';

async function benchmarkPerf() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9479',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_perf_bench',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9479/json');
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes('localhost:5173'));
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    const send = (method, params = {}) => {
      const msgId = id++;
      return new Promise((resolve, reject) => {
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise((resolve) => (ws.onopen = resolve));
    await send('Runtime.enable');

    // 1. Benchmark frame render times during continuous movement
    const benchResult = await send('Runtime.evaluate', {
      expression: `(async () => {
        const frameTimes = [];
        let lastTime = performance.now();
        let running = true;

        function recordFrame() {
          const now = performance.now();
          frameTimes.push(now - lastTime);
          lastTime = now;
          if (running) requestAnimationFrame(recordFrame);
        }
        requestAnimationFrame(recordFrame);

        // Move pointer 60 times over 1 second
        for (let i = 0; i < 60; i++) {
          const x = 300 + Math.sin(i / 5) * 150;
          const y = 300 + Math.cos(i / 5) * 150;
          window.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y, bubbles: true }));
          await new Promise(r => setTimeout(r, 16));
        }

        // Wait 200ms stationary to measure dormancy
        await new Promise(r => setTimeout(r, 200));
        running = false;

        const avgFrame = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const maxFrame = Math.max(...frameTimes);
        const fps = 1000 / avgFrame;

        // Check if loop has settled to dormant
        const lens = document.querySelector('[class*="z-[9999]"]');
        
        return {
          totalFramesMeasured: frameTimes.length,
          avgFrameTimeMs: avgFrame.toFixed(2),
          maxFrameTimeMs: maxFrame.toFixed(2),
          estimatedFPS: Math.round(fps),
          frameDrops: frameTimes.filter(t => t > 33).length, // frames taking longer than 33ms (dropped < 30fps)
          lensTransform: lens ? lens.style.transform : 'none'
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Performance Benchmark Results:', JSON.stringify(benchResult.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

benchmarkPerf();
