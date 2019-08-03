import tryParseJSON from "helpers/tryParseJSON.js";
import csInterface from "helpers/cs-interface.js";
import TypeFace from "datatypes/typeface.js";

export const applyTypeface = async (typeface, variant = null) => {

  const postScriptName = TypeFace.getPostScriptName(typeface, variant);
  console.log(`Applying "${postScriptName}"`);

  const result = await new Promise((resolve, reject) => {

    csInterface.evalScript(`applyTypefaceByPostScriptName("${postScriptName}")`, (result) => {
      let response = tryParseJSON(result);
      resolve(response);
    });

  });
  console.log("applyTypeface result:", result);
  return result;
}