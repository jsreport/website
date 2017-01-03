{{{
    "title"    : "Fonts in pdf",	   
    "date"     : "01-03-2017 16:35"	
}}}

Don't like the default font in the pdf reports? You can easily embed a custom font using [assets](http://jsreport.net/learn/assets) extension.

The first you need to download a font you like from the internet. There are thousands of them available for free. You can pick anyone with  `woff`, `ttf` or `otf`  extension.

The second step is to upload the downloaded font as asset. Usually you need to unzip the font you've downloaded and pick up the file with previously mentioned extension.

![asset-upload](http://jsreport.net/blog/upload-asset.png)

The studio then preview the font and you should copy to your clipboard the embedding code.

![asset-copy](http://jsreport.net/blog/asset-copy.png)

The last step is to paste the embedding code into a template and apply the `font-family` into elements you want. This looks usually like this:

```csss
<style>
    @font-face {
      font-family: 'cobaltaliensuperital';
      src: url({#asset cobaltaliensuperital.woff @encoding=dataURI});
      format('woff');
    }
    
    * {
        font-family: 'cobaltaliensuperital';
    }
</style>

<h1>Using assets to embed custom font</h1>
```

You can play with this example also in playground

<iframe src='https://playground.jsreport.net/studio/workspace/HyGQQ-KHl/8?embed=1' width="100%" height="400" frameborder="0"></iframe>