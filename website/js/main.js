async function loadConfig() {
  try {
    const res = await fetch('./config.json');
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

function setDownloadState(config) {
  const androidBtn = document.getElementById('android-download');
  const iosBtn = document.getElementById('ios-download');
  const statusEl = document.getElementById('download-status');
  const versionEl = document.getElementById('app-version');

  if (versionEl && config.version) {
    versionEl.textContent = `当前版本 v${config.version}`;
  }

  if (config.androidApkUrl) {
    androidBtn.href = config.androidApkUrl;
    androidBtn.classList.remove('btn-disabled');
    androidBtn.removeAttribute('aria-disabled');
    if (statusEl) {
      statusEl.textContent = 'Android 安装包已就绪，点击下方按钮即可下载。';
    }
  } else {
    androidBtn.href = '#download';
    androidBtn.classList.add('btn-disabled');
    androidBtn.setAttribute('aria-disabled', 'true');
    if (statusEl) {
      statusEl.innerHTML =
        'Android 安装包尚未上传。请将打包好的 <code>.apk</code> 放到 <code>website/releases/</code>，并在 <code>config.json</code> 中填写下载地址。';
    }
  }

  if (config.iosAppStoreUrl) {
    iosBtn.href = config.iosAppStoreUrl;
    iosBtn.classList.remove('btn-disabled');
    iosBtn.removeAttribute('aria-disabled');
  } else {
    iosBtn.href = '#download';
    iosBtn.classList.add('btn-disabled');
    iosBtn.setAttribute('aria-disabled', 'true');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const config = await loadConfig();
  setDownloadState(config);
});
