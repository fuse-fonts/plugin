import { derived } from "svelte/store";

import { settings } from "stores/user-settings.js";
import { fontPreviewAvailable } from "stores/app-settings.js";

export const displayPreview = derived([fontPreviewAvailable, settings], ([$fontPreviewAvailable, $settings], set) => {
  const value = $fontPreviewAvailable && $settings.previewFont;
  //console.log({ $fontPreviewAvailable, previewFont: $settings.previewFont, value })
  set(value);
}, false)