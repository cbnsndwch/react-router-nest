/* eslint-disable no-console */
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import { sync } from 'glob';
import { chain } from 'lodash';

console.log(`CWD: ${process.cwd()}`);
console.log(`DIRNAME: ${__dirname}`);

const ORG_NAME = '@cbnsndwch';

const packages = sync('{libs,apps}/*');

console.log(packages.join('\n'));

let depMap = {};

try {
    for (const p of packages) {
        const jsonPath = join(process.cwd(), p, 'package.json');
        const exists = existsSync(jsonPath);
        if (!exists) {
            console.log(`Skipping ${p} as it does not have a package.json`);
            continue;
        }

        const pkg = require(jsonPath);
        const dependencies = Object.entries({
            ...pkg.dependencies,
            ...pkg.devDependencies
        }).filter(([name]) => !name.includes(ORG_NAME));

        depMap = dependencies.reduce((acc, [name, version]) => {
            // group by package name and keep all distinct versions
            if (!acc[name]) {
                acc[name] = new Set();
            }
            acc[name].add({ version, from: pkg.name });
            return acc;
        }, depMap);
    }

    const plainDepMap = Object.fromEntries(
        Object.entries(depMap).map(([packageName, versions]) => {
            return [packageName, Array.from(versions)];
        })
    );

    const entries = chain(Object.entries(plainDepMap))
        .map(
            /**
             * @param {[packageName: string, Set<{version: string, from: Array}]>} entries
             */
            function ([packageName, entrySet]) {
                try {
                    const entries = Array.from(entrySet);

                    // reduce the entries to a map of version -> array of dependents
                    const versions = entries.reduce((acc, entry) => {
                        if (!acc[entry.version]) {
                            acc[entry.version] = [];
                        }
                        acc[entry.version].push(entry.from);
                        return acc;
                    }, {});

                    return [packageName, versions];
                } catch (err) {
                    console.error(err);
                }
            }
        )
        .filter(([, versions]) => Object.keys(versions).length > 1)
        .value();

    // const plain = entries;
    const plain = Object.fromEntries(entries);

    writeFileSync(
        `${__dirname}/dep-version-map.json`,
        JSON.stringify(plain, null, 4)
    );

    console.log('done');
} catch (e) {
    console.error(e);
}
