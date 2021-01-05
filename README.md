# _Higher Order Component (HOC) in React_

<p align="center">
    <img src="./docs/logo-txtai.png"/>
</p>

## _HOC_
A higher order component (*HOC*) is a function that accepts your component as an argument and returns a new function that adds some feature to the component.
If you're familiar with the concept of decorators than basically *HOC* can be thought as a decorator function.

```python
@HOC
def ListComponent(props):
    # For simplicity ...
```

### _"Talk is cheap. Show me the code"_
Assume we're fetching "heavy" data from some open API. For the sake of simplicity we'll use open API from 
[*randomuser*](https://api.randomuser.me/?results=50). 

### _Component: Feed_
Any container that holds sequential data like users in our case but could be comments, posts, etc. can be thought of as `Feed`. <br>
Basically we can think of a `Feed` as 
```python
Feed = [FeedItem_1, FeedItem_2, ..., FeedItem_n]
```
Basic `Feed` component could be written extending `React.Component` class as below:
```js
class Feed extends Component {
  render() {
    console.log(this.props);
    const { loadingTime } = this.props;
    return (
      <div className="feed">
        {this.props.contacts.map(
          contact => <FeedItem contact={contact} />
        )}
        <p>Loading time {loadingTime} seconds</p>
      </div>
    );
  }
}
```
In this example our component displays the sequence of another component (child) `FeedItem`.

### _Component: FeedItem_
`FeedItem` could be anything in reality. In our case since we're fetching the user's info - we display user's photo, name and surname.
```js
const FeedItem = ({ contact }) => {
  return (
    <div className="col-sm-4 offset-4">
      <div className="row p-2" key={contact.email}>
          <div className="col-sm-2">
            <img
              className="rounded-circle"
              src={contact.thumbnail}
              role="presentation"
            />
          </div>
          <div className="feedData col-sm-9">
            <strong>{contact.name}</strong>
            <br />
            <small>{contact.email}</small>
          </div>
        </div>
    </div>
  );
};
```
Please note that since our component doesn't rely on state we make it functional instead of extending `React.Component`.

### _Component: App_
Where do `fetch(API)` actually takes place and how do we populate our `Feed` component with the users's data?
Ladies and gentlemen, our `App` compoenent is below:
```js
class App extends Component {
    state = { contacts: [] };
  
    componentDidMount() {
      fetch("https://api.randomuser.me/?results=50")
        .then(response => response.json())
        .then(parsedResponse =>
          parsedResponse.results.map(user => ({
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            thumbnail: user.picture.thumbnail
          }))
        )
        .then(contacts => this.setState({ contacts }));
    }
  
    render() {
      return (
        <div className="App">
          <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <a class="nav-link" href="#">
                  <h2>Higher Order Component (HOC)</h2>
                </a>
          </nav>
  
          <Feed contacts={this.state.contacts} />
        </div>
      );
    }
}
```
Note here how the rendering happens. Inside our `render()` function - we pass our `this.state.contacts` data we've got from API. <br>
For the first time before the data is loaded, our state is empty - `this.state.contacts = []` which is why our users won't see anything at all. <br>
At this point we don't have any errors or mistakes - *our app is working but wouldn't it be nice if we could somehow tell our users that they see empty screen due to the loading time - some loading text, perhaps?*<br>
This is where we introduce the `HOC` concept.

### _Component(HOC): Loading_

```js
const isEmpty = prop =>
    prop === null ||
    prop === undefined ||
  ( prop.hasOwnProperty("length") && prop.length === 0 ) ||
  ( prop.constructor === Object && Object.keys(prop).length === 0 );

const Loading = loadingProp => WrappedComponent => {
  class LoadingHOC extends Component {

      componentDidMount() {
        this.startTimer = Date.now();
      }

      componentWillUpdate(nextProps) {
        if (!isEmpty(nextProps[loadingProp])) {
          this.endTimer = Date.now();
        }
      }

      render() {
        return isEmpty(this.props[loadingProp]) ? 
        (
          <div className="loader">
            <p>
              Loading started...
            </p>
          </div>
        ) : 
        (
          <WrappedComponent {...this.props} loadingTime={((this.endTimer - this.startTimer) / 1000).toFixed(2)} />
        );
      }
  };

  return LoadingHOC;
};
```
`"What the hell have I just seen?"` - yeah, I've got this feeling too, bro.
<br>
Before going futher, let me first explain the two arrow functions staying on top of the component declaration: 
`const Loading = loadingProp => WrappedComponent => ...`. <br>
As someone wise once said: "A picture is worth a thousand words" - in our case the example:
```js
let add = (x, y) => x + y;
```
For humans the same function without shortcut `=>` which hipsters like to call "arrow function".
```js
function add(x, y) {
    return x + y;
}

// Somewhere in our code
add(3,4); // Works fine, returns 7.
```
Further, let's rewrite the above slightly different:
```js
function add(x) {
    function inner(y) {
        return x + y;
    }
    return inner;
}

// Somewhere in our code
add(3)(4) // Works fine, returns 7.
```
So, what we did in the example above could be described in two words:
[*closure*](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work?rq=1) and [*currying*](https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe#.w34c54qew).
<br>
Take a minute of break if the concepts are new to you, you've earned it? <br>
Feel good? Ok, then it's time to get from human's world back to Hipster's. Let's go.<br>
```js
const add = (x) => (y) => x + y;
```
Nice and easy. This is the same as the last example with the exception of using `=>`. The presense of more than one `=>` tell us that the <s>black magic</s> nested function calls are present. <br>
When JS interpreter see the first `=>` it understands that he need to return everything to the right of that but then it meets another `=>` to the right and that means another function - so, stop here and return that function till the <s>best time</s> next function invocation happens.

Now, let's come back to our original `HOC` component declaration, the line that said: "`loadingProp => WrappedComponent => ...`", remember? <br>
Now, it should make sense, basically it says:
```js
const Loading = function(loadingProp) {
    function inner(WrappedComponent) {
        // ...
    }
    return inner;
}
```

Now, the main question is:<br> 
_Q_: why do I need to know this `=>` hipster's language to understand the `HOC` concept being used? <br>
_A_: That's an excellent question, next question, plz.:-)<br>
<br>

### _HOC: Loading(Feed)_
Let's take a closer look at what happens inside the second `=>` call.
```js
(WrappedComponent) => {
    class LoadingHOC extends Component {

        componentDidMount() {
            this.startTimer = Date.now();
        }

        componentWillUpdate(nextProps) {
            if (!isEmpty(nextProps[loadingProp])) {
                this.endTimer = Date.now();
            }
        }

        render() {
            return isEmpty(this.props[loadingProp]) ? 
            (
            <div className="loader">
                <p>
                Loading started...
                </p>
            </div>
            ) : 
            (
            <WrappedComponent {...this.props} loadingTime={((this.endTimer - this.startTimer) / 1000).toFixed(2)} />
            );
        }
  };

  return LoadingHOC;
};
```
Here we define our new component called `LoadingHOC` which literally wraps our own `Feed` component and adds text `<p>Loading Started</p>` while we still `fetch(...) ing` data. <br>
Whenever we `fetch(...) ed` data the state inside `App` is going to be updated which would cause it to re-render.<br>
Here comes the important part:
<i>Within the `App` component we will pass the props to `LoadingHOC` component instead of calling and passing props directly to the `Feed` component.</i><br>
```python
"App.js" -> "LoadingHOC" -> "Feed"
```
This way the additional logic (in our case displaying `<p>Loading started...</p>`) wrapped completely inside the `LoadingHOC` component.
That means that we can reuse our `HOC` with as many other components as we need. <br>
Basically, that's the beauty of `HOC` concept in a way that we can 'inject' custom logic without ever touching the original component.
<br>
There is only one question that's probably confusing you: how do we actually wrap our `Feed` component by `LoadingHOC` component? Take a look below.

### _Wrapping_

Since JavaScript has super <s>unintuitive</s> convinient feature called [*closure*](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work?rq=1) allowing us to export `LoadingHOC` component directly.<br>
First of all inside `Feed.js` file we import our `Loading` component. You remember that double `=>` hipster syntax, right?
```js
import Loading from './HOC/Loading'
```
And at the end, after the `Feed` component's declaration, where you'd usually type:
```js
export default Feed;
```
but instead "decorate" your component wrapping it in `Loading` HOC.
```js
export default Loading("contacts")(Feed);
```
Isn't it nice?
<br>
<br>
<br>
*Your friend,<br>Igor*
