# mathertale-blocks

Mathertale schemas and blocks.

## Installation

Install the package:

```bash
pnpm add mathertale-blocks
```

You need to compile Tailwind CSS for this module in your project. Edit your `global.css`:

```css
@source "../../node_modules/mathertale-blocks/dist/components.js";
```

### Math Support (Required for MarkdownContent component)

This package uses katex for mathematical expression rendering. You need to install katex as a peer dependency and import its CSS:

```bash
pnpm add katex
```

Then import the katex CSS in your application:

```javascript
// In your main CSS file or application entry point
import 'katex/dist/katex.min.css';
```

Or in your CSS/SCSS file:

```css
@import 'katex/dist/katex.min.css';
```

## CLI Usage

### Build Database

Recursively finds all journey and quest files and builds the database:

```bash
mathertale-build db ./
# or
mathertale-build db ./ --output ./data
```

**Warning**: You should not run this command in the root directory of your Mathertale project.

## Important Schemas

- `JourneySchema`
- `QuestSchema`
- `QuestShortSchema`
- `BlockSchema`

More information can be found in [src/schemas.ts](./src/schemas.ts).

## Adding a New Block Type

First you need to create the block file in blocks, which should offer:

- The block type string;
- The block data interface;
- The convert function.

Then add the convert function to `tagBlockMap` in "extract-content.ts". Also you need to export those types in "index.ts".

## Templates

```markdown
# Quest: Quest Name

id: test-id
desc: This is a test quest.

## Section: Introduction

### para: Welcome

id: para-welcome

This is the welcome paragraph.

## Section: Main Content

### Para: Explanation

id: para-explanation

This explains the concept.

### PARA: Conclusion

id: para-conclusion

This is the conclusion.
```

## Dev

Before committing or building, you should test, format, and lint. You can use the `check` script to do it all: `pnpm check`.

## Publishing to npm

1.  **Build the project:** Make sure your code is compiled to JavaScript (usually in the `dist/` folder). Check your `package.json` for the build script (e.g., `pnpm build`).
2.  **Update version:** Increment the `version` field in `package.json` according to semantic versioning rules.
3.  **Login to npm:** Run `npm login` in your terminal and enter your npm credentials.
4.  **Publish:** Run `npm publish`. If you use two-factor authentication, you might need to append `--otp=YOUR_OTP_CODE`.

## Scripts

- `dev`: Starts the local Storybook server, use this to develop and preview your components.
- `test`: Runs all your tests with vitest.
- `test:watch`: Runs tests in watch mode.
- `build`: Builds your Storybook as a static web application.
- `build:lib`: Builds your component library with Vite.
- `lint`: Runs ESLint.
- `format`: Formats your code with Prettier.

## License

MIT
