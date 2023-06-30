while (blacket === undefined) {}

blacket.appendChat = async (data, mentioned) => {
  let message = blacket.htmlEncode(data.message);
  message = message.replace(
    /&lt;(gradient=\[(?:up|down|left|right|\d{1,3}deg)(?: |):(?: |)(?:(?:(?:black|lime|white|brown|magenta|cyan|turquoise|red|orange|yellow|green|blue|purple|\#[0-9a-fA-F]{6})(?:, |,| ,| , |)){2,7})\]|black|lime|white|brown|magenta|cyan|turquoise|red|orange|yellow|green|blue|purple|(\#[0-9a-fA-F]{6}))&gt;(.+?)&lt;\/([^&]+?)&gt;/g,
    (...args) => {
      if (args[1].split("=")[0] === "gradient") {
        let grad = args[1]
          .split("=")[1]
          .slice(1, -1)
          .split(",")
          .join(", ")
          .split(" ,")
          .join(", ")
          .split(" , ")
          .join(", ")
          .replaceAll(" ", "")
          .slice(",");
        let colors = grad.split(":")[1].trim();
        let direction = grad.split(":")[0].trim();
        return `<span style="background: linear-gradient(${
          direction === "up"
            ? "to top"
            : direction === "down"
            ? "to bottom"
            : !direction.endsWith("deg")
            ? "to " + direction
            : direction
        }, ${colors}); display: inline-block; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${
          args[3]
        }</span>`;
      } else return `<span style="color: ${args[1]};">${args[3]}</span>`;
    }
  );
  message = message.replace(/\*\*\*([^\*]+)\*\*\*/g, (match, text) => {
    return `<b><i>${text}</i></b>`;
  });
  message = message.replace(/\*\*([^\*]+)\*\*/g, (match, text) => {
    return `<b>${text}</b>`;
  });
  message = message.replace(/\*([^\*]+)\*/g, (match, text) => {
    return `<i>${text}</i>`;
  });
  message = message.replace(/\~\~([^\~]+)\~\~/g, (match, text) => {
    return `<s>${text}</s>`;
  });
  message = message.replace(/\_\_([^\_]+)\_\_/g, (match, text) => {
    return `<u>${text}</u>`;
  });
  message = message.replace(
    /(?:http|https):\/\/([^ ]+(\/|)|[^ ]+\.(jpeg|jpg|png|webp|gif|mp4|webm|mov))/,
    (match, url) => {
      let ext = match.split(".")[match.split(".").length - 1];
      let queryIndex = ext.indexOf("?");
      if (queryIndex !== -1)
        (ext = ext.slice(0, queryIndex)),
          (url = url.slice(0, url.indexOf("?")));
      let src;
      if (url.startsWith(location.host)) src = `https://${url}`;
      else src = `/worker/proxy/${btoa(`https://${url}`)}`;
      if (
        ext == "jpg" ||
        ext == "jpeg" ||
        ext == "png" ||
        ext == "webp" ||
        ext == "gif"
      )
        return `<img oncontextmenu="return false;" class="styles__chatEmbedImage___fk29M-camelCase" src="${src}" onerror="this.parentElement.innerHTML = '${blacket.htmlEncode(
          match
        )}'" onclick="blacket.enlargeImage('${btoa(src)}')">`;
      else if (ext == "webm" || ext == "mp4" || ext == "mov")
        return `<video oncontextmenu="return false;" class="styles__chatEmbedVideo___c9jac-camelCase" src="${src}" onerror="this.parentElement.innerHTML = '${blacket.htmlEncode(
          match
        )}'" controls>`;
      else if (
        ext == "mp3" ||
        ext == "ogg" ||
        ext == "m4a" ||
        ext == "wav" ||
        ext == "flac"
      )
        return `<audio oncontextmenu="return false;" class="styles__chatEmbedAudio___92Ama-camelCase" src="${src}" onerror="this.parentElement.innerHTML = '${blacket.htmlEncode(
          match
        )}'" controls>`;
      else
        return `<a style="color: lightblue;" href="${match}" target="_blank">${match}</a>`;
    }
  );
  message = message.replace(/\[([^\]]+)\]/g, (match, blook) => {
    let lowerCaseBlooks = {};
    Object.keys(blacket.blooks).forEach((blook) => {
      lowerCaseBlooks[blook.toLowerCase()] = blacket.blooks[blook];
    });
    if (!lowerCaseBlooks[blook.toLowerCase()]) return match;
    return `<img loading="lazy" src="${
      lowerCaseBlooks[blook.toLowerCase()].image
    }" class="styles__chatEmoji___FT5aB-camelCase">`;
  });
  message = message.replace(/:(.+?):/g, (match, emoji) => {
    if (!blacket.emojis[emoji]) {
      for (let x of blacket.emojiNames)
        if (":" + emoji + ":" === x.shortname) return x.emoji;
      return ":" + emoji + ":";
    }
    return `<img loading="lazy" src="${blacket.emojis[emoji].image}" class="styles__chatEmoji___FT5aB-camelCase">`;
  });
  try {
    message = twemoji.parse(message, {
      className: "styles__chatEmoji___FT5aB-camelCase",
    });
    if (
      message
        .replace(/<img[^>]+>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim() === ""
    ) {
      if (message.match(/<img[^>]+>/g).length > 30) return match;
      message = message.replace(/<img[^>]+>/g, (match) => {
        return (
          match.replace(
            'class="styles__chatEmoji___FT5aB-camelCase"',
            'class="styles__chatEmoji___FT5aB-camelCase" style="width: 50px;"'
          ) + " "
        );
      });
    }
  } catch {}
  chatContainer.maxScrollTop =
    chatContainer.scrollHeight - chatContainer.offsetHeight;
  var tem = document.querySelector(
    "#chatContainer .styles__chatMessageContainer__G1Z4P-camelCase:last-child"
  );
  if (
    (tem
      ? parseInt(
          (
            tem.dataset || {
              userId: NaN,
            }
          ).userId
        ) === data.user.id
      : true) &&
    blacket.lastUser == data.user.id &&
    blacket.lastTime + 1000 * 60 * 5 > data.time
  ) {
    $(
      `#chatContainer .styles__chatMessageContainer__G1Z4P-camelCase:last-child`
    ).append(
      `<text time="${data.time}" id="message-${
        data.id
      }" class="styles__chatMessage${
        mentioned ? "Mention" : ""
      }___2Z1ZU-camelCase">${message}</text>
      `
    );
    if (
      chatContainer.maxScrollTop - chatContainer.scrollTop <=
      chatContainer.offsetHeight
    ) {
      let tempScrollInterval = setInterval(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1);
      setTimeout(() => {
        clearInterval(tempScrollInterval);
      }, 250);
    }
    return;
  }
  blacket.lastUser = data.user.id;
  blacket.lastTime = data.time;
  let messageClass = "";
  let badges = "";
  if (data.user.badges.length > 0) {
    Object.keys(blacket.badges).forEach((badge) => {
      if (data.user.badges.includes(badge) || data.user.badges.includes("*"))
        badges += `<img src="${blacket.badges[badge].image}" class="styles__chatBadge___AZ1ZU-camelCase">`;
    });
  }
  if (data.user.color == "rainbow") messageClass = ` class="rainbow"`;
  if (data.user.color.includes(";"))
    data.user.color = data.user.color.split(";")[0].trim();
  let randomUsernameId = Math.random().toString(36).substring(2, 15);
  let randomAvatarId = Math.random().toString(36).substring(2, 15);
  $("#chatContainer").append(
    `<div class="styles__chatMessageContainer__G1Z4P-camelCase" data-user-id="${
      data.user.id
    }">
    <img width="50" height="57.5" id="${randomAvatarId}" class="styles__chatAvatar___RZQ83-camelCase" src="/content/blooks/Loading.png" onerror="this.onerror=null; this.src='/content/blooks/Error.png'">
    <text id="${randomUsernameId}" class="styles__chatName___F1Z4P-camelCase">
      <text${messageClass} style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2); color: ${
      data.user.color
    };">${data.user.username}</text>
      ${badges}
    </text>
    <text time="${data.time}" id="message-${data.id}" data-user-id="${
      data.user.id
    }" style="margin-top: -32.5px;" class="styles__chatMessage${
      mentioned ? "Mention" : ""
    }___2Z1ZU-camelCase">${message}</text>
  </div>`
  );

  $(`#${randomUsernameId}, #${randomAvatarId}`).click(() => {
    if (event.shiftKey) {
      $("#chatBox").val($("#chatBox").val() + `@${data.user.username} `);
      $("#chatBox").focus();
      return;
    }
    let randomBannerId = Math.random().toString(36).substring(2, 15);
    let randomAvatarId = Math.random().toString(36).substring(2, 15);
    $("body")
      .append(`<div class="arts__modal___VpEAD-camelCase"><div style="padding: 15px 100px 25px 17.5px; height: fit-content;" class="styles__container___3St5B-camelCase">
        <div id="closeButton" style="margin-right: 11.5px;right: 0;position: absolute; z-index: 15;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
            <div class="styles__shadow___3GMdH-camelCase"></div>
            <div class="styles__edge___3eWfq-camelCase" style="background-color: #1f1f1f;"></div>
            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #1f1f1f;"><i class="fas fa-times" aria-hidden="true"></i></div>
        <div></div></div><div class="styles__headerLeft___1Hu3N-camelCase">
                <div class="styles__headerLeftRow___8vTJL-camelCase">
                    <div id="${randomAvatarId}" class="styles__headerBlookContainer___36zY5-camelCase" role="button" tabindex="0">
                        <div class="styles__blookContainer___36LK2-camelCase styles__headerBlook___DdSHd-camelCase"><img loading="lazy" src="${
                          data.user.avatar
                        }" style="filter: drop-shadow(0px 0px 5px);" draggable="false" class="styles__blook___1R6So-camelCase"></div>
                    </div>
                    <div class="styles__headerInfo___1oWlb-camelCase">
                        <div id="${randomBannerId}" class="styles__headerBanner___3Uuuk-camelCase">
                            <img loading="lazy" src="${encodeURIComponent(
                              data.user.banner
                            )}" class="styles__headerBg___12ogR-camelCase" draggable="false">
                            <div class="styles__headerName___1GBcl-camelCase" style="color: ${
                              data.user.color
                            };">${data.user.username} </div>
                            <div class="styles__headerTitle___24Ox2-camelCase">${
                              data.user.role
                            }</div>
                        </div>
                    <div class="styles__levelBarContainer___1xi-9-camelCase">
                            <div style="background-color: #4f4f4f;" class="styles__levelBar___2SU0x-camelCase">
                                <div class="styles__levelBarInside___3FLAG-camelCase" style="transform: scaleX(0);"></div>
                            </div>
                            <div class="styles__levelStarContainer___7ABEf-camelCase">
                                <img loading="lazy" src="/content/levelStar.png" alt="Star" class="styles__levelStar___LHq_y-camelCase" draggable="false">
                                <div class="styles__levelStarText___2Myxg-camelCase">0</div>
                            </div>
                        </div></div>
                </div>
            </div></div></div>`);
    if (
      blacket.user.perms.includes("mute_users") ||
      blacket.user.perms.includes("*")
    )
      $(".styles__container___3St5B-camelCase")
        .append(`<div id="manageButton" style="margin-bottom: 20px;margin-right: 11.5px;right: 0;position: absolute; z-index: 15; bottom: 0;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
            <div class="styles__shadow___3GMdH-camelCase"></div>
            <div class="styles__edge___3eWfq-camelCase" style="background-color: #a21c19;"></div>
            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #a21c19;"><i class="fas fa-users-cog" aria-hidden="true"></i></div>
        <div></div></div>`);
    $(`#${randomBannerId}, #${randomAvatarId}`).click(() => {
      location = `/stats?name=${data.user.username}`;
    });
    $("#manageButton").click(() => {
      location = `/panel/users?name=${data.user.id}`;
    });
    rainbow = false;
    let level = 0;
    let needed;
    let exp = data.user.exp;
    for (let i = 0; i <= 27915; i++) {
      needed = 5 * Math.pow(level, blacket.config.exp.difficulty) * level;
      if (exp >= needed) {
        exp -= needed;
        level++;
      }
    }
    if (data.user.color.toLowerCase() == "rainbow")
      $(".styles__headerName___1GBcl-camelCase").attr(
        "class",
        `styles__headerName___1GBcl-camelCase rainbow`
      );
    else
      $(".styles__headerName___1GBcl-camelCase").attr(
        "class",
        `styles__headerName___1GBcl-camelCase`
      );
    if (level >= 100) {
      if (!rainbow)
        $("body").append(
          `<style id="rainbow">.styles__levelBarInside___3FLAG-camelCase {background: linear-gradient(#fcd843, #fcd843 50%, #feb31a 50.01%, #feb31a);height: 100%;width: 100%;transform-origin: left center;animation: styles__levelBarRainbow___3FLAG-camelCase 2s linear infinite;}</style>`
        );
      rainbow = true;
    } else {
      $("#rainbow").remove();
      rainbow = false;
    }
    $(".styles__levelStarText___2Myxg-camelCase").html(level.toLocaleString());
    $(".styles__levelBarInside___3FLAG-camelCase").css(
      "transform",
      `scaleX(${exp / needed})`
    );
    $("#closeButton").click(() => {
      $(".arts__modal___VpEAD-camelCase").remove();
    });
  });
  setTimeout(() => {
    $(`#${randomAvatarId}`).attr("src", data.user.avatar);
  }, 200);
  if (
    chatContainer.maxScrollTop - chatContainer.scrollTop <=
    chatContainer.offsetHeight
  ) {
    let tempScrollInterval = setInterval(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1);
    setTimeout(() => {
      clearInterval(tempScrollInterval);
    }, 250);
  }
};
