/* istanbul ignore file */
import express from 'express';
import * as path from 'path';
import * as fs from 'fs-extra';

import { ConductTester } from './index-conduct';
import { Bend } from './conductor/interface/bend';

const app = express();
const port = 3000;

app.use("/assets", express.static('./src/assets'));
app.use("/out", express.static('./src/out'));

// ----- conduct -----
const bendView: Bend[] = [];
let view: any = null;

const startTime = new Date().getTime();
conduct();
console.log('..done(all)', (new Date().getTime() - startTime) / 1000)

function conduct() {
  const res = ConductTester.call({
    isRequiredMidiFile: true,
    compose: true
  });
  view = res?.view;
}

app.get('/2', (req, res) => {
  // tpl: index
  const file = "index2.html"
  const basePath = __dirname;
  const filename = path.resolve(__dirname, basePath.match(/src$/) ? 'assets/tpl' : 'src/assets/tpl')
  const tpl = fs.readFileSync(`${filename}/${file}`).toString()
      .replace(/\{bendArr\}/, JSON.stringify(bendView.map(m => m.pitch)))
      .replace(/\{label\}/, JSON.stringify(bendView.map(m => m.tick)))
      .replace(/\{view\}/, JSON.stringify(view));
  // send
  res.send(tpl);
});
app.listen(port, () => {
  //
})
