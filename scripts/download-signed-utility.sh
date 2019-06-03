
# This file will try to download the correct ZXPSignCMD for this OS to the current directory
# ZXPSignCmd is required to sign the extension

echo -e "\nRunning script to download the correct ZXPSignCMD for this OS..."

if [ ! -d "bin" ]; then
  echo -e "Creating /bin"
  mkdir bin
fi

cd bin  > /dev/null # redirect the output to not be seen in the script

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo -e "Downloading ZXPSignCMD for OSX\n"
  # Mac OSX
  curl -O -L "https://github.com/Adobe-CEP/CEP-Resources/raw/master/ZXPSignCMD/4.0.7/osx10/ZXPSignCmd.dmg"
elif [[ "$OSTYPE" == "cygwin" ]]; then
  # POSIX compatibility layer and Linux environment emulation for Windows
  echo -e "Downloading ZXPSignCMD for Windows\n"
  curl -O -L "https://github.com/Adobe-CEP/CEP-Resources/raw/master/ZXPSignCMD/4.0.7/win64/ZXPSignCmd.exe"
elif [[ "$OSTYPE" == "msys" ]]; then
  # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
  echo -e "Downloading ZXPSignCMD for Windows\n"
  curl -O -L "https://github.com/Adobe-CEP/CEP-Resources/raw/master/ZXPSignCMD/4.0.7/win64/ZXPSignCmd.exe"
  echo ""
else
  echo -e "\n\nYou're running this from an unknown OS. You should try downloading the signing utility yourself."
  echo "https://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD"
  cd -;
  exit 1
fi


cd - > /dev/null # redirect the output to not be seen in the script

echo -e "Done.\n"
exit 0