import { writable } from 'svelte/store';

const isAuthenticated = writable(false);
export default isAuthenticated;
