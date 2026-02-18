window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 1. 防重复加载 + 初始0.2秒跳转到注册页
if (!sessionStorage.getItem('hasJumpedToRainyun')) {
    setTimeout(() => {
        sessionStorage.setItem('hasJumpedToRainyun', 'true');
        window.location.href = 'https://app.rainyun.com/auth/reg';
    }, 200);
}

// 2. 注册完成后自动跳转并提示绑定微信的核心逻辑（精准判定）
function checkAndRedirectToBindWechat() {
    // 标记是否已经提示并跳转过，避免重复触发
    if (sessionStorage.getItem('hasPromptedBindWechat')) return;

    // 定义需要排除的页面（不会触发提示/跳转）
    const excludeUrls = [
        'https://www.rainyun.com/520bh_',
        'https://www.rainyun.com/home'
    ];
    
    // 关键判定条件：
    // 1. 当前页面不是注册页（说明已经离开注册流程）
    // 2. 当前页面不在排除列表中
    // 3. 曾经访问过注册页（确保是从注册页跳过来的）
    const isRegPage = window.location.href.includes('/auth/reg');
    const isExcludePage = excludeUrls.some(url => window.location.href.includes(url));
    const hasVisitedRegPage = sessionStorage.getItem('hasJumpedToRainyun') === 'true';
    const isRegCompleted = !isRegPage && !isExcludePage && hasVisitedRegPage;

    // 仅当注册完成判定为true时，才执行提示和跳转
    if (isRegCompleted) {
        // 显示绑定微信的提示（友好的弹窗样式）
        const tipDiv = document.createElement('div');
        tipDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #409eff;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            font-size: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        `;
        tipDiv.innerText = '注册成功！需要绑定微信才能正常使用哦～';
        document.body.appendChild(tipDiv);

        // 3秒后自动跳转到绑定页面（给用户看提示的时间）
        setTimeout(() => {
            sessionStorage.setItem('hasPromptedBindWechat', 'true');
            window.location.href = 'https://app.rainyun.com/account/settings/qq-wx';
        }, 3000);

        // 10秒后自动关闭提示（防止遮挡页面）
        setTimeout(() => {
            tipDiv.remove();
        }, 10000);
    }
}

// 监听页面加载完成和URL变化，检测注册状态
window.addEventListener('load', checkAndRedirectToBindWechat);
window.addEventListener('popstate', checkAndRedirectToBindWechat); // 监听浏览器前进/后退
setInterval(checkAndRedirectToBindWechat, 1000); // 轮询检测（兼容异步加载的页面）

// 3. 原有拦截新窗口的核心逻辑（完全保留）
const hookClick = (e) => {    
    const origin = e.target.closest('a')    
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')    
    console.log('origin', origin, isBaseTargetBlank)    
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {        
        e.preventDefault()        
        console.log('handle origin', origin)        
        location.href = origin.href
    } else {        
        console.log('not handle origin', origin)
    }
}
window.open = function (url, target, features) {    
    console.log('open', url, target, features)    
    location.href = url
}
document.addEventListener('click', hookClick, { capture: true })