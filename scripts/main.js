var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; // mixin
var History = ReactRouter.History; // mixin
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');
/*
  App
*/

const App = React.createClass({
  render : function(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh seafood good"/>
        </div>
        <Order />
        <Inventory />
      </div>
    )
  }
});

/*
  Header
*/

const Header = React.createClass({
  render : function(){
    console.log(this.props);
    return (
      <header className="top">
        <h1> Catch 
        <span className="ofThe">
          <span className="of">
            of 
          </span>
          <span className="the">
            the 
          </span>
        </span>
        
        Day </h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  }
});

/*
  Order
*/

const Order = React.createClass({
  render : function(){
    return (
      <p> Order </p>
    )
  }
});


/*
  Inventory
*/

const Inventory = React.createClass({
  render : function(){
    return (
      <p> Inventory </p>
    )
  }
});



/* 
  Storepicker
*/

const StorePicker = React.createClass({
  mixins : [History],

  goToStore : function(event){
    event.preventDefault();
    // get the data from input
    var storeId = this.refs.storeId.value;
    console.log(storeId);

    // transition to <StorePicker/> to <App/>

    this.history.pushState(null, '/store/' + storeId);
  },

  render : function(){
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit"/>
      </form>
    )
  }
});

/*
  404, Not Found
*/

const NotFound = React.createClass({
  render : function(){
    return (
      <h1> 404 Not found! </h1>
    )
  }
});


/* 
  Routes
*/

const routes = (
  <Router history={createBrowserHistory()}> 
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.getElementById('main'));