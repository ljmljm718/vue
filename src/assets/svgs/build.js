const fs = require('fs');
const dir = './'

fs.readdir(dir, (err, files) => {
  if (err) {
      throw err;
  }

  // files object contains all files names
  // log them on console
  files.forEach(file => {
      console.log(`"${file.split('.')[0]}",`);
  });
});