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
    for(const [,value] of Object.entries(req.body.extendedFacades)) {
        if(value !== "")
            returnContent     += `copy ..\\ExtendedFacades\\bin\\Release\\${value} %ModuleFldr%\\%Module%\\Server\r\n`;
    }
    returnContent     += `copy .\\ReleaseNotes_*.txt %ModuleFldr%\\%Module%\\Server\\ReleaseNotes\r\n`;
    returnContent     += `copy %Output%\\%Project%\\Interfaces\\Work\\%SetupFullName%.txt+ReleaseNotes_*.txt %Output%\\%Project%\\Interfaces\\Work\\%SetupFullName%.txt /B\r\n`;
    return returnContent;
}

const moduleContent = (req, gvMaxLength, svMaxLength) => {
    let returnContent = `-- ${req.body.moduleName} Config --\r\n\n`;
    returnContent     += `-- MAXQueueDesigner Settings Tab (shared settings - may already be configured):\r\n\n`;
    returnContent     += `Global Variables\r\n`;   
    returnContent     += `Name`+ ' '.repeat((gvMaxLength - 4) + 3) + `Value\r\n`;      
    for(const item of req.body.globalVariables)
    {
        const length = item.Name.length;
        returnContent     += `${item.Name}` + ' '.repeat((gvMaxLength - length) + 3) + `${item.Value}\r\n`;
    }
    returnContent     += `\r\nService Variables\r\n`; 
    returnContent     += `Name`+ ' '.repeat((svMaxLength - 4) + 3) + `Value\r\n`; 
    for(const item of req.body.serviceVariables)
    {
        const length = item.Name.length;
        returnContent     += `${item.Name}` + ' '.repeat((svMaxLength - length) + 3) + `${item.Value}\r\n`;
    }
    returnContent     += `\r\n**********************************************\r\n\n`; 
    returnContent     += `-- MAXQueueDesigner Data Event Definitions Tab:\r\n`; 
    returnContent     += `-- Enable All Below\r\n`; 
    returnContent     += ' '.repeat(3) + `[None]\r\n`; 
    returnContent     += `\r\n**********************************************\r\n\n`; 
    returnContent     += `-- Module Dependencies:\r\n\n`; 
    for(const [,value] of Object.entries(req.body.moduleDependencies)) {
        if(value !== "")
            returnContent     += ' '.repeat(3) + `${value}\r\n`;
    }
    for(const [,value] of Object.entries(req.body.extendedFacades)) {
        if(value !== "")
            returnContent     += ' '.repeat(3) + `${value}\r\n`;
    }
    returnContent     += `\r\n**********************************************\r\n\n`; 
    returnContent     += `-- Services to configure: \r\n\n`; 
    returnContent     += `-------------------------- \r\n`;
    returnContent     += `\r\n**********************************************\r\n`; 
    returnContent     += `\r\n-- Services to enable:\r\n\n`; 
    returnContent     += ' '.repeat(3) + `${req.body.serviceToEnable}\r\n\n`;
    returnContent     += `\r\n**********************************************\r\n\n`;
    returnContent     += `-- SQL to execute:\r\n\n`; 
    returnContent     += ' '.repeat(3) + `[None]\r\n\n`;
    
    return returnContent;
}


module.exports = {
    releaseNoteContent,   
    settingXmlContent,
    buildCopyContent,
    moduleContent,
}