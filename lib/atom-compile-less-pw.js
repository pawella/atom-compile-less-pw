var Function, atomCompileLess, compileFile, fs, getFileContents, less, path, parseFirstLine;

less = require("less");
fs = require("fs");
path = require("path");

Function = require("loophole").Function;

getFileContents = function (filePath, callback) {
   var content, read;
   content = '';
   return fs.readFile(filePath, 'utf-8', read = function (err, data) {
      if (err) {
         throw err;
      }
      return callback(data);
   });
};

// +++
parseFirstLine = function (content) {

   if (!content) {
      return null;
   } else {

      var firstLine = content.split('\n')[0];
      var conf = {};
      match = /^\s*\/\/\s*(.+)/.exec(firstLine);
      if(match) {
         firstLine.replace(/ /g,'')
            .trim()
            .split(',')
            .forEach(function(e,i,a) {
               var b = e.split(':');
               if(b[0]) {
                  k = b[0].replace('//','').replace(':','');
                  vt = v = b[1];
                  if(vt == "true") v = true;
                  else
                  if(vt == "false") v = false;
                  conf[k] = v;
               }

            });
         console.log('First line config', conf);
         return conf;
      } else {
         console.log('Less file not config output');
         return false;

      }
   }
   return firstLine;
};
// +++

compileFile = function (filepath) {
   var outputCompressed, showSuccessMessage, cssFilePath;
   outputCompressed = atom.config.get('atom-compile-less-pw.compressCss');
   showSuccessMessage = atom.config.get('atom-compile-less-pw.showSuccessMessage');
   return getFileContents(filepath, function (content) {
      var parser;
      if (!content) {
         throw err;
      }
      // +++
      var conf = parseFirstLine(content);
      if(!conf) {
         return;
      } else {
         if(conf.out) {
            cssFilePath = path.dirname(filepath) + '/' +conf.out;
            console.log(cssFilePath);
         } else {
            if(conf.main || typeof conf.main == "string") {
               conf.main.split("|").forEach(function(e) {
                  var main = path.dirname(filepath) + '/' +e;
                  return compileFile(main);
               });
            }
            return;
         }
         outputCompressed = conf.compress;
      }
      // +++
      parser = new less.Parser({
         paths: [path.dirname(filepath)]
      });
      return parser.parse(content, (function (_this) {
         return function (err, parsedContent) {
            var outputCss;
            if (err) {
               throw err;
            }
            outputCss = parsedContent.toCSS({
               compress: outputCompressed
            });
            // +++
            if(!cssFilePath) {
               cssFilePath = filepath.replace(".less", ".css");
            }
            // +++
            return fs.writeFile(cssFilePath, outputCss, function (err) {
               var fileName, message;
               if (showSuccessMessage) {
                  fileName = cssFilePath.split('/');
                  fileName = fileName[fileName.length - 1];

                  message = 'File <strong>' + fileName + '</strong> compiled!' + " comress: " + outputCompressed;
                  return atom.notifications.addSuccess(message);
               }
            });
         };
      })(this));
   });
};

atomCompileLess = function () {
   var currentEditor, currentFilePath, includeMainFile, projectMainLess, projectPath;
   currentEditor = atom.workspace.getActiveTextEditor();
   if (currentEditor) {
      currentFilePath = currentEditor.getPath();
      if (currentFilePath.substr(-4) === "less") {
         projectPath = atom.project.getPaths();
         // projectMainLess = atom.project.getPaths() + atom.config.get('atom-compile-less-pw.mainLessFile');
         // includeMainFile = atom.config.get('atom-compile-less-pw.compileMainFile');
         compileFile(currentFilePath);
         if (includeMainFile) {
            compileFile(projectMainLess);
         }
         return global.Function = Function;
      }
   }
};

module.exports = {
   config: {
      compressCss: {
         type: 'boolean',
         default: true
      },
      // mainLessFile: {
      //    type: 'string',
      //    default: 'main.less'
      // },
      // compileMainFile: {
      //    type: 'boolean',
      //    default: true
      // },
      showSuccessMessage: {
         type: 'boolean',
         default: true
      }
   },

   activate: (function (_this) {
      return function (state) {
         return atom.workspace.observeTextEditors(function (editor) {
            return editor.onDidSave((function (_this) {
               return function () {
                  return atomCompileLess();
               };
            })(this));
         });
      };
   })(this),
   deactivate: function () {
   },
   serialize: function () {
   }
};
