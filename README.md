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

Now that our store is up and running, we're ready to define the actions that our store will dispatch and the reducer that our store will use to handle action dispatches and changes to state.

### Step 2: Action Creator Functions

Right now, we're just concerning with the 'reading' feature of our app––i.e., displaying an exisitng shopping list's items. So, we'll start out with just one action creator function, `getShoppingListItems`, which will return an action object with a payload of a few hard-coded shopping list items. 

Create a file, `src/actions/shoppingListItemActions.js`:

```javascript
export function getShoppingListItems() {
  const items = [{id: 1, description: "milk"}, {id: 2, description: "cookies"}, {id: 3, description: "sprinkles"}]
  return {type: 'GET_SHOPPING_LIST_ITEMS', payload: items}
}
```

Here, we've hard-coded in three shopping list items and saved them to a constant, `items`. We're returning a simple JavaScript object with a key of `type`, set to the string that indicates our action type, and a key of `payload`, set to our mini list of items. 

This action will get dispatched by our store instance and sent to the reducer. Let's build that reducer now.

### Step 3: Defining the Reducer and Passing it to Store

A reducer is a pure function (meaning it doesn't mutate data). An instance of store uses a reducer function to handle the dispatch of actions. Whatever is returned by a reducer function when inovked with a particular action becomes the new version of the store's internal state. 

Since our one store is managing the state for our entire application, the store's "internal state" will serve as our application state, and any changes to that state will result in all components that are connected to the one, single, central store to re-render. We'll be taking a closer look at the component side of things in a bit. 

Since the data that we are looking to render for a user is the "shopping list" data, i.e. the shopping list items, we'll build a reducer called `shoppingListItemsReducer`. 

Create a file `src/reducers/shoppingListItemReducer.js`:

```javascript
export default function shoppingListItemReducer(state = [], action) {
  switch(action.type) {
    case 'GET_SHOPPING_LIST_ITEMS':
     return action.payload
    default: 
      return state;
  }
}
```

Our reducer takes in two arguments:

* `state`, with a default value of an empty array
* `action`, which will be the action dispatched by the store

When our reducer recieves an action with a `type` of `'GET_SHOPPING_LIST_ITEMS'`, it will respond by returning that action's payload. Remember that we set our `'GET_SHOPPING_LIST_ITEMS'` action to have a payload of a hard-coded list of three items. 

Now that our reducer function is built, we'll use the `combineReducers` function that Redux makes available to use to give our store access to this reducer.

#### Using `combineReducers`

Good news––we don't need to build our own `combineReducers` function! We get one for free from Redux. In order to keep our code organized, we'll combine our reducers (although currently we only have one reducer) inside a file, `src/reducers/index.js`, and well pass that combined reducer into our store in our `configureStore` function.

Create the file `src/reducers/index.js` and add the following:

```javascript
import {combineReducers} from 'redux';
import shoppingListItems from './shoppingListItemReducer';

const rootReducer = combineReducers({
  // short hand property names
  shoppingListItems
})

export default rootReducer;
```

Then, add the following to `src/store/configureStore.js`

```javascript
import {createStore} from 'redux';
import rootReducer from '../reducers'

export default function configureStore() {
  return createStore(rootReducer);
}
```

It's important to understand what effect using `combineReducers` has on our application state. Using `combineReducers` creates a `state` object that has key/value pairs, named for the keys we give the object we pass to `combineReducers` as an argument. 

For example, if I call `combineReducers` like this:

```javascript
combineReducers({dogs: dogsReducer})
```

Then my store will have an internal state that looks like this:

```javascript
{dogs: //whatever gets returned by dogsReducer}
```

So, when we called `combineReducers` like this:

```javascript
combineReducers({
  shoppingListItems
  // this is short hand for shoppingListItems: shoppingListItems
})
```

We are creating a state object that looks like this:

```javascript
{shoppingListItems: //whatever gets returned by the shoppingListItems reducer}
```

Now our store instance that we intialize in `src/index.js` knows how to handle the dispatch of the `getShoppingListItems` action. So, let's dispatch our action. 

### Step 4: Dispatching the Action and Pre-Loading the Shopping List Items

We want our shopping list items to be preloaded as soon as anyone arrives at our app. So, we'll dispatch this action *outside* of our component tree, directly in `src/index.js`. 

```javascript
import React from 'react';
import ReactDOM from 'react-dom'
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import {getShoppingListItems} from './actions/shoppingListItemActions'
import App from './App';
import './index.css';

const store = configureStore();

store.dispatch(getShoppingListItems())


ReactDOM.render(
  <Provider store={store}>
   <App />
  </Provider>,
  document.getElementById('root')
);
```

The key line here is our action dispatch: `store.dispatch(getShoppingListItems())`. Note that we imported that function with the line:

```javasript
import {getShoppingListItems} from './actions/shoppingListItemActions'
```

So far we've:

* Initialized the store
* Built a reducer and taught it how to respond to an action
* Built an action creator function that gets us all the shopping list items

We can see that we are able to get the shopping list items and store them in state. Let's teach our components to render that by completing their connection to the store and getting the necessary data from state.


### Step 4: Connecting The Container Component to Store

Using the `<Provider>` component made available to use by React-Redux, we gave our components *the ability to be connected to the store*. We're not quite done actually making that connection. 

#### Using the `connect` function

In order for a component to be connected to the store, i.e. to be able to get data from the store's internal state and to be told to re-render and get new data when that state changes, we will use the `connect` function make avialable to us by React-Redux.

Here's how it works:

Open up `src/App.js` and add the following:

```javascript
import {connect} from 'react-redux';
 ...

const connector = connect()
const connectedComponent = connector(App)

export default connectedComponent;
```

We imported the `connect` function, we left the rest of our component as-is for now, and then we used that function at the bottom of our file in the following way:

* Calling `connect()` returns a brand-new function that we called `connector`
* Then, we invoke `connector` with an argument of our `App` component class
* This returns an instance of our fully connected component, which we export

This has the effect of subscribing `App` to the store, such that if the store's state changes, by for example dispatching an action that goes through a reducer, this component will re-render. 

However, we still haven't told our component how to get data from the store's internal state and display it. We'll use another special React-Redux function, `mapStateToProps` for that. 

#### Using `mapStateToProps`

The `mapStateToProps` function does pretty much what it sounds like it should: takes in state from the store, grabs portions of that state object, and makes them availbe to the component as part of `props`. Here's how it works:

Add the following to your `src/App.js` file:

```javascript
...

function mapStateToProps(state) {
  return {shoppingListItems: state.shoppingListItems}
}

const connector = connect(mapStateToProps)
const connectedComponent = connector(App)

export default connectedComponent;
```

*Note: We didn't have to import anything to define a `mapStateToProps` function!*

Before we take a look at how we defined our `mapStateToProps`, it's important understand how and when it will be invoked. 

We do not invoke this function ourselves. Instead, we pass it as an argument to our `connect` function invocation. The `connect` function has access to our store instance, courtesty of the `<Provider>` component. `connect` will call `mapStateToProps` for us, and pass it the store's internal state. 

So earlier, when we said that `<Provider>` makes the store available to our components, what we really meant is **`<Provider>` makes the store instances available to the `connect` function**. 


This level of abstraction is what makes Redux so **declarative**. We don't need to tell our component *how* to talk to the store, we just tell it *what* to do by using the `connect` function.

So, now that we understand how `mapStateToProps` gets called, and we understand that it takes an argument of the store's, i.e. the application's, state, let's dive into that function. 

First, let's ask ourselves, what information does our component need in order to show the user what they need to see?

Well, since this is a shopping list application, we definitely need to show the user the shopping list. So, we'll grab the shopping list items from state, and pass them to our component as `props`. 

Whatever we return from the `mapStateToProps` function should be an object with key/value pairs. These become the `props` of the component. 

So, because we return the following:

```javascript
{shoppingListItems: state.shoppingListItems}
```

we should be able to access the shopping list items inside our component under `this.props.shoppingListItems`. 

So, let's update the `render` function of our component to display this items contained in this prop.

### Step 5: Rendering the List

Our `render` function needs to `map` over the shopping list items and return a collection of list items, one for each shopping list item. 

Add the following to your `App` component:

```javascript
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React Shopping List</h2>
        </div>
        <ul className="list-group col-lg-6 col-lg-offset-3">
          {this.props.shoppingListItems.map((item, i) => {
            return <li key={i} className="list-group-item">{item.description}</li>
          })}
        </ul>
      </div>
    );
  }
}
```

Now our app should be up and running! Run `npm start` in the command line and we should see something that looks like this:

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/Screen+Shot+2016-11-07+at+4.36.35+PM.png)

We're *almost* done! We just need to organize our component a bit. 

### Step 6: Container vs. Presentational Component

We already know about the Single Responsibility Principle. If we apply that principle to our component tree, it follows that each component should have one job. So, our container component should be in charge of retreiving data from state. Currently, it is both getting data from state *and* displaying that data via the `render` function. 

Let's fix that by giving our `App` container component a child presentational component which we'll call `ShoppingList`.

Create a file, `src/ShoppingList.js`. We'll define our function presentational component here. 

```javascript
import React from 'react';

const ShoppingList = (props) => {
  return (
    <ul className="list-group col-lg-6 col-lg-offset-3">
      {props.items.map((item, i) => {
        return <li key={i} className="list-group-item">{item.description}</li>
      })}
    </ul>
  )
}

export default ShoppingList;
```

And we'll tell `App` to render this component, instead of rending the list of items directly:

```javascript
...
import ShoppingList from './ShoppingList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React Shopping List</h2>
        </div>
        <ShoppingList items={this.props.shoppingListItems} />
      </div>
    );
  }
}
...
```

Notice that we're passing the shopping list items that we took from state and made available to our `App` component as `this.props.shoppingListItems` down into our child component under the prop of `items`. 

### Conclusion

Before we go, let's sum up the overall flow of data through our application.

!()[https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/shopping-list-redux.png]










