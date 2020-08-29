const mix = require('laravel-mix');

mix.react('src/index.js', 'public/assets/js/app.js')
    .styles(
    [
        'src/components/react/style/Main.css',
        'src/components/react/style/Loader.css',
        'src/components/react/style/SideBar.css'
    ],
    'public/assets/css/app.css'
);