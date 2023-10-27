import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url); // path to the csv file

const stream = fs.createReadStream(csvPath); // creation of the stream by the 

// parsing the csv file to writable stream
const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip the header line
});

async function run() {
  const linesParse = stream.pipe(csvParse); 

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
    console.log(line)
    await wait(1000)
  }

}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}