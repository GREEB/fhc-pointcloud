const fs = require('fs')
var logger;
logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  
fs.readFile('../pos.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const d = JSON.parse(data)

  for (const key in d) {
          const element = d[key];
          console.log(element);
          setTimeout(function timer() {
            logger.write(JSON.stringify(element)) // append string to your file
          }, key * 3000);
  }
})
