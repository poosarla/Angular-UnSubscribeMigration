const path = require('path');
const fs = require('fs');
const EOL = require('os').EOL;

var walkSync = function (dir, filelist) {

  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(dir + "/" + file, filelist);
    }
    else {
      if (file.indexOf("component.ts") > 1)
        filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

var list = walkSync("src/app");
console.log(list);

for (let filePath in list) {

  fs.readFile(list[filePath], { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      data = addUnSubscriptiontoSubscriber(data);
      fs.writeFile(list[filePath], data, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });

    } else {
      console.log(err);
    }
  });
}

function addUnSubscriptiontoSubscriber(componentdata) {

  var matchedcases = componentdata.match(/^[\s]*((?!=).)*[a-z,A-Z,0-9]{1,}[\n\r,\s]*.\bsubscribe\b/gm);

  if (matchedcases && matchedcases.length > 0) {

    matchedcases.forEach(function (eachSubscriberMatch, index) {

      componentdata = componentdata.replace(eachSubscriberMatch, "this.cmpSubscriber.subscriber" + (index + 1) + " = " + eachSubscriberMatch.trim());

    });

    if (componentdata.indexOf("cmpSubscriber") == -1)
      componentdata = componentdata.replace("constructor", "cmpSubscriber:any = {}" + EOL + "constructor");

    if (componentdata.indexOf("@AutoUnsubscribe") == -1) {

      componentdata = componentdata.replace("export class", "@AutoUnsubscribe" + EOL + "export class");

      componentdata = componentdata.replace("@Component({", "import { AutoUnsubscribe } from 'src/app/AutoUnSubscribe';" + EOL + EOL + "@Component({");

    }


    return componentdata;
  } else {

    return componentdata;

  }

}
