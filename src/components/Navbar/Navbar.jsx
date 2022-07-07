import { AppNavBar } from 'baseui/app-nav-bar';
import { Blank } from 'baseui/icon';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'AuthContext';
import AppNameOverride from './AppNameOverride';

const Navbar = (props) => {
    const navigate = useNavigate();
    const auth = useAuthContext();
    const handleMainItemSelect = (item) => {
        if (item.label === 'Home') {
            navigate('/');
        } else if (item.label === 'Admin') {
            navigate('/admin');
        }
    };
    const handleUserItemSelect = (item) => {
        if (item.label === 'Profil') {
            navigate('/profile');
        } else if (item.label === 'Logout') {
            localStorage.removeItem('jwt');
            window.location.reload();
        }
    };
    const mainItems = [{ icon: Blank, label: 'Home' }];

    return (
        <>
            <AppNavBar
                title="Pexon"
                mainItems={mainItems}
                onMainItemSelect={handleMainItemSelect}
                onUserItemSelect={handleUserItemSelect}
                username={auth.name}
                userItems={[{
                    icon: Blank,
                    label: 'Logout'
                }]}
                overrides={{
                    AppName: {
                        component: AppNameOverride,
                    },
                }}
            />
            {props.children}
        </>
    );
};

export default Navbar;