const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  try {
    const win = new BrowserWindow({
      width: 512,
      height: 512,
      show: false,
      webPreferences: {
        offscreen: true
      }
    });

    const svgPath = path.join(__dirname, '..', 'build', 'icon.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const svgBase64 = Buffer.from(svgContent).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="c" width="512" height="512"></canvas>
        <script>
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 512, 512);
            window.__DONE__ = canvas.toDataURL('image/png');
          };
          img.src = "${dataUrl}";
        </script>
      </body>
      </html>
    `;

    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    // Poll until rendering is complete
    let pngDataUrl = null;
    for (let i = 0; i < 50; i++) {
      pngDataUrl = await win.webContents.executeJavaScript('window.__DONE__ || null');
      if (pngDataUrl) break;
      await new Promise(r => setTimeout(r, 100));
    }

    if (!pngDataUrl) {
      throw new Error('Canvas render timed out');
    }

    const pngBase64 = pngDataUrl.replace(/^data:image\/png;base64,/, '');
    const png512Buffer = Buffer.from(pngBase64, 'base64');

    // 1. Save 512x512 icon.png
    const pngPath = path.join(__dirname, '..', 'build', 'icon.png');
    fs.writeFileSync(pngPath, png512Buffer);
    console.log('Saved build/icon.png (512x512)');

    // 2. Generate multi-resolution icon.ico (16, 32, 48, 64, 128, 256)
    const baseNativeImg = nativeImage.createFromBuffer(png512Buffer);
    const sizes = [16, 32, 48, 64, 128, 256];
    const imageBuffers = [];

    for (const size of sizes) {
      const resized = baseNativeImg.resize({ width: size, height: size, quality: 'best' });
      imageBuffers.push({
        size,
        buffer: resized.toPNG()
      });
    }

    // Pack into ICO binary
    // Header: 6 bytes (2 reserved, 2 type=1, 2 count)
    // Dir entries: 16 bytes each
    const headerSize = 6 + (sizes.length * 16);
    let currentOffset = headerSize;

    const headerBuf = Buffer.alloc(headerSize);
    headerBuf.writeUInt16LE(0, 0); // reserved
    headerBuf.writeUInt16LE(1, 2); // 1 = icon
    headerBuf.writeUInt16LE(sizes.length, 4); // count

    const parts = [headerBuf];

    sizes.forEach((size, idx) => {
      const imgBuf = imageBuffers[idx].buffer;
      const entryOffset = 6 + (idx * 16);

      headerBuf.writeUInt8(size === 256 ? 0 : size, entryOffset);     // width
      headerBuf.writeUInt8(size === 256 ? 0 : size, entryOffset + 1); // height
      headerBuf.writeUInt8(0, entryOffset + 2);                       // color palette count
      headerBuf.writeUInt8(0, entryOffset + 3);                       // reserved
      headerBuf.writeUInt16LE(1, entryOffset + 4);                    // color planes
      headerBuf.writeUInt16LE(32, entryOffset + 6);                   // bit count
      headerBuf.writeUInt32LE(imgBuf.length, entryOffset + 8);        // image size
      headerBuf.writeUInt32LE(currentOffset, entryOffset + 12);       // file offset

      parts.push(imgBuf);
      currentOffset += imgBuf.length;
    });

    const icoBuffer = Buffer.concat(parts);
    const icoPath = path.join(__dirname, '..', 'build', 'icon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`Saved build/icon.ico (${sizes.join(', ')} px)`);

    app.quit();
  } catch (err) {
    console.error('Error generating icons:', err);
    app.exit(1);
  }
});
