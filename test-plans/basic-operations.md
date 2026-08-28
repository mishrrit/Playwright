# Todo App Basic Operations

## Purpose

This test plan covers the basic operations for the TodoMVC demo app at `https://demo.playwright.dev/todomvc/#/`.

## Scope

- Add new todos
- Mark todos completed
- Filter todos by status: `All`, `Active`, `Completed`
- Clear completed todos

## Test scenarios

### 1. Add todos

- Start on the TodoMVC home page
- Enter `Buy groceries` in the input field
- Press Enter
- Enter `Read book`
- Press Enter
- Enter `Pay bills`
- Press Enter
- Verify the 3 todos appear in the list
- Verify the todo count shows `3`

### 2. Complete a todo and verify filters

- Start on the TodoMVC home page
- Add `Buy groceries`
- Add `Read book`
- Mark `Buy groceries` complete
- Click `Active`
- Verify only `Read book` is visible
- Click `Completed`
- Verify only `Buy groceries` is visible
- Click `All`
- Verify both todos are visible

### 3. Clear completed todos

- Start on the TodoMVC home page
- Add `Buy groceries`
- Add `Read book`
- Mark `Read book` complete
- Click `Clear completed`
- Verify only `Buy groceries` remains
- Verify the todo count shows `1`
- Verify `Read book` is removed from the list
