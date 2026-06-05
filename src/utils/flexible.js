/** 自适应适配方案 **/ 
(function(win, lib) {
  let doc = win.document;
  let docEl = doc.documentElement;
  let metaEl = doc.querySelector('meta[name="viewport"]');
  let flexibleEl = doc.querySelector('meta[name="flexible"]');
  let dpr = 0;
  let scale = 0;
  let tid;
  let flexible = lib.flexible || (lib.flexible = {});

  // 解析原有viewport/flexible标签配置
  if (metaEl) {
    let match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  } else if (flexibleEl) {
    let content = flexibleEl.getAttribute('content');
    if (content) {
      let initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      let maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
    }
  }

  // 自动计算DPR：区分iOS/Android
  if (!dpr && !scale) {
    let isAndroid = win.navigator.appVersion.match(/android/gi);
    let isIPhone = win.navigator.appVersion.match(/iphone/gi);
    let devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
      // iOS：DPR=3→scale=1/3；DPR=2→scale=1/2；其余DPR=1
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2;
      } else {
        dpr = 1;
      }
    } else {
      // 安卓设备统一DPR=1
      dpr = 1;
    }
    scale = 1 / dpr;
  }

  docEl.setAttribute('data-dpr', dpr);
  // 动态创建viewport meta标签
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');
    if (doc.documentElement.firstChild) {
      doc.documentElement.firstChild.appendChild(metaEl);
    } else {
      let wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  // 核心：刷新rem基准值
  function refreshRem() {
    let width = docEl.getBoundingClientRect().width;
    // 限制屏幕最小1366px、最大2560px
    if (width / dpr < 1366) {
      width = 1366 * dpr;
    } else if (width / dpr > 2560) {
      width = 2560 * dpr;
    }
    // 2560设计稿分为24等分 → 1rem = 2560/24 ≈106.6667px
    let rem = width / 24;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = rem;
  }

  // 窗口尺寸/屏幕旋转防抖刷新rem
  win.addEventListener('resize', function() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
  }, false);
  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  // DOM加载完成初始化body基准字号
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function() {
      doc.body.style.fontSize = 12 * dpr + 'px';
    }, false);
  }

  refreshRem();
  flexible.dpr = win.dpr = dpr;

  // 挂载工具方法：rem ↔ px 互转
  flexible.refreshRem = refreshRem;
  /** rem转px */
  flexible.rem2px = function(d) {
    let val = parseFloat(d) * this.rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  };
  /** px转rem */
  flexible.px2rem = function(d) {
    let val = parseFloat(d) / this.rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  };

})(window, window['lib'] || (window['lib'] = {}));