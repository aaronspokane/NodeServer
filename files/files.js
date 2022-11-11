var fs = require("fs");
var format = require("xml-formatter");

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

  const folders = {
    containerFolder: containerFolder,
    docFolder: docFolder,
    serverFolder: serverFolder,
    packages: packageFolder,
  };

  const files = {
    doc: {
      name: `Module_${req.body.moduleName}.txt`,
      path: docFolder,
      content: "",
    },
    releaseNote: {
      name: `ReleaseNotes_${req.body.moduleName}.txt`,
      path: containerFolder,
      content: "",
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
