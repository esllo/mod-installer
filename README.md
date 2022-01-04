# mod-installer
simple minecraft fabric, mod installer

## run
`yarn electron`

## build
`yarn build:win`  
> generated portable exe is located in `/dist/modpack-installer.exe`

## fabric.zip
```
/fabric
|--- /bin
     |--- fabric.exe  # launch4j wrapped exe

|--- /jre             # launch4j private jre for launch fabric.exe
     |--- /bin
     |--- /lib
     |--- ...
     
|--- /packs           # zip files of mods and shaderpacks in %APP_DATA%\.minecraft 
     |--- mods.zip
     |--- shaderpacks.zip
```

## icons
- coconut-emoji https://blog.daum.net/coconut-emoji
  - mokoko_k.png
  - 32.gif
- discord https://discord.com/branding
  - discord_icon.png
- fabric https://fabricmc.net/
  - fabric_icon.png
- minecraft
  - modded_icon.png
