const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const projects = require('./src/projects.json');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const screenshotDir = path.join(__dirname, 'public', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Get unique URLs
  const seen = new Set();
  const uniqueProjects = projects.filter(p => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });

  console.log(`Capturing ${uniqueProjects.length} screenshots...`);

  for (let i = 0; i < uniqueProjects.length; i++) {
    const project = uniqueProjects[i];
    const name = project.name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
    const filename = path.join(screenshotDir, `${name}.png`);

    // Skip if already exists
    if (fs.existsSync(filename)) {
      console.log(`[${i + 1}/${uniqueProjects.length}] Skipping ${name} (exists)`);
      continue;
    }

    console.log(`[${i + 1}/${uniqueProjects.length}] Capturing ${name}...`);

    try {
      const page = await context.newPage();
      await page.goto(project.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait a bit for any animations/renders
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: filename,
        type: 'png'
      });

      await page.close();
      console.log(`  ✓ Saved ${filename}`);
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nDone!');
}

captureScreenshots();
