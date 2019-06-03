# This script creates a self-signed certificate with the ZXPSignCMd

#   Signature:
#   `ZXPSignCmd -selfSignedCert <countryCode> <stateOrProvince> <organization> <commonName> <password> <outputPath.p12>`
#   http://wwwimages.adobe.com/www.adobe.com/content/dam/acom/en/devnet/creativesuite/pdfs/SigningTechNote_CC.pdf

# metadata about the certificate
country="US"
state="CA"
organization="FuseFonts"
filename="zxp.cert"

# p12 signature info
commonname="Fuse Fonts"
password="bravecoffee"

# outputPath.p12
output="certificate.p12"


# check if we're macOS or not so we run the right executable

echo "Creating a Self-Signed Certificate"

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Signing on macOS"
  bin/ZXPSignCmd.dmg -selfSignedCert "$country" "$state" "$organization" "$commonname" "$password" "$output"
else
  echo "Signing on Windows"
  bin/ZXPSignCmd.exe -selfSignedCert "$country" "$state" "$organization" "$commonname" "$password" "$output"
fi

exit 0