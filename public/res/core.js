const { ipcRenderer, shell } = require("electron");
const os = require("os");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const unzipper = require("unzipper");
const root = location.hash.substr(1);
let temp = null;

function createTemp() {
  if (!temp) {
    try {
      temp = fs.mkdtempSync(path.join(os.tmpdir(), "esl-mod-installer"));
    } catch (e) {
      temp = false;
    }
  }
}

function clearTemp() {
  if (temp) {
    try {
      return fs.rmSync(temp, { recursive: true });
    } catch (e) {
      return false;
    }
  }
}

function isExtracted() {
  return (
    fs.existsSync(temp + "/packs") &&
    fs.existsSync(temp + "/jre") &&
    fs.existsSync(temp + "/bin")
  );
}

function falseResult(message) {
  console.error(message);
  clearTemp();
  return {
    result: false,
    message,
  };
}

async function unzipTemp(temp) {
  return new Promise((res, rej) => {
    const tempStream = fs.createReadStream(`${root}/fabric.zip`);
    tempStream.on("end", res);
    tempStream.on("error", rej);
    tempStream.pipe(unzipper.Extract({ path: temp }));
  });
}

async function unzipPacks(modRaw, shaderRaw, modDest, shaderDest) {
  return new Promise((res, rej) => {
    let streamFinished = 0;
    function checkStream() {
      streamFinished++;
      if (streamFinished === 2) {
        res();
      }
    }

    const modStream = fs.createReadStream(modRaw);
    const shaderStream = fs.createReadStream(shaderRaw);

    modStream.on("end", checkStream);
    shaderStream.on("end", checkStream);

    modStream.on("error", () => {
      console.log("mod");
      rej();
    });
    shaderStream.on("error", () => {
      console.log("sha");
      rej();
    });

    modStream.pipe(unzipper.Extract({ path: modDest }));
    shaderStream.pipe(unzipper.Extract({ path: shaderDest }));
  });
}

async function installPacks() {
  createTemp();
  if (!temp) {
    return falseResult("임시 폴더를 생성할 수 없습니다.");
  }
  console.log("temp dir : " + temp);

  if (!isExtracted()) {
    await unzipTemp(temp);
  }

  const modRaw = `${temp}/packs/mods.zip`;
  const shaderRaw = `${temp}/packs/shaderpacks.zip`;

  const mcDest = `${process.env.APPDATA}/.minecraft`;
  const modDest = `${mcDest}/mods/`;
  const shaderDest = `${mcDest}/shaderpacks/`;

  const modPackExists = fs.existsSync(modRaw);
  const shaderPackExists = fs.existsSync(shaderRaw);

  if (!modPackExists || !shaderPackExists) {
    return falseResult("설치할 모드 또는 쉐이더 팩이 없습니다.");
  }

  const minecraftExists = fs.existsSync(mcDest);

  if (!minecraftExists) {
    return falseResult("마인크래프트 데이터 폴더를 찾을 수 없습니다.");
  }

  try {
    if (fs.existsSync(modDest)) {
      fs.renameSync(modDest, `${mcDest}/mods_${new Date().getTime()}`);
    }
    await unzipPacks(modRaw, shaderRaw, modDest, shaderDest);
    clearTemp();
    return {
      result: true,
    };
  } catch (e) {
    console.error(e);
    return falseResult("모드 또는 쉐이더 팩을 설치하는데 실패하였습니다.");
  }
}

async function installFabric() {
  createTemp();
  if (!temp) {
    return falseResult("임시 폴더를 생성할 수 없습니다.");
  }
  console.log("temp dir : " + temp);

  if (!isExtracted()) {
    await unzipTemp(temp);
  }

  const fabric = `start ${temp}\\bin\\fabric.exe`;

  child_process.execSync(fabric);

  clearTemp();
}

function closeWindow() {
  ipcRenderer.send("exit");
}

function showAlert(message, error = false) {
  ipcRenderer.send("alert", { message, error });
}

function openExternalBrowser(url) {
  shell.openExternal(url);
}
