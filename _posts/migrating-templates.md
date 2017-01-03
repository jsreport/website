{{{
    "title"    : "Migrating templates",	   
    "date"     : "01-03-2017 11:52"	
}}}

jsreport offers 3 ways how to migrate templates between servers. These are summarized in the next chapters which are sorted by the convenience of the usage.

##Using extension

jsreport includes [import-export](http://jsreport.net/learn/import-export) extension which can be used to export templates into zip file and re-import it to a different instance. You can use the extension's studio UI to do this or even automate it using the REST API.

![export](http://jsreport.net/img/export.gif)

The nice thing about this is that the same export zip can be imported to a server instance using a different template store. This means you can use this also to migrate from local template store into sql for example. 

Check the [import-export documentation](http://jsreport.net/learn/import-export) for details.


##Manual copy

You can also manually copy stored templates to different location, however this varies based on the used template store. 

| Template store| Migration|
| ------------- |-------------|
| file system   | copy paste the `data` folder |
| mongodb       | mongodump and mongorestore jsreport collections  |
| sql | insert from select for jsreport tables      |

Note that this technique can be used only when the source and target template store type matches.

##OData API

The last option is to use the jsreport [odata REST API](http://jsreport.net/learn/api#querying-and-crud) to query the required templates from one instance and post the results to the different server instance. This will work also if the source template store is different from the target. It is probably the most complex technique which is completely adaptable but time consuming to implement. 



