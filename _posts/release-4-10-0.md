{{{
    "title": "Release 4.10.0",
    "date": "07-31-2025 10:15"
}}}



[jsreport 4.10.0](https://github.com/jsreport/jsreport/releases/tag/4.10.0) is here and brings several new features for PDF as well as for office recipes.

## PDF compression
The [pdf-utils](/learn/pdf-utils) extension now supports enabling PDF compression.

![compression](/img/pdf-compression.png)

The compression algorithm performs several optimization steps, such as converting images to JPEG or improving PDF structures. This can dramatically decrease the final PDF size. The [pdf stock showcase](/showcases/) PDF size, for example, drops from 2851 kB to 690 kB with compression enabled.

## XLSX dynamic cells

The most complex task in this release was providing support for rendering dynamic cells in the [XLSX recipe](/learn/xlsx).
This means you can pass to the `each` loop matrix of cells, and it takes care of rendering the dynamic table based on your input.

If you type handlebars into the Excel cell like this
```handlebars
{{#each cells=items}}{{this}}{{/each}}
```

and provide the following input data
```json
{
  "items": [
    ["Name", "Lastname", "Score"],
    ["Boris", "Matos", 50]
    ["Alexander", "Smith", 32],
    ["John", "Doe", 25]
  ]
}
```

The generated cells will look like this

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Lastname</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Boris</td>
            <td>Matos</td>
            <td>50</td>
        </tr>
        <tr>
            <td>Alexander</td>
            <td>Smith</td>
            <td>32</td>
        </tr>
        <tr>
            <td>John</td>
            <td>Doe</td>
            <td>25</td>
        </tr>
    </tbody>
</table>

This opens new options for your Excel structures, because you can prepare the cells definition in a dynamic way using extra helper and js code.

## Conclusion

The jsreport 4.10.0 brings nice improvements, and we are already working on the next 4.11.0. 
Stay tuned.