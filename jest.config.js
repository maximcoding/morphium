export default {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    extensionsToTreatAsEsm: ['.ts'],  // Treat .ts files as ESM
    collectCoverage: true,
    verbose: true,
    testEnvironment: 'node',
    preset: 'ts-jest',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',  // Resolve paths in a way compatible with ES Modules
        "^axios$": "axios/dist/node/axios.cjs"
    },
    globals: {
        'ts-jest': {
            useESM: true,  // Use ESM support in ts-jest
        },
    },
};
