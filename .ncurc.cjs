// add packages you don't want NCU to update here
const reject = [
    // turbo ships codemods to help migrations so we leave it alone
    'turbo', 
];

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'pnpm',
    deep: true,
    reject
};
