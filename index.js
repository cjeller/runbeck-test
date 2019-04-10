// include dependencies
const rl = require('readline-sync');
var fs = require('fs');

// Format Const Enum
const FORMAT = {
    TABS: "TABS",
    COMMAS: "COMMAS",
};

// Functions group

function promptQuestionOne() {
    const location = rl.question('Where is the file located? ');
    return fs.readFileSync(location);
}

function promptQuestionTwo() {
    const answer = rl.question('Is the file format CSV (Comma-separated values) or TSV (tab-separated values)? ');
    switch (answer.toLowerCase()) {
        case "csv":
        case "c":
            return FORMAT.COMMAS;
        case "tsv":
        case "t":
            return FORMAT.TABS;
        default:
            console.error("Invalid input. Expected csv or tsv");
            return undefined;
    }
}

function promptQuestionThree() {
    const fields = rl.question('How many fields should each record contain? ');
    if(Number.isInteger(parseInt(fields))) {
        return fields;
    } else {
        console.error("Invalid input. Expected an integer.")
        return undefined;
    }
}

function parseFile(file, format, fields) {
    const valid = [];
    const invalid = [];
    const lines = file.toString().split("\n");
    lines.forEach((line, index) => {
        // skip header row
        if (index === 0) {
            return;
        }
        // remove line endings
        line = line.trim();

        let lineArray = [];
        if (format === FORMAT.COMMAS) {
            lineArray = line.split(',');
        } else {
            lineArray = line.split('\t');
        }

        if (lineArray.length == fields) {
            let validContent = true;
            lineArray.forEach((segment) => {
                if (segment == '') {
                    validContent = false;
                }
            });
            if (validContent) {
                valid.push(line);
            } else {
                invalid.push(line);
            }
        } else {
            invalid.push(line);
        }
    });

    return { valid, invalid };
}

function printResultsToFile(output) {
    if (output.valid.length > 0) {
        const data = output.valid.join('\n');
        fs.writeFileSync("valid.txt", data);
    }
    if (output.invalid.length > 0) {
        const data = output.invalid.join('\n');
        fs.writeFileSync("invalid.txt", data);
    }
}

// MAIN FUNCTION

const main = () => {
    let format, fields, output;
    const file = promptQuestionOne();
    if (file) {
        format = promptQuestionTwo();
    }
    if (format) {
        fields = promptQuestionThree();
    }
    if (fields) {
        output = parseFile(file, format, fields);
    }
    if (output) {
        printResultsToFile(output);
    }

    process.exit(0);
}

main();