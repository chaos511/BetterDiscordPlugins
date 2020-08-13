//META{"name":"CallConfirm"}*//

var CallConfirm = function () {};
(function () {
  "use strict";

  var voiceCallButton;
  var videoCallButton;
  var clonedVoiceCallButton;
  var clonedVideoCallButton;
  var pinnedMessagesButton;
  var tooltips = [];

  CallConfirm.prototype.start = function () {};

  CallConfirm.prototype.observer = function ({ addedNodes }) {
    if (addedNodes.length < 1) {
      return;
    }
    for (var node of addedNodes) {
      if (
        node.querySelector &&
        node.querySelector("#user-context-call")
        
      ) {
        //just remove the call button because ¯\_(ツ)_/¯
        var contextCallButton=node.querySelector("#user-context-call")
        contextCallButton.style.display = "none";
        // var clonedContextCallButton = contextCallButton.cloneNode(true);
        // clonedContextCallButton.style.display = "";
        // clonedContextCallButton.addEventListener("click", ()=>{
        //   BdApi.showConfirmationModal("Discord", "Start Call? We are asking because this is a potentially-destructive action. We strongly advise you to double-think before you call.", {'danger': true, 'confirmtext': 'Yes, I\'ve thought it through.', 'cancelText': 'DAM! That was a close one; almost died there', 'onConfirm': ()=>{
        //     contextCallButton.click()
        //   }})
        // });
        // contextCallButton.parentElement.insertBefore(clonedContextCallButton,contextCallButton)
      }else if (
        node.querySelector &&
        node.querySelector("[aria-label='Start Voice Call']")
      ) {
        voiceCallButton = node.querySelector("[aria-label='Start Voice Call']");
        videoCallButton = node.querySelector("[aria-label='Start Video Call']");
        pinnedMessagesButton = node.querySelector(
          "[aria-label='Pinned Messages']"
        );
        videoCallButton.style.display = "none";
        voiceCallButton.style.display = "none";

        clonedVoiceCallButton = voiceCallButton.cloneNode(true);
        clonedVoiceCallButton.style.display = "";
        clonedVideoCallButton = videoCallButton.cloneNode(true);
        clonedVideoCallButton.style.display = "";

        clonedVoiceCallButton.addEventListener("click", ()=>{
          BdApi.showConfirmationModal("Discord", "Start Call? We are asking because this is a potentially-destructive action. We strongly advise you to think before you call.", {'danger': true, 'confirmText': 'Yes', 'cancelText': 'That was a close one, I almost died there', 'onConfirm': ()=>{
            voiceCallButton.click()
          }})
        });
        clonedVideoCallButton.addEventListener("click", ()=>{
          BdApi.showConfirmationModal("Discord", "Start Video Call? We are asking because this is a potentially-destructive action. We strongly advise you to think before you call.", {'danger': true, 'confirmText': 'Yes', 'cancelText': 'That was a close one, I almost died there', 'onConfirm': ()=>{
            videoCallButton.click()
          }})
        });

        clonedVoiceCallButton.addEventListener("mouseenter", onButtonMouseOver);
        clonedVoiceCallButton.addEventListener("mouseleave", onButtonMouseOut);
        clonedVideoCallButton.addEventListener("mouseenter", onButtonMouseOver);
        clonedVideoCallButton.addEventListener("mouseleave", onButtonMouseOut);

        pinnedMessagesButton.parentElement.insertBefore(
          clonedVoiceCallButton,
          pinnedMessagesButton
        );
        pinnedMessagesButton.parentElement.insertBefore(
          clonedVideoCallButton,
          pinnedMessagesButton
        );
      }
    }
  };

  CallConfirm.prototype.stop = function () {
    try {
      videoCallButton.style.display = "";
      voiceCallButton.style.display = "";
    } catch (ignore) {}
  };

  CallConfirm.prototype.load = function () {};

  CallConfirm.prototype.unload = function () {
    console.log("pinnedMessagesButton");
  };

  CallConfirm.prototype.getName = function () {
    return "Call Confirm";
  };

  CallConfirm.prototype.getDescription = function () {
    return "adds a confirmation box when you click start call or start video call, because starting a call is a potentially-destructive action";
  };

  CallConfirm.prototype.getVersion = function () {
    return "0.0.0";
  };

  CallConfirm.prototype.getAuthor = function () {
    return "qwerty142";
  };


  function createTooltip(tooltipText) {
    //stolen from NotificationSoundToggle
    // Also setup my recreated tooltip that uses Discord's classes.
    const tooltipClasses = BdApi.findModuleByProps("tooltipBottom");

    const wrapperDiv = document.createElement("div");
    tooltips[tooltipText] = wrapperDiv;

    wrapperDiv.style.visibility = "hidden";
    wrapperDiv.style.position = "absolute";

    wrapperDiv.className = [
      tooltipClasses.tooltip,
      tooltipClasses.tooltipTop,
      tooltipClasses.tooltipBlack,
      tooltipClasses.tooltipDisablePointerEvents,
    ].join(" ");

    const textWrapper = document.createElement("div");

    textWrapper.className = tooltipClasses.tooltipContent;
    textWrapper.innerText = tooltipText;

    const bottomArrow = document.createElement("div");
    bottomArrow.className = tooltipClasses.tooltipPointer;

    wrapperDiv.appendChild(textWrapper);
    wrapperDiv.appendChild(bottomArrow);
    document.body.appendChild(wrapperDiv);
  }

  function onButtonMouseOver({
    //stolen from NotificationSoundToggle
    target,
  }) {
    var tooltipText = target.getAttribute("aria-label");
    if (!tooltips[tooltipText]) {
      createTooltip(tooltipText);
    }
    const { x, y } = target.getBoundingClientRect();
    const tooltipXPos =
      x + target.clientWidth / 2 - tooltips[tooltipText].offsetWidth / 2;
    const tooltipYPos = y - target.clientHeight - 8; // 8 being a constant amount of space to hover above the btn.
    tooltips[tooltipText].style.left = `${tooltipXPos}px`;
    tooltips[tooltipText].style.visibility = "visible";
    tooltips[tooltipText].style.top = `${tooltipYPos}px`;
    tooltips[tooltipText].visibility = "visible";
  }

  function onButtonMouseOut({
    //stolen from NotificationSoundToggle
    target,
  }) {
    tooltips[target.getAttribute("aria-label")].style.visibility = "hidden";
  }
})();

/*@end @*/
