const path               = require('path');
const glob               = require('glob');
const SingleEntryPlugin  = require('webpack/lib/SingleEntryPlugin');
const cordovaAssetTree   = require('corber/lib/targets/cordova/utils/cordova-assets');

function CorberWebpackPlugin () {};

CorberWebpackPlugin.prototype.apply = function(compiler) {
  let context = compiler.context;
  let platform = process.argv.includes('--CORBER_PLATFORM=android')? 'android' : 'ios';
  let cdvAssets = cordovaAssetTree.getPaths(platform, './corber/cordova');
  let basePath = path.join('./corber/cordova', cdvAssets.assetsPath)

  cdvAssets.files.forEach((file) => {
    if (file === 'plugins/**') {
      //need to build the tree until corber/cordova/utils/cordova-assets is upgraded
      let plugins = glob.sync(path.join(basePath, 'plugins/**/*.js'));
      plugins.forEach((plugin) => {
        compiler.apply(new SingleEntryPlugin(
          context,
          path.join(process.cwd(), plugin),
          plugin.replace(basePath + '/', '')
        ));
      });
    } else {
      let filePath = path.join(process.cwd(), './corber/cordova', cdvAssets.assetsPath, file);
      compiler.apply(new SingleEntryPlugin(
        context,
        filePath,
        file
      ));
    }
  });
};

module.exports = CorberWebpackPlugin;
