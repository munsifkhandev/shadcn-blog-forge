# Contributing to BlogApp

Thank you for considering contributing to BlogApp! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Component Guidelines](#component-guidelines)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## Development Setup

### 1. Fork the Repository
Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/blogapp.git
cd blogapp
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/blogapp.git
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

---

## How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/environment details

### Suggesting Features
1. Check if feature has been suggested
2. Use the feature request template
3. Clearly describe:
   - The problem it solves
   - Proposed solution
   - Alternative solutions
   - Additional context

### Submitting Changes
1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your fork
6. Open a pull request

---

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type unless absolutely necessary
- Use type inference when appropriate

**Example**:
```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = { ... };

// Avoid
const user: any = { ... };
```

### React Components
- Use functional components with hooks
- Use TypeScript for props
- Extract reusable logic into custom hooks
- Keep components focused and small

**Example**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
};
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `BlogCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `storage.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_KEYS`)

### Styling
- Use Tailwind CSS utility classes
- Follow shadcn/ui patterns
- Use semantic design tokens from `index.css`
- Avoid inline styles
- Keep classNames readable

**Example**:
```tsx
// Good
<div className="flex items-center gap-4 p-6 bg-card rounded-lg">
  ...
</div>

// Avoid
<div style={{ display: 'flex', padding: '24px' }}>
  ...
</div>
```

### Code Organization
```
src/
├── components/
│   ├── ui/           # shadcn components
│   └── ...           # shared components
├── pages/            # route components
├── lib/              # utilities
├── hooks/            # custom hooks
└── types/            # TypeScript types
```

---

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

### Examples
```bash
feat(auth): add password reset functionality

- Add forgot password page
- Implement email sending
- Add password reset form

Closes #123
```

```bash
fix(blog): resolve image loading issue

Fixed blog images not displaying on Safari
by updating image loading strategy.

Fixes #456
```

### Commit Best Practices
- Use present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Separate subject from body with blank line
- Reference issues/PRs in footer
- Be descriptive but concise

---

## Pull Request Process

### Before Submitting
1. ✅ Update documentation if needed
2. ✅ Add/update tests
3. ✅ Run linter: `npm run lint`
4. ✅ Test locally: `npm run dev`
5. ✅ Build successfully: `npm run build`
6. ✅ Update README if adding features

### PR Title Format
```
[Type] Brief description
```

**Examples**:
- `[Feature] Add user profile page`
- `[Fix] Resolve login redirect issue`
- `[Docs] Update installation guide`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe how to test

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests passing
```

### Review Process
1. Submit PR
2. Automated checks run
3. Code review by maintainers
4. Address feedback
5. Approval and merge

---

## Component Guidelines

### Creating New Components

**1. Use shadcn/ui when possible**
```bash
# Install shadcn component
npx shadcn-ui@latest add button
```

**2. Component Structure**
```typescript
// src/components/MyComponent.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  const [state, setState] = useState(false);

  return (
    <div className="my-component">
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
};
```

**3. Export Pattern**
```typescript
// src/components/index.ts
export { MyComponent } from './MyComponent';
export { OtherComponent } from './OtherComponent';
```

### Component Checklist
- [ ] TypeScript props interface
- [ ] Proper prop validation
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Loading/error states
- [ ] JSDoc comments (if complex)

---

## Testing Guidelines

### Unit Tests
```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// Login.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';

describe('Login Flow', () => {
  it('logs in user with valid credentials', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

### Testing Commands
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## Development Workflow

### 1. Sync with Upstream
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### 3. Make Changes
- Write code
- Test locally
- Commit frequently

### 4. Push Changes
```bash
git push origin feature/new-feature
```

### 5. Create Pull Request
- Open PR on GitHub
- Fill out PR template
- Wait for review

### 6. Address Feedback
- Make requested changes
- Push updates
- Re-request review

### 7. Merge
- Maintainer merges PR
- Delete feature branch
- Sync with upstream

---

## Common Tasks

### Adding a New Page
```bash
# 1. Create page component
src/pages/NewPage.tsx

# 2. Add route in App.tsx
<Route path="/new-page" element={<NewPage />} />

# 3. Add navigation link
<Link to="/new-page">New Page</Link>
```

### Adding a New UI Component
```bash
# 1. Install from shadcn (if available)
npx shadcn-ui@latest add dialog

# 2. Use in your component
import { Dialog } from '@/components/ui/dialog';
```

### Adding Form Validation
```typescript
// 1. Define Zod schema
const schema = z.object({
  field: z.string().min(3)
});

// 2. Use with React Hook Form
const form = useForm({
  resolver: zodResolver(schema)
});
```

---

## Getting Help

### Documentation
- [Main README](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Component Guide](./COMPONENTS.md)
- [API Reference](./API.md)

### Community
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Lovable Discord: Community chat

### Questions?
Feel free to:
- Open an issue
- Start a discussion
- Ask in Discord

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in project README

Thank you for contributing to BlogApp! 🎉

---

**Document Version**: 1.0  
**Last Updated**: 2024