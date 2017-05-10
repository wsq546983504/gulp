/***
 * 压缩js、css、html
 * 文件打包
 */

const gulp = require('gulp'),
      concat = require('gulp-concat'), //合并文件
      less = require('gulp-less'), //编译less文件
      minifyCss = require('gulp-minify-css'), //压缩css
      minify = require('gulp-minify'), //压缩
      zip = require('gulp-zip'), //打包成zip
      del = require('del'), //删除
      uglify = require('gulp-uglify'), //js压缩
      htmlmin = require('gulp-htmlmin'), //压缩html
      image = require('gulp-image'), //图片压缩
      watch = require('gulp-watch'), //监听更新
      connect = require('gulp-connect'), //web服务器
      autoprefixer = require('gulp-autoprefixer'), // autoprefixer：自动添加css前缀
      gulpLoadPlugins = require('gulp-load-plugins'), // gulp-load-plugins：用来加载插件，避免我们再头部声明一堆插件，做到想用就用
      proxy = require('http-proxy-middleware'), // 代理插件，解决跨域
      copy = require('gulp-file-copy'), // 拷贝
      babel = require('gulp-babel'), // 把es6转换成es5,babel插件依赖babel-preset-es2015插件
      runSequence = require('run-sequence'); //运行gulp任务
    //   browser-sync：热启动
    //   http-proxy-middleware：配合browser-sync进行跨域  
    //   gulp-rev,gulp-rev-collector替换路径，进行版本管理，添加hash

//路径
let path = {
    input:{
        html:['src/*.html'],
        js:['src/js/*.js'],
        less:['src/css/*.less'],
        img:['src/img/*'],
        assets:['src/assets/*.js']    
    },
    output:{
        dist:'dist',
        js:'dist/js',
        css:'dist/css',
        img:'dist/img',
        assets:'src/assets'
    }
};

//编译less文件
gulp.task('less',function(){
    return gulp.src(path.input.less)
            .pipe(less())
            .pipe(autoprefixer({
                rowsers: ['last 2 versions', 'Android >= 4.0'], // 主流浏览器的最新两个版本
                cascade: true, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove:true //是否去掉不必要的前缀 默认：true 
            }))
            .pipe(minifyCss())
            .pipe(gulp.dest(path.output.css))
            .pipe(connect.reload());
});

//es6
gulp.task('babel',function(){
    return gulp.src(path.input.js)
            .pipe(babel({presets: ['es2015']}))
            .pipe(gulp.dest(path.output.assets))
            .pipe(connect.reload());
});

//压缩js
gulp.task('js',['babel'],function(){
    // var options = {
    //     mangle：true, // 是否混淆变量名，默认为true(混淆)，全局变量不会被混淆
    //     output：'', // 传递你一个对象去指定输出的选项，个人理解是定制化的去压缩，传递一个参数对象，否则执行默认的参数。（不确定） 
    //     compress：true, // 是否完全压缩，默认为true（全压）； 
    //     preserveComments：false // 是否保留备注，默认不保留； 
    // };
    
    return gulp.src(path.input.assets)
            .pipe(uglify())
            .pipe(gulp.dest(path.output.js))
            .pipe(connect.reload());
});


//删除
gulp.task('del',function(){
    return del(path.output.dist);
});

//压缩图片
 gulp.task('image',function(){
     return gulp.src(path.input.img)
            .pipe(image({
                    pngquant: true,
                    optipng: false,
                    zopflipng: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    mozjpeg: true,
                    guetzli: false,
                    gifsicle: true,
                    svgo: true,
                    concurrent: 10
                }))
            .pipe(gulp.dest(path.output.img));
 });

 //压缩html
 gulp.task('htmlmin',function(){
    //  var options = {
    //                 removeComments: true,//清除HTML注释
    //                 collapseWhitespace: true,//压缩HTML
    //                 collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    //                 removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    //                 removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    //                 removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    //                 minifyJS: true,//压缩页面JS
    //                 minifyCSS: true//压缩页面CSS
    //             };

     return gulp.src(path.input.html)
            // .pipe(htmlmin(options))
            .pipe(gulp.dest(path.output.dist))
            .pipe(connect.reload());
 });

 //web服务器
 gulp.task('webServer',function(){
    connect.server({
        livereload: true, // 实时刷新
        // root:'gulp', // 根目录
        port:'8888',// 端口
        // middleware: function(connect, opt) {
        //     return [
        //         proxy('/src',  {
        //             target: 'http://localhost:8888',
        //             changeOrigin:true
        //         }),
        //         proxy('/otherServer', {
        //             target: 'http://IP:Port',
        //             changeOrigin:true
        //         })
        //     ]
        // }
    });
 });

 //监听更新
gulp.task('watch',function(){
    var file = [path.input.js,path.input.less,path.input.html];
    gulp.watch(file,['htmlmin','less','js','image']);
});


//运行gulp任务
gulp.task('runSequence',function(callback){
    runSequence('del',['htmlmin','less','image','js'],callback);
});


//默认运行任务
gulp.task('default',['webServer','runSequence']);


