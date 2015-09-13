var gulp = require("gulp");
var rimraf = require("rimraf");
var nodemon = require("gulp-nodemon");
var webpack = require("webpack-stream");

// build ディレクトリを掃除
gulp.task("clean", function (callback) {
  rimraf("./build/*", callback);
});

function server(mode) {
  return function () {
    nodemon({
      script: "./_server/server.js",
      ext: "js jade",
      ignore: ["build/**"],
      env: { "PORT": 3000, "MODE": mode }
    });
  };
}

// サーバー起動
gulp.task("server:ww", server("ww"));
gulp.task("server:oj", server("oj"));

// webpack でコードをまとめる
gulp.task("webpack", ["clean"], function () {
  return gulp.src("./with-webpack/src/index.js")
    .pipe(webpack(require("./with-webpack/webpack.config")))
    .pipe(gulp.dest("build"));
});

// 必要なコードをコピーする
gulp.task("copy", ["clean"], function () {
  // jquery と main.js
  return gulp.src(["./node_modules/jquery/dist/jquery.js", "./only-jquery/main.js"])
    .pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
  gulp.watch(["./only-jquery/main.js"], ["copy"]);
});

gulp.task("default");
gulp.task("with-webpack", ["clean", "server:ww", "webpack"]);
gulp.task("only-jquery", ["clean", "server:oj", "copy", "watch"]);
