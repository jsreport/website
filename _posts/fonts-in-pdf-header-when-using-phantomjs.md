{{{
    "title"    : "Fonts in pdf header when using phantomjs",	   
    "date"     : "06-21-2017 21:50"	
}}}

You may have notice that [phantom-pdf](/learn/phantom-pdf) recipe rendering doesn't print custom fonts in the header. The problem is that phantomjs doesn't allow loading a remote resource like a web font inside the header and you need to take three steps to workaround this limitation.

1. Embed the custom font using base64 [asset](/learn/assets) inside the header
```cs
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
<h1>Hello from header</h1>
```
2.  The second required trick is embed the same font also to the template main content so phantomjs can add it to the cache.

3. The last piece of the puzzle is to apply the custom font to an element also in the template main content, because otherwise phantomjs will just skip it. Unfortunately such element cannot be hidden through style, but you can still add an invisible character such as `&zwnj;` there.

```html
<div style='font-family: cobaltaliensuperital'>&zwnj;</div>
```

<br/><br/>
You can find working demo in the playground

<iframe src='https://playground.jsreport.net/studio/workspace/HyGQQ-KHl/37?embed=1' width="100%" height="400" frameborder="0"></iframe>