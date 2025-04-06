import fs from 'fs';
import path from 'path';

import { sync as syncGlob } from 'glob';
import _chain from 'lodash/chain';

console.log(`CWD: ${process.cwd()}`);
console.log(`DIRNAME: ${__dirname}`);
console.log('')

// TODO: change this to your organization name
const ORG_NAME = '@cbnsndwch';

// TODO: customize this if your workspace structure is different
const workspaceDirs = [
    // check the monorepo root
    '.',
    // and every workspace
    ...syncGlob('{apps,libs,packages}/*')
];
console.log('checking for dependency version mismatches in these directories:');
console.log(workspaceDirs.map(dir => `  - ${path.join('.', dir)}`).join('\n'));
console.log('')

type Dict<T> = Record<string, T>;

type PackageDependencies = Dict<string>;

type DependencyEntry = {
    version: string;
    from: string;
};

let dependencyMap: Record<string, Set<DependencyEntry>> = {};

try {
    for (const workspaceDir of workspaceDirs) {
        const packageJsonPath = path.join(
            process.cwd(),
            workspaceDir,
            'package.json'
        );
        const exists = fs.existsSync(packageJsonPath);
        if (!exists) {
            console.log(
                `Skipping ${workspaceDir} as it does not have a package.json`
            );
            continue;
        }

        const pkg = require(packageJsonPath);
        const dependencies = Object.entries({
            ...(pkg.dependencies as PackageDependencies),
            ...(pkg.devDependencies as PackageDependencies)
        }).filter(([name]) => !name.includes(ORG_NAME));

        for (const [dependencyName, dependencyVersion] of dependencies) {
            // group by package name and keep all distinct versions
            if (!dependencyMap[dependencyName]) {
                dependencyMap[dependencyName] = new Set();
            }

            dependencyMap[dependencyName].add({
                version: dependencyVersion,
                from: pkg.name
            });
        }
    }

    const entries = Object.entries(dependencyMap)
        .map(([packageName, versions]) => {
            const entrySet = Array.from(versions);

            let kv: [string, Dict<string[]>] | null = null;

            try {
                const entries = Array.from(entrySet);

                // reduce the entries to a { [version: string] -> dependents[] } map
                const versions: Dict<string[]> = entries.reduce(
                    (acc, entry) => {
                        if (!acc[entry.version]) {
                            acc[entry.version] = [];
                        }

                        acc[entry.version].push(entry.from);

                        return acc;
                    },
                    {}
                );

                kv = [packageName, versions];
            } catch (err) {
                console.error(err);
            }

            return kv;
        })
        .filter(kv => {
            if (!kv) {
                return false;
            }

            const versions = kv[1];
            return Object.keys(versions).length > 1;
        }) as [string, Dict<string[]>][];

    const plain = Object.fromEntries(entries);

    fs.writeFileSync(
        `${__dirname}/dep-version-map.json`,
        JSON.stringify(plain, null, 4)
    );

    const mismatchCount = Object.keys(plain).length;
    if (mismatchCount === 0) {
        console.log('✅  no version mismatches found');
    } else {
        console.log(
            `⚠️  found ${mismatchCount} packages with version mismatches,`,
            `see details in ${path.resolve('.', 'dep-version-map.json')}`
        );
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
