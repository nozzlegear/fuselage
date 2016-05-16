"use strict";

const gulp = require("gulp");
const path = require("path");
const clean = require("gulp-clean");
const mergeTasks = require("merge2");
const minifyCss = require("gulp-clean-css");
const minifyJs = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const webpack = require('webpack-stream');
const sequence = require("gulp-sequence");
const sass = require('gulp-sass');
const autoprefix = require("gulp-autoprefixer");
const gutil = require("gulp-util");
const ts = require("gulp-typescript");
const gulpForeach = require('gulp-foreach');
const map = require("lodash").map;
const merge = require("lodash").merge;
const server = require("gulp-develop-server");

const tsBrowserFiles = ["js/**/*.ts"];
const tsServerFiles = ["server.ts", "routes/**/*.ts", "views/**/*.{ts,tsx}"];
const sassFiles = ['css/**/*.scss', "css/*.scss"];

const findTsDir = (desiredFolder, filepath) =>
{
    if (!filepath) return desiredFolder;
    
    if (path.normalize(desiredFolder).indexOf(path.sep) > -1)
    {
        throw new Error("Error finding tsdir. Because of the way ts works with single files, desiredFolder cannot contain a path. Good: 'wwwroot'. Bad: 'wwwroot/path'");
    }
    
    const projDir = path.resolve(__dirname).toLowerCase();
    const parsedPath = path.parse(filepath);

    return path.join(projDir, desiredFolder, parsedPath.dir.toLowerCase().replace(projDir, "")); 
}

const sassTask = (gulpSrc) =>
{
    const cssMinOptions = {
        processImport: false,
        processImportFrom: ['!fonts.googleapis.com']
    }
    
    return gulpSrc
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(minifyCss(cssMinOptions))
        .pipe(rename((path) => 
        {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('wwwroot/css'));
}

const tsTask = (type, gulpSrc, singleFileSrcPath) =>
{
    const isServer = type === "server";
    let outputPath = findTsDir(isServer ? "bin" : singleFileSrcPath ? "wwwroot" : "wwwroot/js", singleFileSrcPath);
    const project = ts.createProject(path.resolve(__dirname, isServer ? "./tsconfig.json" : "./js/tsconfig.json"));
    
    const task = gulpSrc
        .pipe(ts(project))
        .js;
        
    if (isServer)
    {
        return task.pipe(gulp.dest(outputPath));
    }
    
    const uglifyOptions = {
        mangle: true
    };
    const webpackOptions = {
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
    };
    
    return task
        .pipe(gulp.dest(outputPath)) //webpack-stream bug, files must exist on disk: https://github.com/shama/webpack-stream/issues/72
        .pipe(gulpForeach((stream, file) =>
        {
            // Using gulp-foreach to modify webpack options and prevent webpack from renaming all files
            // to its rando hashes.
            
            const filepath = path.parse(file.path);
            const options = merge({}, webpackOptions, {
                output: {
                    filename: filepath.name + ".min.js",
                }
            });
            
            return stream
                .pipe(webpack(options))
                .pipe(minifyJs(uglifyOptions).on("error", gutil.log))
                .pipe(gulp.dest(filepath.dir));
        }));
}

gulp.task("sass", function () 
{
    return sassTask(gulp.src(sassFiles));
});

gulp.task("ts:browser", function ()
{
    return tsTask("browser", gulp.src(tsBrowserFiles));
});

gulp.task("ts:server", () =>
{
    return tsTask("server", gulp.src(tsServerFiles));
});

gulp.task("default", ["sass", "ts:server", "ts:browser"]);

gulp.task("watch", ["default"], (cb) => 
{        
    server.listen({path: "bin/server.js"});
    
    gulp.watch(sassFiles, (event) => 
    {
        console.log('Sass file ' + event.path + ' was changed.');
        
        return sassTask(gulp.src(event.path));
    });
    
    gulp.watch(["bin/*.js", "bin/**/*.js"], server.restart);
    
    gulp.watch(tsServerFiles, (event) =>
    {
        console.log('TS server file ' + event.path + ' was changed.');
        
        return tsTask("server", gulp.src(event.path), event.path);
    });
    
    gulp.watch(tsBrowserFiles, (event) =>
    {
        console.log('TS browser file ' + event.path + ' was changed.');
        
        return tsTask("browser", gulp.src(event.path), event.path);
    });
});