
{{{
    "title"    : "Release 0.3",
    "date"     : "03-30-2015 16:01"
}}}

**jsreport 0.3** is here!!!

This release is mostly about improving internal jsreport core parts however you can find there important bug fixes and features as well.

##New features and bug fixes

####Resaving configuration file
Many people were complaining that jsreport is updating the configuration file during every startup causing annoying problems with source controls. This annoying behavior went along with jsreport since the very first release, but now it is finally removed.

####Objects filtering in UI
The new release also contains some UI improvements where probably the most significant one is new filter added to the all lists.  This filter allows to search for particular object like a template by its name. Looks like nice to have, but it is really a must when you have plenty of templates or scripts.

####Running jsreport under a subpath
jsreport is usually hosted on the dedicated domain/subdomain or specific port however with the new release you should be able to host jsreport on the web server subpath as well.

####Scripts and child templates rendering
In the previous releases it was not possible to achieve some more complex scenarios like assemble a child template name dynamically or combine child templates with scripts. This should now work much better and allow to:

- use templating engine to construct child template name
- use script to load data which are propagated into the child template




##Source code improvements
The most of you probably don't care how the jsreport core is structured and implemented, but this release contains mostly the internal refactoring so I just quickly mention what is changed for those interested in contributing with pull requests.

The most of the refactoring tasks were about extracting jsreport core parts which are reusable and moving them into separated repositories. This makes jsreport code base much lighter and smaller packages we separated attracts more open source contributors what was immediately proven.

The main parts we separated includes following:

- replaced jaydata layer with [simple-odata-server](https://github.com/pofider/node-simple-odata-server)
- scripts execution moved to the separate package [script-manager](https://github.com/pofider/node-script-manager)
- phantom html->pdf conversion moved to separate package [phantom-html-to-pdf](https://github.com/pofider/phantom-html-to-pdf)
- html->xlsx conversion moved to separate package [html-to-xlsx](https://github.com/pofider/html-to-xlsx)

