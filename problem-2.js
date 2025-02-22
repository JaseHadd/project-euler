export function getFibonacciSequence(/** @type {number} */ limit)
{
    /** @type {number[]} */
    const values = [1, 2];

    /** @type {number} */
    let number;

    while ((number = values.at(-1) + values.at(-2)) <= limit)
        values.push(number);

    return values;
}

export function sumEvenFibonacciValues(/** @type {number} */ limit)
{
    return getFibonacciSequence(limit).filter(i => i % 2 == 0).reduce((a, b) => a + b, 0);
}