const angular = require('conventional-changelog-angular');
const configPromise =
    typeof angular === 'function'
        ? angular()
        : angular.default
          ? angular.default()
          : angular;

module.exports = Promise.resolve(configPromise).then((configObj) => {
    // In conventional-changelog-angular v7+, the writer options are under 'writer' property
    const writerOpts = configObj.writer || configObj.writerOpts;
    
    return {
        ...configObj,
        writerOpts: {
            ...writerOpts,
            transform: (commit, context) => {
                // Clone the commit object to avoid mutating immutable objects
                const newCommit = {
                    ...commit,
                    notes: [...commit.notes],
                    references: [...commit.references]
                };
                // Also clone notes objects inside the array if we mutate them
                newCommit.notes = newCommit.notes.map(note => ({ ...note }));

                let discard = true;
                const issues = [];

                newCommit.notes.forEach(note => {
                    note.title = 'BREAKING CHANGES';
                    discard = false;
                });

                if (newCommit.type === 'feat') {
                    newCommit.type = 'Features';
                } else if (newCommit.type === 'fix') {
                    newCommit.type = 'Bug Fixes';
                } else if (newCommit.type === 'perf') {
                    newCommit.type = 'Performance Improvements';
                } else if (newCommit.type === 'revert' || newCommit.revert) {
                    newCommit.type = 'Reverts';
                } else if (discard) {
                    if (newCommit.type === 'chore') {
                        newCommit.type = 'Maintenance';
                    } else if (newCommit.type === 'docs') {
                        newCommit.type = 'Documentation';
                    } else if (newCommit.type === 'style') {
                        newCommit.type = 'Styles';
                    } else if (newCommit.type === 'refactor') {
                        newCommit.type = 'Code Refactoring';
                    } else if (newCommit.type === 'test') {
                        newCommit.type = 'Tests';
                    } else if (newCommit.type === 'build') {
                        newCommit.type = 'Build System';
                    } else if (newCommit.type === 'ci') {
                        newCommit.type = 'Continuous Integration';
                    } else {
                        return; // discard
                    }
                }

                if (newCommit.scope === '*') {
                    newCommit.scope = '';
                }

                if (typeof newCommit.hash === 'string') {
                    newCommit.hash = newCommit.hash.substring(0, 7);
                }

                // Ensure shortHash is available for the template
                if (!newCommit.shortHash && typeof newCommit.hash === 'string') {
                    newCommit.shortHash = newCommit.hash;
                }

                if (typeof newCommit.subject === 'string') {
                    let url = context.repository
                        ? `${context.host}/${context.owner}/${context.repository}`
                        : context.repoUrl;
                    if (url) {
                        url = `${url}/issues/`;
                        // Issue URLs
                        newCommit.subject = newCommit.subject.replace(
                            /#([0-9]+)/g,
                            (_, issue) => {
                                issues.push(issue);
                                return `[#${issue}](${url}${issue})`;
                            }
                        );
                    }
                    if (context.host) {
                        // User URLs
                        newCommit.subject = newCommit.subject.replace(
                            /\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g,
                            (_, username) => {
                                if (username.includes('/')) {
                                    return `@${username}`;
                                }

                                return `[@${username}](${context.host}/${username})`;
                            }
                        );
                    }
                }

                // remove references that already appear in the subject
                newCommit.references = newCommit.references.filter(
                    reference => {
                        if (issues.indexOf(reference.issue) === -1) {
                            return true;
                        }

                        return false;
                    }
                );

                return newCommit;
            }
        }
    };
});
