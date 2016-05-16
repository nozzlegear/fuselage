var gulp = require("gulp");
var path = require("path");
var clean = require("gulp-clean");
var mergeTasks = require("merge2");
var minifyCss = require("gulp-clean-css");
var minifyJs = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var webpack = require('webpack-stream');
var sequence = require("gulp-sequence");
var sass = require('gulp-sass');
var autoprefix = require("gulp-autoprefixer");
var map = require("lodash").map;
var merge = require("lodash").merge;
var gutil = require("gulp-util");

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
    var webpackOptions = {
        module: {
            loaders: [
                { 
                    test: /\.css$/, 
                    loaders: ["style", "css"] 
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }
            ]
        }
    }
        
    var webpackTask = map(["bin/js/blog/blog-post.js", "bin/js/nav.js"], src =>
    {
        const filepath = path.parse(src);
        const options = merge({}, webpackOptions, {
            output: {
                filename: filepath.name + ".min.js",
            }
        });
        
        return gulp.src(src)
            .pipe(webpack(options))
            .pipe(minifyJs(uglifyOptions).on("error", gutil.log))
            .pipe(gulp.dest("wwwroot/js/" + filepath.dir.replace("bin/js", "")))
    });
    
    var sassTask = gulp.src(['css/**/*.scss', "css/*.scss"])
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(minifyCss(cssMinOptions))
        .pipe(rename(function (path) 
        {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('wwwroot/css'));        
        
    return mergeTasks(webpackTask.concat([sassTask]));
});