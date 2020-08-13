//META{"name":"MoreStatuses"}*//

var MoreStatuses = function () {};

(function () {
  "use strict";
  var interval;
  const fs = require("fs");

  MoreStatuses.prototype.start = function () {
    const getStatusModule = WebpackModules.findByUniqueProperties(
      ["getStatus"],
      {
        cacheOnly: true,
      }
    );
    const getDMFromUserIdModule = WebpackModules.findByUniqueProperties(
      ["getDMFromUserId"],
      {
        cacheOnly: true,
      }
    );
    if (!getStatusModule || !getDMFromUserIdModule) {
      console.error("Error findByUniqueProperties returned undefined");
      return;
    }
    var lastClientStatuses = {};
    interval = setInterval(() => {
      var clientStatuses = getStatusModule.getState().clientStatuses;

      //dm , server member,friends,mutual friends list and profile
      var avatarList = document.querySelectorAll(".da-avatar,.da-listAvatar,.da-headerAvatar");
      for (var avatar of avatarList) {
        if (avatarList.length > 0) {
          // console.log(avatar);
          try {
            var userId = avatar.querySelector("img").src.split("/")[4];
            if (webOrMobile(clientStatuses[userId])) {
              if (clientStatuses[userId].mobile) {
                setToMobile(avatar.querySelector("svg"));
              } else {
                setToWeb(avatar.querySelector("svg"));
              }
            }
          } catch (e) {}
        }
      }

      //dm title
      try {
        var userId;
        for (var statusId in clientStatuses) {
          if (
            document.location.href.split("/")[5] ==
            getDMFromUserIdModule.getDMFromUserId(statusId)
          ) {
            userId = statusId;
          }
        }
        if (userId && webOrMobile(clientStatuses[userId])) {
          if (clientStatuses[userId].mobile) {
            setToMobile(
              document
                .querySelector("[aria-label='Channel header']")
                .querySelectorAll("svg")[1]
            );
          } else {
            setToWeb(
              document
                .querySelector("[aria-label='Channel header']")
                .querySelectorAll("svg")[1]
            );
          }
        }
      } catch (ignore) {}

      // user popout
      try {
        var userId = (
          document.querySelector(".da-popout") ||
          document.querySelector(".da-userPopout")
        )
          .querySelector("img")
          .src.split("/")[4];
        if (webOrMobile(clientStatuses[userId])) {
          if (clientStatuses[userId].mobile) {
            setToMobile(
              (
                document.querySelector(".da-popout") ||
                document.querySelector(".da-userPopout")
              ).querySelector("svg")
            );
          } else {
            setToWeb(
              (
                document.querySelector(".da-popout") ||
                document.querySelector(".da-userPopout")
              ).querySelector("svg")
            );
          }
        }
      } catch (ignore) {}

    }, 1000);
  };
  function setToMobile(svg) {
    if (svg.querySelector("rect").getAttribute("x") == "22") {
      //member list
      if (svg.querySelector("foreignObject")) {
        svg
          .querySelector("foreignObject")
          .setAttribute("mask", "url(#svg-mask-avatar-status-mobile-32)");
      }
      svg
        .querySelector("rect")
        .setAttribute("mask", "url(#svg-mask-status-online-mobile)");
      svg.querySelector("rect").setAttribute("height", 15);
      svg.querySelector("rect").setAttribute("width", 10);
      svg.querySelector("rect").setAttribute("x", 22);
      svg.querySelector("rect").setAttribute("y", 17);
    } else if (svg.querySelector("rect").getAttribute("x") == "0") {
      //pop out
      svg
        .querySelectorAll("rect")
        [svg.querySelectorAll("rect").length - 1].setAttribute(
          "mask",
          "url(#svg-mask-status-online-mobile)"
        );
    } else {
      if (svg.querySelector("foreignObject")) {
        svg
          .querySelector("foreignObject")
          .setAttribute("mask", "url(#svg-mask-avatar-status-mobile-80)");
      }
      svg
        .querySelector("rect")
        .setAttribute("mask", "url(#svg-mask-status-online-mobile)");
      svg.querySelector("rect").setAttribute("height", 24);
      svg.querySelector("rect").setAttribute("width", 16);
      svg.querySelector("rect").setAttribute("x", 60);
      svg.querySelector("rect").setAttribute("y", 52);
    }
    try {
      const props = window.ZLibrary.ReactTools.getReactProperty(
        svg,
        "memoizedProps"
      ).children[1].props;
      props.text = props.text.split("(")[0] + " (Mobile)";
    } catch (ignore) {}
  }
  function setToWeb(svg) {
    var rect = svg.querySelectorAll("rect")[
      svg.querySelectorAll("rect").length - 1
    ];
    if (!rect) {
      return;
    }
    rect.setAttribute("mask", "");
    // var x=parseInt(rect.getAttribute("x"))
    // var width=parseInt(rect.getAttribute("width"))
    // var fill=rect.getAttribute("fill")
    // rect.remove()
    // console.log(x)
    // console.log(width)
    // svg.innerHTML+='<text x="'+x+'" y="'+(x+width)+'" fill="'+fill+'" font-size="200%" class="pointerEvents-2zdfdO da-pointerEvents">W</text>'
    // svg.innerHTML+='<circle cx="'+(x+width/2)+'" cy="'+(x+width/2)+'" r="'+width/2+'" fill="'+fill+'" class="pointerEvents-2zdfdO da-pointerEvents"></circle>'
    // svg.innerHTML+='<circle cx="'+(x+width/2)+'" cy="'+(x+width/2)+'" r="'+(width/2-2)+'" fill="black" class="pointerEvents-2zdfdO da-pointerEvents"></circle>'

    // console.log(svg.innerHTML)
    try {
      const props = window.ZLibrary.ReactTools.getReactProperty(
        svg,
        "memoizedProps"
      ).children[1].props;
      props.text = props.text.split("(")[0] + " (Web)";
    } catch (ignore) {}
  }
  function webOrMobile(clientStatus) {
    return (
      ((clientStatus.mobile && !clientStatus.web) ||
        (!clientStatus.mobile && clientStatus.web)) &&
      !clientStatus.desktop
    );
  }
  MoreStatuses.prototype.stop = function () {
    clearInterval(interval);
  };

  MoreStatuses.prototype.load = function () {};

  MoreStatuses.prototype.unload = function () {};

  MoreStatuses.prototype.getName = function () {
    return "More Statuses";
  };

  MoreStatuses.prototype.getDescription = function () {
    return "Shows mobile and web version of idle and do not disturb";
  };

  MoreStatuses.prototype.getVersion = function () {
    return "0.0.1";
  };

  MoreStatuses.prototype.getAuthor = function () {
    return "qwerty142";
  };

  // If samogot's DiscordInternals lib exists, use it. Otherwise, fall back on bundled code below.
  // See: https://github.com/samogot/betterdiscord-plugins/tree/master/v2/1Lib%20Discord%20Internals
	if (!document.getElementById('DiscordInternalsLib')) {
		var DiscordInternalsLib = document.createElement("script");
		DiscordInternalsLib.setAttribute("type", "text/javascript");
		DiscordInternalsLib.setAttribute("src", "https://bddeveloper.github.io/1lib_discord_internals.plugin.js");
		DiscordInternalsLib.setAttribute("id", "DiscordInternalsLib");
		document.head.appendChild(DiscordInternalsLib);
	}
  const DI = window.DiscordInternals;
  const hasLib = !!(
    DI &&
    DI.versionCompare &&
    DI.versionCompare(DI.version || "", "1.9") >= 0
  );

  /**
   * Function with no arguments and no return value that may be called to revert changes made by {@link monkeyPatch} method, restoring (unpatching) original method.
   * @callback cancelPatch
   */

  /**
   * This is a shortcut for calling original method using `this` and `arguments` from original call. This function accepts no arguments. This function is defined as `() => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)`
   * @callback originalMethodCall
   * @return {*} The same value, which is returned from original method, also this value would be written into `data.returnValue`
   */

  /**
   * A callback that modifies method logic. This callback is called on each call of the original method and is provided all data about original call. Any of the data can be modified if necessary, but do so wisely.
   * @callback doPatchCallback
   * @param {PatchData} data Data object with information about current call and original method that you may need in your patching callback.
   * @return {*} Makes sense only when used as `instead` parameter in {@link monkeyPatch}. If something other than `undefined` is returned, the returned value replaces the value of `data.returnValue`. If used as `before` or `after` parameters, return value is ignored.
   */

  /**
   * This function monkey-patches a method on an object. The patching callback may be run before, after or instead of target method.
   * Be careful when monkey-patching. Think not only about original functionality of target method and your changes, but also about developers of other plugins, who may also patch this method before or after you. Try to change target method behaviour as little as possible, and avoid changing method signatures.
   * By default, this function logs to the console whenever a method is patched or unpatched in order to aid debugging by you and other developers, but these messages may be suppressed with the `silent` option.
   * Display name of patched method is changed, so you can see if a function has been patched (and how many times) while debugging or in the stack trace. Also, patched methods have property `__monkeyPatched` set to `true`, in case you want to check something programmatically.
   *
   * @author samogot
   * @param {object} what Object to be patched. You can can also pass class prototypes to patch all class instances. If you are patching prototype of react component you may also need {@link Renderer.rebindMethods}.
   * @param {string} methodName The name of the target message to be patched.
   * @param {object} options Options object. You should provide at least one of `before`, `after` or `instead` parameters. Other parameters are optional.
   * @param {doPatchCallback} options.before Callback that will be called before original target method call. You can modify arguments here, so it will be passed to original method. Can be combined with `after`.
   * @param {doPatchCallback} options.after Callback that will be called after original target method call. You can modify return value here, so it will be passed to external code which calls target method. Can be combined with `before`.
   * @param {doPatchCallback} options.instead Callback that will be called instead of original target method call. You can get access to original method using `originalMethod` parameter if you want to call it, but you do not have to. Can't be combined with `before` and `after`.
   * @param {boolean} [options.once=false] Set to `true` if you want to automatically unpatch method after first call.
   * @param {boolean} [options.silent=false] Set to `true` if you want to suppress log messages about patching and unpatching. Useful to avoid clogging the console in case of frequent conditional patching/unpatching, for example from another monkeyPatch callback.
   * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
   * @return {cancelPatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
   */
  const monkeyPatch =
    (hasLib && DI.monkeyPatch) ||
    ((what, methodName, options) => {
      const { before, after, instead, once = false, silent = false } = options;
      const displayName =
        options.displayName ||
        what.displayName ||
        what.name ||
        what.constructor.displayName ||
        what.constructor.name;
      if (!silent) console.log("patch", methodName, "of", displayName);
      const origMethod = what[methodName];
      const cancel = () => {
        if (!silent) console.log("unpatch", methodName, "of", displayName);
        what[methodName] = origMethod;
      };
      what[methodName] = function () {
        /**
         * @interface
         * @name PatchData
         * @property {object} thisObject Original `this` value in current call of patched method.
         * @property {Arguments} methodArguments Original `arguments` object in current call of patched method. Please, never change function signatures, as it may cause a lot of problems in future.
         * @property {cancelPatch} cancelPatch Function with no arguments and no return value that may be called to reverse patching of current method. Calling this function prevents running of this callback on further original method calls.
         * @property {function} originalMethod Reference to the original method that is patched. You can use it if you need some special usage. You should explicitly provide a value for `this` and any method arguments when you call this function.
         * @property {originalMethodCall} callOriginalMethod This is a shortcut for calling original method using `this` and `arguments` from original call.
         * @property {*} returnValue This is a value returned from original function call. This property is available only in `after` callback or in `instead` callback after calling `callOriginalMethod` function.
         */
        const data = {
          thisObject: this,
          methodArguments: arguments,
          cancelPatch: cancel,
          originalMethod: origMethod,
          callOriginalMethod: () =>
            (data.returnValue = data.originalMethod.apply(
              data.thisObject,
              data.methodArguments
            )),
        };
        if (instead) {
          const tempRet = instead(data);
          if (tempRet !== undefined) data.returnValue = tempRet;
        } else {
          if (before) before(data);
          data.callOriginalMethod();
          if (after) after(data);
        }
        if (once) cancel();
        return data.returnValue;
      };
      what[methodName].__monkeyPatched = true;
      what[methodName].displayName =
        "patched " + (what[methodName].displayName || methodName);
      return cancel;
    });

  /**
   * @author samogot
   */
  const WebpackModules =
    (hasLib && DI.WebpackModules) ||
    (() => {
      const req =
        typeof webpackJsonp == "function"
          ? webpackJsonp(
              [],
              {
                __extra_id__: (module, exports, req) => (exports.default = req),
              },
              ["__extra_id__"]
            ).default
          : webpackJsonp.push([
              [],
              {
                __extra_id__: (module, exports, req) => (module.exports = req),
              },
              [["__extra_id__"]],
            ]);
      delete req.m["__extra_id__"];
      delete req.c["__extra_id__"];

      /**
       * Predicate for searching module
       * @callback modulePredicate
       * @param {*} module Module to test
       * @return {boolean} Returns `true` if `module` matches predicate.
       */

      /**
       * Look through all modules of internal Discord's Webpack and return first one that matches filter predicate.
       * At first this function will look through already loaded modules cache. If no loaded modules match, then this function tries to load all modules and match for them. Loading any module may have unexpected side effects, like changing current locale of moment.js, so in that case there will be a warning the console. If no module matches, this function returns `null`. You should always try to provide a predicate that will match something, but your code should be ready to receive `null` in case of changes in Discord's codebase.
       * If module is ES6 module and has default property, consider default first; otherwise, consider the full module object.
       * @param {modulePredicate} filter Predicate to match module
       * @param {object} [options] Options object.
       * @param {boolean} [options.cacheOnly=false] Set to `true` if you want to search only the cache for modules.
       * @return {*} First module that matches `filter` or `null` if none match.
       */
      const find = (filter, options = {}) => {
        const { cacheOnly = false } = options;
        for (let i in req.c) {
          if (req.c.hasOwnProperty(i)) {
            let m = req.c[i].exports;
            if (m && m.__esModule && m.default && filter(m.default))
              return m.default;
            if (m && filter(m)) return m;
          }
        }
        if (cacheOnly) {
          console.warn("Cannot find loaded module in cache");
          return null;
        }
        console.warn(
          "Cannot find loaded module in cache. Loading all modules may have unexpected side effects"
        );
        for (let i = 0; i < req.m.length; ++i) {
          let m = req(i);
          if (m && m.__esModule && m.default && filter(m.default))
            return m.default;
          if (m && filter(m)) return m;
        }
        console.warn("Cannot find module");
        return null;
      };

      /**
       * Look through all modules of internal Discord's Webpack and return first object that has all of following properties. You should be ready that in any moment, after Discord update, this function may start returning `null` (if no such object exists anymore) or even some different object with the same properties. So you should provide all property names that you use, and often even some extra properties to make sure you'll get exactly what you want.
       * @see Read {@link find} documentation for more details how search works
       * @param {string[]} propNames Array of property names to look for
       * @param {object} [options] Options object to pass to {@link find}.
       * @return {object} First module that matches `propNames` or `null` if none match.
       */
      const findByUniqueProperties = (propNames, options) =>
        find(
          (module) => propNames.every((prop) => module[prop] !== undefined),
          options
        );

      /**
       * Look through all modules of internal Discord's Webpack and return first object that has `displayName` property with following value. This is useful for searching for React components by name. Take into account that not all components are exported as modules. Also, there might be several components with the same name.
       * @see Use {@link ReactComponents} as another way to get react components
       * @see Read {@link find} documentation for more details how search works
       * @param {string} displayName Display name property value to look for
       * @param {object} [options] Options object to pass to {@link find}.
       * @return {object} First module that matches `displayName` or `null` if none match.
       */
      const findByDisplayName = (displayName, options) =>
        find((module) => module.displayName === displayName, options);

      return { find, findByUniqueProperties, findByDisplayName };
    })();
})();

/*@end @*/
