import 'node:process'

class Argument
{
    static String = new Argument('string', s => s);
    static Int = new Argument('int', parseInt);

    /**
     * @param {Argument} argType 
     * @returns {Argument}
     */
    static Array(argType)
    {
        return new Argument(`${argType.name}[]`, s => s.split(',').map(a => argType.converter(a)));
    }

    name
    converter

    constructor(name, converter)
    {
        this.name = name;
        this.converter = converter;
    }
}

class Command
{
    /** @type {string} */       name
    /** @type {Function} */     func
    /** @type {Argument[]} */   args

    /**
     * @param {string} name 
     * @param {Function} func 
     * @param  {...Argument} args 
     */
    constructor(name, func, ...args)
    {
        this.name = name;
        this.func = func;
        this.args = args;
    }
}

const print = console.log;

const exit = function(message, code)
{
    console.log(message);
    process.exit(code ?? 1);
}

const printCommands = function()
{
    class Column
    {
        /** @type {string} */
        name

        /** @type {Number} */
        length

        /** @type {(maxLength: number, fillString?: string) => string} */
        padder
    
        constructor(name, padder)
        {
            this.name = name;
            this.padder = padder;
            this.length = name.length;
        }

        pad(/** @type {string} */ value)
        {
            return ' ' + this.padder.call(value, this.textWidth()) + ' ';
        }

        addedValue(/** @type {string} */ value)
        {
            this.length = Math.max(value.toString().length, this.length);
        }

        textWidth() { return this.length; }
        cellWidth() { return this.textWidth() + 2; }
    }

    print('All available commands: ');

    const columns = [
        new Column('index', String.prototype.padStart),
        new Column('name', String.prototype.padEnd),
        new Column('args', String.prototype.padEnd)
    ];

    /** @type {string[][]} */
    let rows = [];

    const addRow = function(...values)
    {
        let cells = Array(columns.length);
        
        values.forEach((e, i) => cells[i] = e);
        cells = cells.fill('', values.length, columns.length + 1);

        rows.push(cells);
        cells.forEach((e, i) => columns[i].addedValue(e));
    }
    
    const topLeft       = '\u250c';
    const top           = '\u252c';
    const topRight      = '\u2510';
    const right         = '\u2524';
    const bottomRight   = '\u2518';
    const bottom        = '\u2534';
    const bottomLeft    = '\u2514';
    const left          = '\u251c';

    const horizontal    = '\u2500';
    const vertical      = '\u2502';
    const center        = '\u253c';

    for (let i = 0; i < allCommands.length; i++)
    {
        const command = allCommands[i];
        const args = command.args.map(a => a.name).join(',');
        addRow(i, command.name, args);
    }

    const borderRow = columns.map(c => horizontal.repeat(c.cellWidth()));

    print(topLeft + borderRow.join(top) + topRight);
    print(vertical + columns.map(c => c.pad(c.name)).join(vertical) + vertical);
    print(left + borderRow.join(center) + right);
    
    for (const row of rows)
    {
        const cells = row.map((e, i) => columns[i].pad(e));
        print(vertical + cells.join(vertical) + vertical);
    }

    print(bottomLeft + borderRow.join(bottom) + bottomRight);
}

const allCommands = [
    new Command('list', printCommands),
    new Command('sum-range', (await import('./problem-1.js')).default, Argument.Int, Argument.Array(Argument.Int))
]

if (process.argv.length === 2)
{
    exit('Please specify a command');
}

const args = process.argv.slice(2);
const commandArg = args.shift();

/** @type {Command} */
let command;

print(`Running command: ${commandArg}`);

if (/^\d*$/.test(commandArg))
{
    print('Interpreting as command index');
    const index = parseInt(commandArg);

    if (commandArg > allCommands.length - 1)
        exit('No such command');
    else
    {
        command = allCommands[index];
        print(`Found command: ${command.name}`);
    }
}
else
{
    print('Interpreting as command name');
    
    const found = allCommands.filter(c => c.name === commandArg);
    if (found.length === 0)
        exit('No such command');
    else if (found.length === 1)
        command = found[0];
    else
        exit('Multiple commands with this name, please use command indexes to specify');
}

print();

if (args.length !== command.args.length)
    exit('Incorrect argument length');

command.func(...args.map((e, i) => command.args[i].converter(e)));