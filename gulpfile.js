var gulp = require("gulp");
var path = require("path");
var clean = require("gulp-clean");
var cleanCSS = require("gulp-clean-css");
var merge = require("merge2");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var webpack = require('webpack-stream');
var sequence = require("gulp-sequence");
var sass = require('gulp-sass');
var map = require("lodash").map;

gulp.task("build", function () 
{
    
})

gulp.task("default", function ()
{   
    var uglifyOptions = {
        mangle: true
    };
    var cssMinOptions = {
        processImport: false,
        processImportFrom: ['!fonts.googleapis.com']
    }
        
    var webpackTask = gulp.src(["bin/js/blog/blog-post.js"])
        .pipe(webpack())
        .pipe(rename(function  (path) 
        {
            path.basename = "blog-post"
            path.extname = ".min.js"
        }))
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest("wwwroot/js/blog"))

    var commonBundleTask = gulp.src(["node_modules/bootstrap/dist/css/bootstrap.css", "css/common/overrides.css", "css/common/theme.css", "css/common/nav.scss"])
        .pipe(concat("common.scss"))
        .pipe(sass())
        .pipe(cleanCSS(cssMinOptions))
        .pipe(rename(function (path)
        {
            path.basename = "common";
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest("wwwroot/bundles"));
        
    var postBundleTask = gulp.src([
            "css/post/post.css",
            "css/fuselage/fuselage.css",
            "css/cta/cta.css",
            "node_modules/highlightjs/styles/default.css",
            "node_modules/highlightjs/styles/vs.css"
        ])
        .pipe(concat("blog-post.min.css"))
        .pipe(cleanCSS(cssMinOptions))
        .pipe(gulp.dest("wwwroot/bundles"));
        
    var cssTask = gulp.src(['css/**/*.css', "css/*.css"])
        .pipe(cleanCSS(cssMinOptions))
        .pipe(rename(function (path) 
        {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('wwwroot/css'));        
        
    return merge([jsTask, webpackTask, commonBundleTask, postBundleTask, cssTask]);
});