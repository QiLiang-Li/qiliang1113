function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = document.querySelector('base')?.href || window.location.href;
  return new URL(url, base).href;
}

async function loadConfig() {
  try {
    const res = await fetch(new URL('config.json', window.location.href).href, {
      cache: 'no-store',
    });
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

  const apkUrl = resolveUrl(config.androidApkUrl);
  if (apkUrl) {
    androidBtn.href = apkUrl;
    androidBtn.setAttribute('download', 'diary-finance.apk');
    androidBtn.setAttribute('target', '_blank');
    androidBtn.setAttribute('rel', 'noopener');
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
      statusEl.textContent =
        'Android 安装包尚未配置。请通过 GitHub Releases 发布 APK 并更新 config.json。';
    }
  }

  const iosUrl = resolveUrl(config.iosAppStoreUrl);
  if (iosUrl) {
    iosBtn.href = iosUrl;
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
