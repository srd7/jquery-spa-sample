var $ = require("jquery");
var routing = require("./routing");

window.$ = $;

// ページ遷移を実行しようとする
function changePage(href) {
  // 指定パスが存在するかどうかをチェック
  // 存在するならページ遷移
  var route = routing.check(href);

  // マッチしなかった場合
  if (! route) {
    console.error("%s does not match routing!!", href);
    return;
  }

  // ページ遷移実行
  history.pushState("", route.title, href);
  document.title = route.title;
  $("#main").html(route.html);

  // データを読み込んでコールバック関数実行
  if (route.data && route.callback) {
    $.ajax({
      url: route.data,
      success: route.callback,
      error: function (xhr, status, error) {
        console.error(error);
      }
    });
  }
}

// <a> タグを踏んだら無条件でここを通るようにする
$("a").on("click", function (event) {
  var $a = $(event.target);

  // target="_self" なら、普通のリンクと見なして何もしない。
  if ($a.attr("target") === "_self") {
    return;
  }
  // ページ遷移を禁止して、自前で遷移させる
  event.preventDefault();
  changePage($a.attr("href"));
});

// 読み込み時にもページ遷移をかます
$(document).on("ready", function () {
  changePage(location.pathname);
});
