# Project Folder Structure

Here's a brief description of each file and directory in the project:

- [`components`](./components/README.md): This directory contains reusable components that can be used throughout the project.
- [`compounds`](./compounds/README.md): This directory contains more complex components that are made up of smaller components.
- [`config`](./config/README.md): This directory contains configuration files for the project.
- [`features`](./features/README.md): This directory contains feature-specific components and logic. The features are developed following the MVVM/feature-driven development pattern.
- [`layouts`](./layouts/README.md): This directory contains layout components that are used to structure the UI.
- [`lib`](./lib/README.md): This directory contains utility functions and modules that can be used throughout the project.
- [`pages`](./pages/README.md): This directory contains the pages that make up the application.
- [`server`](./server/README.md): This directory contains the server-side code for the application. The server uses tRPC for communication between client and server.
- [`services`](./services/README.md): This directory contains code that interacts with external services or APIs.

## Why components, compounds and features?

- **Components**: These are basic building blocks of an application that represent a small, self-contained unit of functionality. In React, components can be broken down into presentational components and container components. Presentational components focus on how things look, while container components focus on how things work. When designing components for large-scale applications, it's important to follow best practices for React patterns, such as the render props pattern or the higher-order component pattern.

- **Compounds**: These are more complex components that are made up of smaller, reusable components. The React compound pattern is a common approach for building these complex components. The pattern involves breaking down the larger component into smaller, reusable components that are composed together to create the final component. This approach can make the code more modular and easier to reason about, as well as facilitate code reuse and reduce duplication.

- **Features**: These are sets of related components and functionality that are self-contained and independent from other parts of the application. Feature-driven development is a popular approach to building applications that emphasizes building features in isolation and focusing on user needs. In React, features can be built using an MVVM (Model-View-ViewModel) approach, which separates the data from the view and uses a view model to manage the data and state.

When designing an application, it's important to carefully consider the appropriate level of granularity for components, compounds, and features. Components should be small and focused, while compounds should be larger building blocks that are composed of smaller components. Features should be self-contained and independent from other parts of the application, with their own set of components and functionality. Following best practices for React patterns, MVVM, and feature-driven development can help ensure that your application is modular, scalable, and easy to maintain.

### Useful references:

- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Model-View-ViewModel (MVVM)](https://en.wikipedia.org/wiki/docs/advanced/patterns/)
- [React Compound Pattern](https://www.patterns.dev/posts/compound-pattern)
