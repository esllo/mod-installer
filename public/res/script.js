const DISCORD_INVITE = "<DISCORD_INVITE_URL>";

const overlay = document.getElementsByClassName("content-overlay")[0];

function toggleOverlay(value) {
  if (value === undefined) {
    overlay.classList.toggle("show");
  } else {
    overlay.classList[!!value ? "add" : "remove"]("show");
  }
}

function handleButtonClick(event) {
  const { className } = this;
  console.log(this);
  if (className.includes("fabric")) {
    toggleOverlay(true);
    installFabric().then(() => {
      toggleOverlay(false);
    });
  } else if (className.includes("modpack")) {
    toggleOverlay(true);
    installPacks().then((response) => {
      if (response.result) {
        showAlert("모드팩 설치가 완료되었습니다.");
      } else {
        showAlert("모드팩 설치에 실패했습니다.\n" + response.message, true);
      }
      toggleOverlay(false);
    });
  } else {
    openExternalBrowser(DISCORD_INVITE);
  }
}

document.querySelector(".exit").onclick = closeWindow;

[...document.querySelectorAll(".button")].forEach((button) =>
  button.addEventListener("click", handleButtonClick)
);
