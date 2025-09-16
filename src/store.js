import { writable } from "svelte/store";

export const userObj = writable(null)

export const projects = writable([{ id: '1', title: 'test' }])