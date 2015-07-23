# A new widget of [banner slider](https://github.com/luolinjia/fe-working/tree/gh-pages/jquery-multislider)

## Direct Link

[Demo](http://luolinjia.com/fe-working/jquery-multislider/)

## Usage

- all functions
```html
<div class="all">
     <div class="outer">
         <div class="inner"><img src="img/banner_n1.jpg" alt=""/></div>
         <a href="#" class="inner-slider">
             <div class="inner-slider-img"><img src="img/b_title1.png" /></div>
             <button>查看详情</button>
         </a>
         <div class="inner-line"><img src="img/banner_line1.png" alt=""/></div>
     </div>
     <div class="outer">
         <div class="inner"><img src="img/banner_n2.jpg" alt=""/></div>
         <a href="#" class="inner-slider">
             <div class="inner-slider-img"><img src="img/b_title2.png" /></div>
             <button>接入OneNET</button>
         </a>
         <div class="inner-line"><img src="img/banner_line2.png" alt=""/></div>
     </div>
     <div class="outer">
         <div class="inner"><img src="img/banner_n3.jpg" alt=""/></div>
         <a href="#" class="inner-slider">
             <div class="inner-slider-img"><img src="img/b_title3.png" /></div>
             <button>进入开发者中心</button>
         </a>
         <div class="inner-line"><img src="img/banner_line1.png" alt=""/></div>
     </div>
     <div class="outer">
         <div class="inner"><img src="img/banner_n4.jpg" alt=""/></div>
         <a href="#" class="inner-slider">
             <div class="inner-slider-img"><img src="img/b_title4.png" /></div>
             <button>联系我们</button>
         </a>
         <div class="inner-line"><img src="img/banner_line1.png" alt=""/></div>
     </div>
 </div>
```

```js
$('.all').multislider();
```

- API
    - html DIY.(div.all is your DIY. and you can remove some tags you don't need, like this:)But You can't remove or replace the classes:**outer** or **inner** except that you change the style class name in the same time.
    ```html
    <div class="all">
         <div class="outer">
             <div class="inner"><img src="img/banner_n1.jpg" alt=""/></div>
         </div>
         <div class="outer">
             <div class="inner"><img src="img/banner_n2.jpg" alt=""/></div>
         </div>
         <div class="outer">
             <div class="inner"><img src="img/banner_n3.jpg" alt=""/></div>
         </div>
         <div class="outer">
             <div class="inner"><img src="img/banner_n4.jpg" alt=""/></div>
         </div>
     </div>
    ```
    - effects DIY
    ```html
    $('.all').multislider({
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