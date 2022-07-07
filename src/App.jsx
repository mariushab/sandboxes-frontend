import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LightTheme, BaseProvider } from 'baseui';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from 'components/Main';
import Home from 'routes/Home';
import { AuthContextProvider } from 'AuthContext';
import { GraphQLProvider } from 'GraphQLContext';

const engine = new Styletron();
const queryClient = new QueryClient();

const App = () => {
    return (
        <StyletronProvider value={engine}>
            <BaseProvider theme={LightTheme}>
                <QueryClientProvider client={queryClient}>
                    <GraphQLProvider>
                        <AuthContextProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Main />}>
                                        <Route index element={<Home />} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </AuthContextProvider>
                    </GraphQLProvider>
                </QueryClientProvider>
            </BaseProvider>
        </StyletronProvider>
    )
};

export default App;
