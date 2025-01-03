export enum DropdownPosition {
  BottomRight = "absolute top-full right-0",
  BottomLeft = "absolute top-full left-0",
  TopRight = "absolute bottom-full right-0",
  TopLeft = "absolute bottom-full left-0",
  BottomCenter = "absolute top-full left-1/2 -translate-x-1/2",
  TopCenter = "absolute bottom-full left-1/2 -translate-x-1/2",
  Custom = "absolute",
}

export enum DropdownAnimation {
  FromTop = "-translate-y-full opacity-0",
  FromBottom = "translate-y-full opacity-0",
}
