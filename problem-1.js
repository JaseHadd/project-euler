/**
 * I've done this one in a bit of a weird way, which attempts to be performant
 * by skipping iterations. I'll benchmark it vs a regular loop at some point.
 * @param {Number} max 
 * @param {Number[]} steps 
 */
export default function sumRange(max, steps)
{
    console.log(`Finding sum of range 0-${max}, counting multiples of ${steps.join(',')}`);
    let total = 0;

    for (let i = Math.min(...steps); i < max; )
    {
        const remainders = steps.map(s => i % s);

        if (remainders.includes(0))
            total += i;

        i += Math.min(...remainders.map((r, i) => steps[i] - r));
    }

    console.log(total);
}