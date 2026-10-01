# Bug Group: Assertion / Locator Mismatch (Demo Web Shop)

Affected test:
- `ui/tests/demo-web-shop/search-product.spec.ts` -> Change the sort order

Symptom:
- Assertion `toHaveValue("10")` failed — Received string: `https://demowebshop.tricentis.com/search?q=laptop&orderby=10`.

Root cause hypothesis:
- The page's `select` control uses `onchange="setLocation(this.value);"` which navigates to a URL using the option's value. The test expects the select element's `.value` to be `10`, but the DOM accessor returns the full navigation URL (depending on how the test reads the property or after navigation the select element may reflect a different value).

Suggested fixes:
- Assert the URL query parameter `orderby=10` after performing the selection, or assert the selected option's value via a direct evaluation before navigation.

Example fix (check URL):

```ts
await searchPage.selectSortOrder(searchData.knownProduct.sortLabel);
await expect(page).toHaveURL(/orderby=10/);
```

Or read selected option value (if navigation is prevented):

```ts
const selectedValue = await page.evaluate(() => {
  const sel = document.querySelector('#products-orderby') as HTMLSelectElement;
  return sel?.value;
});
expect(selectedValue).toBe('10');
```

Notes:
- Prefer asserting external effects (URL, visible product order) when UI triggers navigation.

