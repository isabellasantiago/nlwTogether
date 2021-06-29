import {BrowserRouter, Route, Switch} from 'react-router-dom';


import { NewRoom } from "./pages/NewRoom";
import {Home} from "./pages/Home";
import { Room } from './pages/Room';

import {AuthContextProvider} from "./contexts/AuthContext";
import { AdminRoom } from './pages/AdminRoom';


function App() {
  //Switch - se uma das rotas for acessada, ele para de procurar por outras
  return (

    <BrowserRouter>
    <AuthContextProvider>
    <Switch>
    <Route path="/" exact component={Home}/>
    <Route path="/rooms/new" component={NewRoom}/>
    <Route path="/rooms/:id" component={Room}/>
    <Route path="/admin/rooms/:id" component={AdminRoom}/>
    </Switch>
    </AuthContextProvider>
    </BrowserRouter>

  );
}

export default App;
