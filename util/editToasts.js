/*
 -  ADDS COLORING TO TOAST MESSAGES
*/

// fware

while (blacket === undefined) {}

document.head.insertAdjacentHTML(
  'beforeend',
  `<style>
    .fware_toast {
      position: relative;
      color: white;
      top: 45px;
      left: 8px;
      overflow: hidden;
      height: 60px;
      width: 280px;
      filter: opacity(0.3);
    }
  </style>`
);


blacket.createToast = (toast, queued) => {
    if (!toast.time) toast.time = 5000;
    if (!toast.icon) toast.icon = "/content/blooks/Info.png";
    if (!queued) blacket.toasts.push(toast);

    const parseCustomColors = (message) => {
        const colorRegex = /<([a-zA-Z0-9#]+)>(.*?)<\/\1>/g;
        return message.replace(colorRegex, (match, color, content) => {
            if (color.startsWith('#')) {
                return `<span style="color: ${color};">${content}</span>`;
            } else {
                return `<span style="color: ${color.toLowerCase()};">${content}</span>`;
            }
        });
    };

    if ($(".styles__toastContainer___o4pCa-camelCase").length > 0) return;
    new Audio("/content/notification.ogg").play();
    $("body").append(`
        <div class="styles__toastContainer___o4pCa-camelCase">
            <img class="styles__toastIcon___vna3A-camelCase" src="${toast.icon}">
            <div class="styles__toastTitle___39Rac-camelCase">${parseCustomColors(toast.title)}</div>
            <div class="fware_toast">${parseCustomColors(toast.message)}</div>
        </div>
    `);

    let toastTimeout = setTimeout(() => {
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").style.animation = 'none';
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").offsetHeight;
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").style.animation = "styles__toastContainer___o4pCa-camelCase 0.25s linear reverse";
        setTimeout(() => {
            $(".styles__toastContainer___o4pCa-camelCase").remove();
            blacket.toasts.shift();
            if (blacket.toasts.length > 0) blacket.createToast(blacket.toasts[0], true);
        }, 245);
    }, toast.time);

    $(".styles__toastContainer___o4pCa-camelCase").click(() => {
        clearTimeout(toastTimeout);
        $(".styles__toastContainer___o4pCa-camelCase").remove();
        blacket.toasts.shift();
        if (blacket.toasts.length > 0) blacket.createToast(blacket.toasts[0], true);
    });
};
