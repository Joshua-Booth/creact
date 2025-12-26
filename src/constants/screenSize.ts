export const isMobile = (): boolean => {
  return window.innerWidth < 768
}

export const isTablet = (): boolean => {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024
}
EOF && rm -f src/constants/screenSize.js && git add -A && git commit -m "refactor: convert screenSize to TypeScript, remove old JS file"