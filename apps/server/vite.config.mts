import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => {
    // const rollupOptions = isSsrBuild ? { input: './src/main.ts' } : undefined;

    return {
        plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
        // build: {
        //     rollupOptions
        // }
    };
});
