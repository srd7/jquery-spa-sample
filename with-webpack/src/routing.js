var $ = require("jquery");

// == 作り方 ==
// path    : マッチさせるURL。パラメータは :id みたいにする。
// title   : ページタイトル
// html    : 読み込むページタイトル。
// data    : 読み込まれるデータ
// callback: データ読み込み後に呼ぶ関数。DOMにデータ反映させるのに使う。
var routing = {
  home: {
    path: "/",
    title: "Home",
    html: require("./templates/home.jade"),
    data: "/json/home.json",
    callback: function (data) {
      var $ul = $("ul.notification");
      $.each(data.notification, function (key, item) {
        var $li = $("<li>").text(item.contents + " " + new Date(item.timestamp * 1000));
        $ul.append($li);
      });
    }
  },
  page: {
    path: "/page/:id",
    title: function (id) {
      return "Page No. " + id;
    },
    html: require("./templates/page.jade"),
    data: function (id) {
      return "/json/page" + id + ".json";
    },
    callback: function (data) {
      $("p.title").text(data.title);
      $("p.contents").text(data.contents);
    }
  }
};

function checkPath(path) {
  // path を正規表現に変換する
  var routingPathRegex = Object.keys(routing).map(function (key) {
    var path = routing[key].path;
    var regex = new RegExp(path.replace(/:([^\/]+)/g, "([^\/]+)"));
    return {
      key : key,
      path: regex
    };
  });

  var route = null;
  $.each(routing, function (key, value) {
    if (! route) {
      // path を正規表現に変換
      var regex = new RegExp("^" + value.path.replace(/:([^\/]+)/g, "([^/]+)") + "$");
      var match = path.match(regex);
      if (match) {
        // コピーを格納
        route = $.extend({}, value);
        // マッチしたデータを関数に投げる。
        // 先頭は文字列全部が入っちゃうから飛ばす。
        var data = match.slice(1);
        // data と title が関数なら文字列に変換
        ["data", "title"].forEach(function (key) {
          if (typeof route[key] === "function") {
            route[key] = route[key].apply(null, data);
          }
        });
      }
    }
  });
  return route;
}

module.exports = {
  check: checkPath
};
