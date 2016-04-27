# Atom Compile Less (pw)

LESS compiler package modeled on the [Atom Compile Less](https://atom.io/packages/atom-compile-less) for the awesome Atom.io Editor.

Use node.js and [lessc](http://lesscss.org/)

**The files are compiled while saving**

# Settings

Add on top of the file to be compiled, comment.

Example: (css/less/layout.less), this file is compile on save.
```less
// out: ../layout.css, compress: true

@import "colors.less";

.foo {
  p {
    color: @textColor;
  }
}

```

Example (css/less/colors.less), on save this file compile 'layout.less' (output to layout.css)
```less
// main: ./layout.less
@textColor: #888;
```

The comment will compile two files
```less
// main: ./layout.less|../admin/layout-admin.less
@textColor: #888;
```

---
Manual Atom config (config.cson) is not required.
```
"*":
  "atom-compile-less-pw":
    showSuccessMessage: true
```

**Show Success Message:** Throws Atom Success Notification when files compiled

