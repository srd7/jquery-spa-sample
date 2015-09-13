var express = require("express");
var fs = require("fs");
var jade = require("jade");

var server = express();

server.use(express.static("build"));
server.use(express.static("public"));

var html = jade.compileFile("./_server/index.jade", { pretty: true })({ mode: process.env.MODE });

server.use(function (req, res) {
  res.write(html);
  res.end();
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log("Listening on port %s...", port);
