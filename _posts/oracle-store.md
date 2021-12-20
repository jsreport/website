{{{
    "title": "Oracle store",
    "date": "04-16-2021 15:06"
}}}

**I'm excited to announce jsreport now supports storing report templates in the [Oracle database](https://www.oracle.com/database/).** This was possible only because of the contribution done by [@jorisdebock](https://github.com/jorisdebock). Thank you!

You can find the documentation [here](https://github.com/jsreport/jsreport-oracle-store), but the installation is pretty much standard to other jsreport template stores.

Installation...
```
npm i jsreport-oracle-store
```
Configuration...
```js
"store": {
  "provider": "oracle"
},
"extensions": {
  "oracle-store": {
    "user": "system",
    "password": "oracle",
    "connectString": "localhost:1521/xe",
  }
}
```
The only extra additional step required is to install [oracle instant client](https://www.oracle.com/database/technologies/instant-client/downloads.html)  and add it to the `PATH` environment variable.

For completeness, this is the table of the currently supported [template store](/learn/template-stores) providers.

| Documentation | Technology |
| ------------- | ---------- |
| [jsreport-fs-store](/learn/fs-store) | file system + Azure Storage + AWS S3 |
| [jsreport-mssql-store](https://github.com/jsreport/jsreport-mssql-store)| Microsoft SQL Server |
| [jsreport-postgres-store](https://github.com/jsreport/jsreport-postgres-store) | PostgreSQL|
| [jsreport-mongodb-store](https://github.com/jsreport/jsreport-mongodb-store) | MongoDB
| [jsreport-oracle-store](https://github.com/jsreport/jsreport-oracle-store) | Oracle

What's next? We will soon ship jsreport v3 and include also [blob storage](https://jsreport.net/learn/blob-storages) implementation to the oracle store. Actually, every sql based store will by default include the blob storage implementation for the most convenient use. And next? Would you like us to add [mysql](https://www.mysql.com/) store?
