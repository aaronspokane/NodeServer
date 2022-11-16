const fs = require("fs");
const format = require("xml-formatter");
const fileUtility = require("./fileUtility.js");

const createFiles = (req) => {
  
  // Folders
  const containerFolder = req.body.modulePath + "/" + req.body.moduleName;
  const docFolder = containerFolder + "/Doc";
  const serverFolder = containerFolder + "/Server";
  const packageFolder = serverFolder + "/Packages";

  // Files
  const docFile = `Module_${req.body.moduleName}`;
  const pkgXml = req.body.packageConfigFilePath;
  const pkgConfigName = req.body.packageConfigName;  

  // Content
  const releaseNotesContent = fileUtility.releaseNoteContent(req);
  const settingsContent = fileUtility.settingXmlContent(req);
  const doBuildCopyContent = fileUtility.buildCopyContent(req);
  const gvMaxLength =  Math.max(...req.body.globalVariables.map(x => x.Name.length));  
  const svMaxLength =  Math.max(...req.body.serviceVariables.map(x => x.Name.length)); 
  const moduleCopyContent = fileUtility.moduleContent(req, gvMaxLength, svMaxLength);

  const folders = {
    containerFolder: containerFolder,
    docFolder: docFolder,
    serverFolder: serverFolder,
    packages: packageFolder,
  };

  const files = {    
    doc: {
      name: `${docFile}.txt`,
      path: docFolder,
      content: moduleCopyContent,
    },
    releaseNote: {
      name: `ReleaseNotes_${req.body.moduleName}.txt`,
      path: containerFolder,
      content: releaseNotesContent,
    },
    setting: {
      name: `settings.xml`,
      path: containerFolder,
      content: settingsContent,
    },
    doBuildCopy: {
      name: `DoBuildCopy.bat`,
      path: containerFolder,
      content: doBuildCopyContent,
    },    
  };

  // Create folders
  for (const [, value] of Object.entries(folders)) {
    if (!fs.existsSync(value)) {
      fs.mkdirSync(value);
    }
  }

  // Create Files
  for (const [key,] of Object.entries(files)) {
    writeFile(files[key].path, files[key].name, files[key].content);
  } 

  try {
    const data = fs.readFileSync(pkgXml, "utf8");

    var formattedXml = format(data, {
      indentation: "  ",
      collapseContent: true,
      lineSeparator: "\n",
    });

    writeFile(packageFolder, pkgConfigName, formattedXml);
  } catch (err) {
    console.error(err);
  }

};

const writeFile = (path, name, content) => {
  fs.writeFile(`${path}/${name}`, content, function (err) {
    if (err) throw err;

    console.log("File Saved!");
  });
};

module.exports = createFiles;
