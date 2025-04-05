// add packages you don't want NCU to update here
const reject = [
    'turbo', // turbo ships codemods to help migrations
];

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'pnpm',
    deep: true,
    reject
};
