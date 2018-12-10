
{{{
    "title"    : "Introducing folders",
    "date": "12-10-2018 13:30"
}}}
  

jsreport now supports structuring entities into the folders.  This is significant improvement that affects jsreport on several layers. Lets take a look what this brings. 

![tree](../blog/tree.png)

## Studio
Probably the most significant part of the folders feature was implemented into the jsreport studio. The folders are not just nicely visualized, but you can do bunch of things you would expect. Like collapsing, expanding, cut, paste or drag/drop folders. In other words, you should be able to structure hundreds of templates using folders and keep your workspace clean and easy to orient in.

There will be more UX improvements coming in the next releases. Please give us your suggestions or up-vote already filled requests [here](https://github.com/jsreport/jsreport/labels/studio).

## Assets
With the folders introduction, the assets can be now referenced also using relative or absolute path. This is not breaking change because the reference based on the name still works. However you need to assure the asset name is unique.
```
{#asset /shared/styles/theme.css}
{#asset ../shared/chart.js}
{#asset chart.js}
```


## Child templates
Exactly the same applies also for the child templates. You can now reference child templates additionally using absolute or relative path.
```
{#child /headers/myHeader}
{#child ../shared/myHeader}
{#child shared/myHeader}
```

## API
The folders are reflected also to the API. You can now specify the template name additionally using the absolute path. We recommend to use this notation in bigger projects. However you can still use the old style based on the name as long as the name is unique.
```json
{
  "template": {
	"name": "/mycustomer/templates/invoice"
  }
  "data": { ... }
}
```

## Permissions
The very significant improvements have been done to the authorization and permissions. The permissions are now inherited from the folders down the tree. This means you can give read permissions to the particular user to the particular folder and the user gets permissions to the all entities bellow.

##  File system store
The folders feature is [template store](https://jsreport.net/learn/template-stores) agnostic and works on every store jsreport supports. However there are some [file system based store](https://jsreport.net/learn/fs-store) adaptations we made to make the folders feature complete. Primarily the directories that you can find in the `data` are automatically treated as folders so the visualization in the studio really reflects the file system based structure. 

## Samples
Minor change but the nice one. The samples are now automatically created in the extra `samples` folder and doesn't pollute your workspace.

## Migration
This is not breaking change and part of the `jsreport@2.3.0` release. However we recommend to backup your data before updating, because jsreport needs to update your entities during the start.