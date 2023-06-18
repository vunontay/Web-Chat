import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './components/Routes';
import { Helmet } from 'react-helmet';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Web Chat </title>
                    <link rel="canonical" href="http://mysite.com/example" />
                    <meta name="description" content="Helmet application" />
                </Helmet>
                <MainRoutes />
            </div>
        </BrowserRouter>
    );
}

export default App;
