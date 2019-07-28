const fs = window.cep.fs;
import csInterface from "helpers/cs-interface.js";
import tryParseJSON from "helpers/tryParseJSON.js";


const backupDirectory = `${csInterface.getSystemPath(SystemPath.USER_DATA)}/${csInterface.getExtensionID()}`;
const backupFileName = `backup.json`;
const backupFilePath = `${backupDirectory}/${backupFileName}`;

const fileName = "backup service";
const color = "color: #b60;";
const log = (message) => {
  console.log(`${fileName}: %c${message}`, color);
}

const createFolderIfNotExists = () => {
  
  if (fs.readdir(backupDirectory).err !== fs.NO_ERROR) {
    log("Creating Directory for backups...");
    const result = fs.makedir(backupDirectory);
    if (result.err === fs.NO_ERROR) {
      log(`Created at "${backupDirectory}"`);
    }
    else {
      log(`Could not create directory. Error: ${result.err}`);
    }
  }

};

const saveJSON = (data) => {
  
  createFolderIfNotExists();
  log("Saving backup...");
  const result = fs.writeFile(backupFilePath, data);

  if (result.err === fs.NO_ERROR) {
    log(`Saved to "${backupFilePath}"`);
  }
  else {
    log(`Could not save backup file. Error: ${result.err}`);
  }
};

const loadJSON = () => {
  const result = fs.readFile(backupFilePath);

  if (result.err === fs.NO_ERROR) {
    return tryParseJSON(result.data);
  }
  else {
    return null;
  }

};

const lastBackup = () => {
  const result = fs.stat(backupFilePath);
  if (result.err === fs.NO_ERROR) {
    return new Date(result.data.mtime).toLocaleString();
  }
  else {
    return "Never";
  }
}

export default {

  backupDirectory,
  backupFileName,
  backupFilePath,

  lastBackup,

  save: (data) => saveJSON(data),
  load: () => loadJSON(),
  clear: () => saveJSON(""),
};
