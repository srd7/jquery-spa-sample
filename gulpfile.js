var gulp = require("gulp");
var rimraf = require("rimraf");
var nodemon = require("gulp-nodemon");
var webpack = require("webpack-stream");

// build ディレクトリを掃除
gulp.task("clean", function (callback) {
  rimraf("./build/*", callback);
});

// サーバー起動
gulp.task("server", function () {
  nodemon({
    script: "./_server/server.js",
    ext: "js jade",
    ignore: ["build/**"],
    env: { "PORT": 3000 }
  });
});

gulp.task("webpack", ["clean"], function () {
  return gulp.src("./with-webpack/src/index.js")
    .pipe(webpack(require("./with-webpack/webpack.config")))
    .pipe(gulp.dest("build"));
});

gulp.task("default");
gulp.task("with-webpack", ["clean", "server", "webpack"]);
