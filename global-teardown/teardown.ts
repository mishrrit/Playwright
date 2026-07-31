/// <reference types="node" />
import { rm } from 'fs/promises';
import { resolve } from 'path';

export default async function globalTeardown() {
    console.log('Global teardown started.');

    const artifactsPath = resolve(__dirname, '..', 'test-results');
    try {
        await rm(artifactsPath, { recursive: true, force: true });
        console.log(`Removed test artifacts at ${artifactsPath}`);
    } catch (error) {
        console.warn(`Could not remove test artifacts at ${artifactsPath}:`, error);
    }

    console.log('Global teardown complete.');
}
