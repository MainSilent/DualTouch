const mix = require('laravel-mix');

mix.react('src/index.js', 'public/assets/js/app.js')
    .sass('src/styles/index.scss','public/assets/css/app.css');