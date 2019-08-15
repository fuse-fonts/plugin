# This script uses the self-signed script to bundle and sign our extension into a zxp file
#
#
# Signature
#
#     ZXPSignCmd -sign <inputDir> <outputZxp> <p12> <p12Password> [options]
# 
# http://wwwimages.adobe.com/www.adobe.com/content/dam/acom/en/devnet/creativesuite/pdfs/SigningTechNote_CC.pdf

inputdir="build/"
outputdir="dist/fuse-fonts.zxp"

p12="certificate.p12"
p12password="bravecoffee"

# timestampserver="http://sha1timestamp.ws.symantec.com/sha1/timestamp"
timestampserver="http://timestamp.digicert.com"

echo "Signing and packaging '$inputdir' -> '$outputdir'"

if [[ "$OSTYPE" == "darwin"* ]]; then
  bin/ZXPSignCmd -sign "$inputdir" "$outputdir" "$p12" "$p12password" -tsa "$timestampserver"
else
  bin/ZXPSignCmd.exe -sign "$inputdir" "$outputdir" "$p12" "$p12password" -tsa "$timestampserver"
fi

exit 0
