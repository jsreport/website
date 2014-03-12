var jsrRoot = document.getElementById("jsr-root");

jsrRoot.innerHTML = 
"<form target='_blank' method='POST' enctype='multipart/form-data' action='https://playground.jsreport.net/api/report' id='jsrForm' >" + 
"<div><textarea id='jsrData' name='data'></textarea></div>" + 
"<input hidden='true' type='text' id='jsrShortid' name='template[shortid]' />" + 
"<input hidden='true' type='text' id='jsrVersion' name='template[version]' value='1' />" + 
"<div><input type='file' id='jsrFile' name='file' value='1' /></div>" +
"<div><button id='jsrDownload' type='submit'>Download</button></div>" +
"</form>";

document.getElementById('jsrShortid').value = jsrRoot.getAttribute("data-shortid");
document.getElementById('jsrVersion').value = jsrRoot.getAttribute("data-version");

if (jsrRoot.getAttribute("data-dataArea") != "true")
    document.getElementById('jsrData').style.display = "none";

if (jsrRoot.getAttribute("data-fileInput") != "true")
    document.getElementById('jsrFile').style.display = "none";