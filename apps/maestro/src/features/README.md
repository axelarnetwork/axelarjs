# Features

The `features` folder contains all the components, logic, and assets needed for that feature. In our TypeScript-React application, we follow a feature-driven development approach, which means that each feature is self-contained and consists of a set of related components and functionality. We also follow the MVVM (Model-View-ViewModel) architecture pattern, which separates the UI (View) from the business logic (ViewModel) and the data (Model).

Here's an example folder structure for a feature called `RegisterToken`:

```
├── RegisterToken
│   ├── RegisterToken.state.ts   # Contains state management code for the feature
│   ├── RegisterToken.tsx        # Contains the main component for the feature
│   ├── hooks/                   # Contains custom React hooks used by the feature
│   ├── index.ts                 # Exports the main component and any other functionality for the feature
│   ├── SubComponent1.tsx        # Contains a smaller component used by the main feature component
│   └── SubComponent2.tsx        # Contains another smaller component used by the main feature component
```

Here are some references that you may find useful:

- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Model-View-ViewModel (MVVM)](https://en.wikipedia.org/wiki/docs/advanced/patterns/)
- [React Compound Pattern](https://www.patterns.dev/posts/compound-pattern)
