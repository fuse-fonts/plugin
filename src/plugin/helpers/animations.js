
const defaultOptions = { duration: 500, delay: 0, easing: 'ease-out', };

export const highlight = (el, backgroundColor = "var(--success-color)", options = defaultOptions, callback = null) => {

  const animation = el.animate([
    { backgroundColor: `${backgroundColor}`},
    { backgroundColor: 'transparent' },
  ], options);

  if (callback !== null) {
    animation.addEventListener('finish', callback);
  }
};