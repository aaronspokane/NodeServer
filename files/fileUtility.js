const format = require("xml-formatter");

const releaseNoteContent = (req) => {
    let returnContent = `## MODULE: ${req.body.moduleName}\r\n`;
    returnContent     += `## CHANGES\r\n\n`;
    returnContent     += `Date: ${(new Date()).toLocaleDateString('en-US')}\r\n`;
    returnContent     += `Interface: ${req.body.moduleDescription}\r\n`;
    returnContent     += `Action: Added interface to package.`;
    return returnContent;
}

const settingXmlContent = (req) => {
    let returnContent = `<SettingsInfo>`;
    returnContent     += `<InstallInfo>`;
    returnContent     += `<MdlName>${req.body.serviceToEnable}</MdlName>`;
    returnContent     += `<Description>${req.body.serviceToEnable.replace(" - ", " ")} Module</Description>`;
    returnContent     += `<DocsPath>${req.body.docPath}</DocsPath>`;
    returnContent     += `</InstallInfo>`;
    returnContent     += `</SettingsInfo>`;

    returnContent = format(returnContent, {
        indentation: "  ",
        collapseContent: true,
        lineSeparator: "\n",
      });

    return returnContent;
}

const buildCopyContent = (req) => {
    let returnContent = `REM - ${req.body.moduleName}\r\n\n`;
    returnContent     += `if [%ModuleFldr%] == [] goto :eof\r\n`;
    returnContent     += `if [%Module%] == [] goto :eof\r\n\n`;
    returnContent     += `rmdir %ModuleFldr%\\%Module% /s /q\r\n`;
    returnContent     += `mkdir %ModuleFldr%\\%Module%\\Doc\r\n`;
    returnContent     += `mkdir %ModuleFldr%\\%Module%\\Server\r\n`;
    returnContent     += `mkdir %ModuleFldr%\\%Module%\\Server\\Packages\r\n`;
    returnContent     += `mkdir %ModuleFldr%\\%Module%\\Server\\ReleaseNotes\r\n\n`;
    returnContent     += `copy .\\Settings.xml %ModuleFldr%\\%Module%\r\n`;
    returnContent     += `copy .\\Doc\\*.txt %ModuleFldr%\\%Module%\\Doc\r\n`;
    returnContent     += `copy .\\Server\\Packages\\*.xml %ModuleFldr%\\%Module%\\Server\\Packages\r\n`;
    for(const [,value] of Object.entries(req.body.moduleDependencies)) {
        if(value !== "")
            returnContent     += `copy ..\\Assembly\\bin\\Release\\${value} %ModuleFldr%\\%Module%\\Server\r\n`;
    }
    returnContent     += `copy .\\ReleaseNotes_*.txt %ModuleFldr%\\%Module%\\Server\\ReleaseNotes\r\n`;
    returnContent     += `copy %Output%\\%Project%\\Interfaces\\Work\\%SetupFullName%.txt+ReleaseNotes_*.txt %Output%\\%Project%\\Interfaces\\Work\\%SetupFullName%.txt /B\r\n`;
    return returnContent;
}


module.exports = {
    releaseNoteContent,   
    settingXmlContent,
    buildCopyContent,
}