import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';

// Cleanup DOM after each test
afterEach(() => {
	cleanup();
});
