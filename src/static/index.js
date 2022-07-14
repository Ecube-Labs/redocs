// `specUrls` 변수는 server-variables.js 에 의해 선언된다. 굳이 pug같은 템플릿 엔진 쓸 필요까진 없어보여서 이렇게 함.

function init() {
  const selector = document.getElementById("specUrlSelector");
  const options = specUrls.map((spec) => {
    const option = document.createElement("option");
    option.value = spec.name;
    option.selected = spec.name === getSpecName();
    option.append(spec.name);
    return option;
  });
  selector.append(...options);

  changeSpec(getSpecName());

  bindLocationChange(() => {
    changeSpec(getSpecName());
  });

  selector.addEventListener("change", function (e) {
    changeSpec(e.target.value);
  });
}

function bindLocationChange(callback) {
  (function () {
    const rs = history.pushState;
    history.pushState = function () {
      rs.apply(history, arguments);
      callback();
    };
  })();
  window.addEventListener("popstate", function () {
    callback();
  });
}

function getSpecName() {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get("name") || specUrls[0].name;
}

function changeSpec(name) {
  if (name !== getSpecName()) {
    history.pushState({}, "", "?name=" + name);
  }
  document.title = `${name} | API Documentation`;

  const spec = specUrls.find((s) => s.name === name);
  Redoc.init(spec.url);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!specUrls?.length) {
    document.body.append("Require `DOC_SPECS` environment variable");
    return;
  }

  init();
});
