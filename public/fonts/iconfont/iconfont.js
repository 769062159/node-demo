(function(window) {
  var svgSprite =
    '<svg><symbol id="anticon-logistics" viewBox="0 0 1024 1024"><path d="M931.562193 825.744657c-14.494109 0-26.245757-11.751648-26.245757-26.245757L905.316435 226.756467c0-38.524408-31.340799-69.872371-69.860091-69.872371L425.707147 156.884097c-38.512129 0-69.846788 31.346939-69.846788 69.872371l0 70.128197c0 11.720949-7.779174 22.023596-19.057031 25.240871-44.073798 12.57234-167.644161 55.608505-209.5332 103.148241-11.059893 12.55392-11.252275 42.971697-9.637498 54.91675 0.159636 1.159406 0.236384 2.338255 0.236384 3.511987l0 307.952744c0 14.494109-11.751648 26.245757-26.246781 26.245757-14.495132 0-26.246781-11.751648-26.246781-26.245757L65.375451 485.296825c-1.345648-11.861142-5.273097-63.195298 22.511713-94.728478 49.27731-55.921637 168.663374-98.156554 215.479633-113.106034l0-50.705845c0-67.475787 54.884005-122.366955 122.340349-122.366955l409.749198 0c67.463508 0 122.352629 54.891168 122.352629 122.366955l0 572.741409C957.809997 813.991985 946.057325 825.744657 931.562193 825.744657z"  ></path><path d="M314.337663 571.130725 209.286072 571.130725c-7.247054 0-13.122879-5.867638-13.122879-13.122879 0-7.253194 5.875824-13.122879 13.122879-13.122879l105.051591 0c13.508665 0 21.86396-16.538675 21.86396-31.860638L336.201623 397.950478c0-7.247054 5.875824-13.122879 13.123902-13.122879 7.247054 0 13.122879 5.875824 13.122879 13.122879L362.448404 513.02433C362.448404 541.582759 344.454588 571.130725 314.337663 571.130725z"  ></path><path d="M169.2748 571.130725l-20.005636 0c-7.248078 0-13.123902-5.867638-13.123902-13.122879 0-7.253194 5.876847-13.122879 13.123902-13.122879l20.005636 0c7.247054 0 13.122879 5.869684 13.122879 13.122879C182.397678 565.263088 176.521854 571.130725 169.2748 571.130725z"  ></path><path d="M309.326533 924.387281c-64.117296 0-116.278283-52.172243-116.278283-116.291586 0-64.105017 52.160987-116.251677 116.278283-116.251677 64.11832 0 116.278283 52.146661 116.278283 116.251677C425.604816 872.215038 373.443829 924.387281 309.326533 924.387281zM309.326533 744.337579c-35.173081 0-63.784722 28.606525-63.784722 63.759139 0 35.180244 28.610618 63.799048 63.784722 63.799048s63.784722-28.618804 63.784722-63.799048C373.111255 772.944104 344.499613 744.337579 309.326533 744.337579z"  ></path><path d="M709.42493 924.387281c-64.110133 0-116.263957-52.172243-116.263957-116.291586 0-64.105017 52.153824-116.251677 116.263957-116.251677 64.130599 0 116.303866 52.146661 116.303866 116.251677C825.728796 872.215038 773.555529 924.387281 709.42493 924.387281zM709.42493 744.337579c-35.165918 0-63.771419 28.606525-63.771419 63.759139 0 35.180244 28.605501 63.799048 63.771419 63.799048 35.187407 0 63.810305-28.618804 63.810305-63.799048C773.235235 772.944104 744.612337 744.337579 709.42493 744.337579z"  ></path><path d="M619.40673 834.344522 409.354714 834.344522c-14.495132 0-26.246781-11.751648-26.246781-26.247804 0-14.494109 11.751648-26.245757 26.246781-26.245757l210.05304 0c14.494109 0 26.245757 11.751648 26.245757 26.245757C645.653511 822.591851 633.900839 834.344522 619.40673 834.344522z"  ></path></symbol></svg>';
  var script = (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var shouldInjectCss = script.getAttribute('data-injectcss');
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) {
        setTimeout(fn, 0);
      } else {
        var loadFn = function() {
          document.removeEventListener('DOMContentLoaded', loadFn, false);
          fn();
        };
        document.addEventListener('DOMContentLoaded', loadFn, false);
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn);
    }
    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        init = function() {
          if (!done) {
            done = true;
            fn();
          }
        };
      var polling = function() {
        try {
          d.documentElement.doScroll('left');
        } catch (e) {
          setTimeout(polling, 50);
          return;
        }
        init();
      };
      polling();
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null;
          init();
        }
      };
    }
  };
  var before = function(el, target) {
    target.parentNode.insertBefore(el, target);
  };
  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild);
    } else {
      target.appendChild(el);
    }
  };
  function appendSvg() {
    var div, svg;
    div = document.createElement('div');
    div.innerHTML = svgSprite;
    svgSprite = null;
    svg = div.getElementsByTagName('svg')[0];
    if (svg) {
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      svg.style.width = 0;
      svg.style.height = 0;
      svg.style.overflow = 'hidden';
      prepend(svg, document.body);
    }
  }
  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  ready(appendSvg);
})(window);
