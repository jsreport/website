{{{
    "title"    : "font awesome icons in reports",	   
    "date"     : "01-10-2017 11:42"	
}}}

You can use [fontawesome](http://fontawesome.io/) icons in html as well as pdf reports. However there are three different approaches how to link font awesome into the report template and all of them have different pros and cons. 

##Link using public cdn

The easiest way is to use a public cdn to link the font awesome css. This is quickly done, but your server needs to have access to the internet and it makes you relying on the cdn availability.

```html
<html>

<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
    <i class="fa fa-4x fa-rocket"></i>
</body>

</html>


```

##Upload as asset

The second approach is to use [assets](http://jsreport.net/learn/assets) extension to upload the font into jsreport.  You can find the description how to do this in my previous post [fonts in pdf](http://jsreport.net/blog/fonts-in-pdf). Note you need to upload both `font-awesome.css` and `fontawesome-webfont.woff` files in this case. 

The `font-awesome.css` uses relative path to link the font, but this won't work because the font is stored as the asset in the different location. You need to embed the font to the template extra and then override the css to use it. This can be done by introducing the new `font-family` and overriding `font-awesome.css` to use it.
```html
<html>

<head>
    <style>
        {#asset font-awesome.css}
        
        .fa {
           font-family: 'FontAwesome2' !important; 
        }
        
        @font-face {
          font-family: 'FontAwesome2';
          src: url({#asset fontawesome-webfont.woff @encoding=dataURI});
          format('woff');
        }
    </style>
</head>

<body>
    <i class="fa fa-4x fa-rocket"></i>
</body>

</html>
```

The declaration looks quite verbose so you may want to cut the style and separate it into an extra asset.

##Link as asset

The last option is to unzip the whole font awesome distribution somewhere to your application and enable assets extension to read from the disk in the config file.

```js
"assets": {
    "publicAccessEnabled": true,
    "searchOnDiskIfNotFoundInStore": true,
    "allowedFiles": "**/*.*"
  }
```

Now you can reach all files in your application using assets syntax and simply link the font awesome css in the template. 

```html
<html>

<head>
    <link rel="stylesheet" href="{#asset public/font-awesome/css/font-awesome.min.css @encoding=link}">
</head>

<body>
    <i class="fa fa-4x fa-rocket"></i>
</body>

</html>
```

Please find more information and downsides of linking assets in the [documentation](http://jsreport.net/learn/assets#embedding-assets-as-links).