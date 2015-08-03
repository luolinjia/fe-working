# A new widget of [banner slider](https://github.com/luolinjia/fe-working/tree/gh-pages/jquery-multislider)

## Direct Link

[Demo](http://luolinjia.com/fe-working/jquery-multislider/)

## 1.1 

- Fix the centering about banner images.(No matter whether it's zooming in or zooming out)
    - **Zoom In**: as browser resolution becomes bigger, you need DIY the outest layer if you want.
    - **Zoom Out**: as browser resollution becomes smaller, do **Nothing**

## Usage 1.0

- all functions


```js
$('.all', $('.control-all')).multislider({
    banners: [{
        name: {
            step1: 'img/banner_n1.jpg',
            step2: 'img/b_title1.png',
            step2label: '查看详情',
            step3: 'img/banner_line1.png'
        },
        link: '#'
    }, {
        name: {
            step1: 'img/banner_n2.jpg',
            step2: 'img/b_title2.png',
            step2label: '接入OneNET',
            step3: 'img/banner_line2.png'
        },
        link: '#'
    }, {
        name: {
            step1: 'img/banner_n3.jpg',
            step2: 'img/b_title3.png',
            step2label: '进入开发者中心',
            step3: 'img/banner_line1.png'
        },
        link: '#'
    }, {
        name: {
            step1: 'img/banner_n4.jpg',
            step2: 'img/b_title4.png',
            step2label: '联系我们',
            step3: 'img/banner_line1.png'
        },
        link: '#'
    }]
});
```

- API
    - html.(class name .all is not been changed, as it is associated with CSS file : all.css). But you can put div.all in some blocks wherever you want.
    ```html
    <div class="all"></div>
    ```
    - effects DIY
    ```html
    $('.all').multislider({
        banners: [],                // REQUIRED!!!
        width: 1920,                // the default width value
        dots: true,                 // display the dots under of it.
        number: false,              // display the number regarding dots.
        color: '#e6e6e6',           // set the default color for the dots' background-color
        verticalDuring: 1000,       // the time of animation regarding the transition vertical
        highlight: '#e63939',       // highlight the dots' background-color
        aDuring: 3500,              // set the total animation time
        aBack: true,                // set whether you need to animate something after showing the right to left.
        aDirection: 'RTL'           // 'RTL' right to left; 'LTR' left to right
    });
    ```