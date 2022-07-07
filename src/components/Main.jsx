import { Grid, Cell } from 'baseui/layout-grid';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Main = () => {
    return (
        <>
            <Navbar />
            <Grid>
                <Cell
                    overrides={{
                        Cell: {
                            style: ({ $theme }) => ({
                                marginTop: $theme.sizing.scale600,
                            })
                        }
                    }}
                    span={12}
                >
                    <Outlet />
                </Cell>
            </Grid>
        </>
    );
};

export default Main;
