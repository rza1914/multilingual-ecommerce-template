# Contributing to Multilingual E-Commerce Template

First off, thank you for considering contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and courteous to others.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node.js version, Python version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- Clear and descriptive title
- Detailed description of the proposed functionality
- Why this enhancement would be useful
- Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Follow the coding standards
5. Write/update tests as needed
6. Ensure all tests pass
7. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
npx husky install
```

### Running Tests

```bash
# Backend tests
cd backend
pytest --cov=app

# Frontend tests
cd frontend
npm run test
```

## 📏 Coding Standards

### Frontend (React/TypeScript)

- Follow TypeScript best practices
- Use functional components with hooks
- Use ESLint and Prettier for code formatting
- Write meaningful component and variable names
- Add JSDoc comments for complex functions
- Maintain 60%+ test coverage

**Code Style:**
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Run Prettier
npm run type-check    # TypeScript check
```

### Backend (Python/FastAPI)

- Follow PEP 8 style guide
- Use Black for code formatting (line length: 127)
- Use Flake8 for linting
- Write type hints for all functions
- Add docstrings for all classes and functions
- Maintain 70%+ test coverage

**Code Style:**
```bash
black app/           # Format code
flake8 app/          # Lint code
mypy app/            # Type checking (optional)
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks. Before each commit:

- ESLint & Prettier run on staged files
- TypeScript type checking
- Black formatter check
- Flake8 linting

## 📝 Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add JWT token refresh functionality

fix(cart): resolve calculation error in total price

docs(readme): update installation instructions

test(products): add unit tests for product service
```

## 🔄 Pull Request Process

1. **Update Documentation**: Update README.md or relevant docs for any changes
2. **Update Tests**: Add/update tests for new features or bug fixes
3. **Code Quality**: Ensure all quality checks pass:
   - All tests pass (backend & frontend)
   - Code coverage meets requirements (Backend: 70%, Frontend: 60%)
   - No linting errors
   - TypeScript type checks pass
4. **Descriptive PR**: Write a clear PR description including:
   - What changes were made
   - Why these changes were necessary
   - Any breaking changes
   - Screenshots (for UI changes)
5. **Link Issues**: Reference related issues using `Fixes #123` or `Closes #123`
6. **Review**: Wait for code review and address feedback
7. **CI/CD**: Ensure GitHub Actions checks pass

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested in multiple browsers (for frontend changes)
- [ ] Commits follow conventional commit format
- [ ] PR description is clear and complete

## 🎯 Priority Areas

We especially welcome contributions in these areas:

- **Tests**: Improving test coverage
- **Documentation**: Improving or translating documentation
- **Performance**: Optimization improvements
- **Accessibility**: A11y improvements
- **Internationalization**: Adding more language support
- **Bug Fixes**: Resolving existing issues

## 📞 Questions?

Feel free to:
- Open an issue for questions
- Start a discussion in GitHub Discussions
- Contact maintainers

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🚀

---

Made with ❤️ by the community
