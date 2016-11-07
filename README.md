# Intro to Redux: Reading Data from State 

## Objectives

* Set up the basic Redux architecture
* Use `Provider` to make  `store` available to your components
* Use `connect` and `mapStateToProps` to pass data from the store's state to your components
* Use an action creator function to dispatch an action that puts data in state.

## Introduction

In this code along, we'll be building a simple shopping list application that will allow a user to view an existing shopping list. 

Clone down this repo and run `npm install` to get started. 

### Step 1: Setting Up The Store

First things first, we'll use Redux to initialize our store and pass it down to your top-level container component. 

Redux provides a function, `createStore`, that, when invoked, returns an instance of the Redux store for us. 

We'll configure our store in `src/stores/configureStore.js`:

```javascript
import {createStore} from 'redux';

export default function configureStore() {
  return createStore();
}
```

Notice that we are importing the `createStore` function from Redux. We write our own function, which we've decided to call `configureStore`, to wrap the `createStore` function. So, in order to initialize our very own store instance, we'll need to actually call on `configureStore`. 

We'll do this in our `index.js` file, the entry point of our application. 


#### Using the Redux Store

We'll initialize our store in `index.js` and from here we'll make it available to our component tree. Note that right now, we only have one component, `App.js`, but this will change later when we create some child components that `App` will contain.

```javascript
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom'
import configureStore from './store/configureStore';
import App from './App';
import './index.css';```javascript
```

const store = configureStore();

ReactDOM.render(
   <App />,
  document.getElementById('root')
);
```

In order to make our store instance available to our component tree, contained (or soon to be contained) within `App`, we'll use a special component that React-Redux makes available to us. 

#### Using Provider to Make Store Available

The `<Provider>` component will wrap our component hierarchy and take in our store instance as a prop. It will then automatically make store available to our components (more on how we will work with store in the components coming up!)

Let's add the following code to our `src/index.js` file:

```javascript
import React from 'react';
import ReactDOM from 'react-dom'
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import {getShoppingListItems} from './actions/shoppingListItemActions'
import App from './App';
import './index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
   <App />
  </Provider>,
  document.getElementById('root')
);
```

We just did a few things:

* We imported `Provider` from React-Redux
* We used `Provider` to wrap our component hierarchy, contained in the `App` component
* We passed our store instance into `Provider` as a prop, making it available to all of our other components.

Now that our store is up and running, we're ready to define the reducer that our store will use to handle action dispatches and changes to state.

### Step 2: Defining the Reducer and Passing it to Store

### Step 3: Defining the `getShoppingList` Action

### Step 4: Connecting The Container Component to Store

#### Using `mapStateToProps`
#### Using `connect`

### Step 5: Rendering the List










