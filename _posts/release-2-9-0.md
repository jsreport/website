{{{
    "title": "Release 2.9.0",
    "date": "07-16-2020 16:25"
}}}

**The jsreport 2.9.0 is here.**  

The main goal of the release is to bring features related to the references between entities. This primarily improves import merge and bring folders copy feature.

## Import merge  

The import merge function now pairs entities also by the path. This means entities can be created in different environments and merge will properly pair them by path during import. This was not possible before, because the entities pairing was working only based on the id.

The import merge now also handles conflicts on shortid. When there is an entity with the same shortid in a different path, the shortid is regenerated, and references properly updated. This means the import merge is safe now and won't break the entities' relations.

## Folders copy and clone  

![folders-clone](/img/blog/folders-clone.gif)

The studio entity tree was improved and supports now folders copy and cloning. The folders copy and clone again works properly with entities' relations. The entities copied to a new path get new shortids and references are updated afterward. The folder clone function was heavily requested. We hope you like it is now part of the jsreport.

