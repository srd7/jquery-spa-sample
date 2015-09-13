(function ($) {
  // ルーティング登録
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
      html: "/html/home.html",
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
      html: "/html/page.html",
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


  // ページ遷移を実行しようとする
  function changePage(href) {
    // 指定パスが存在するかどうかをチェック
    // 存在するならページ遷移
    var route = checkPath(href);

    // マッチしなかった場合
    if (! route) {
      console.error("%s does not match routing!!", href);
      return;
    }

    // ページ遷移実行
    history.pushState("", route.title, href);
    document.title = route.title;
    $.ajax({
      url: route.html,
      success: function (html) {
        $("#main").html(html);
        // HTML を読み込んでからでないとデータを埋め込めない
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
      },
      error: function (xhr, status, error) {
        console.error(error);
      }
    });
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
})(jQuery);
