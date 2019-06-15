#
# This script verifies that the .zxp created with sign.zxp.sh is valid.
#

# Signature
#
#     ZXPSignCmd -verify <zxp>|<extensionRootDir> [options]
#
# http://wwwimages.adobe.com/www.adobe.com/content/dam/acom/en/devnet/creativesuite/pdfs/SigningTechNote_CC.pdf

zxppath="dist/fuse-fonts.zxp"

echo -e "\nVerifying '$zxppath'..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  bin/ZXPSignCmd -verify "$zxppath"
else
  bin/ZXPSignCmd.exe -verify "$zxppath"
fi

exit 0
