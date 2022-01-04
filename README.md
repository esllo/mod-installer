# mod-installer
simple minecraft fabric, mod installer

## run
`yarn electron`

## build
`yarn build:win`  
> generated portable exe is located in /dist/modpack-installer.exe

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
