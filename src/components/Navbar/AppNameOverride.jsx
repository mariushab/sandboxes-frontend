import { StyledAppName } from 'baseui/app-nav-bar';
import { useNavigate } from 'react-router-dom';

const AppNameOverride = (props) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };
    return <StyledAppName onClick={handleClick} {...props} />
};

export default AppNameOverride;