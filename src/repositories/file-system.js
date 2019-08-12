const fs = window.cep.fs;
import csInterface from "helpers/cs-interface.js";
import tryParseJSON from "helpers/tryParseJSON.js";
import { info, error } from "helpers/logger.js";


const backupDirectory = `${csInterface.getSystemPath(SystemPath.USER_DATA)}/${csInterface.getExtensionID()}`;
const backupFileName = `backup.json`;
const backupFilePath = `${backupDirectory}/${backupFileName}`;

const serviceName = "backup service"; // for logging

const createFolderIfNotExists = () => {
  
  if (fs.readdir(backupDirectory).err !== fs.NO_ERROR) {
    info("Creating Directory for backups...", backupDirectory, serviceName);
    const result = fs.makedir(backupDirectory);
    if (result.err === fs.NO_ERROR) {
      info(`Created at "${backupDirectory}"`, backupDirectory, serviceName);
    }
    else {
      error(`Could not create directory. Error: ${result.err}`, result, serviceName);
    }
  }

};

const saveJSON = (data) => {
  
  createFolderIfNotExists();
  info("Saving...", backupFilePath, serviceName);
  const result = fs.writeFile(backupFilePath, data);

  if (result.err === fs.NO_ERROR) {
    info(`Saved.`, backupFilePath, serviceName);
  }
  else {
    error(`Could not save backup file. Error: ${result.err}`, result, serviceName);
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
