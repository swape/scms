# Plan

Backlog of items to develop and fix. Add new items under **To Do** with the appropriate category label.

Labels: `[Feature]` `[Bug]` `[Improvement]`

---

## important notes

- all editor components are in `src/components/editor/elements/` folder
- ElementList component should fetch all elements from the elements-list.ts file
- elements-list.ts file lists all elements/components that can be added to the page. Each element has a name, icon, and component path.
- ElementList component should display all elements in a list with their icon and name. When an element is clicked, it should be added to the page.
- Settings component should be able to edit the settings of the selected element. Each element has its own settings component that should be displayed in the Settings panel when the element is selected.

## To Do

- [x] [Feature] Add a Text element component with editable content via its own settings panel — `src/components/editor/elements/Text/`
- [ ] [Feature] Add color settings for text and background colors — `src/components/editor/elements/Page/index.svelte`
- [ ] [Feature] Add drag and drop to reorder pages — `src/components/editor/ListPagesContent.svelte`
- [ ] [Improvement] Add validation to project edit form — `src/components/project/Edit.svelte`
- [ ] [Feature] Save project to database and refresh projects in store — `src/components/project/Edit.svelte`
- [ ] [Feature] Fetch real project data from database — `src/components/projects/helper.ts`

## In Progress

<!-- Items actively being worked on -->

## Done

<!-- Completed items -->
