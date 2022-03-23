import styled from 'styled-components/native';

interface ButtonProps {
    primary?: boolean;
    secondary?: boolean;
    small?: boolean;
    large?: boolean;
    block?: boolean;
}
const Button = styled.TouchableOpacity<ButtonProps>`
    margin: 10px;
    min-width: 125px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, secondary }) =>
        secondary ? theme.SECONDARY_BUTTON_COLOR : theme.PRIMARY_BUTTON_COLOR};
    border-radius: 25px;
    ${({ small, large, block }: any) => {
        switch (true) {
            case small:
                return `padding: 10px 20px`;
            case large:
                return `padding: 25px 60px`;
            case block:
                return `padding: 10px 20px`;
            default:
                return `padding: 20px 35px`;
        }
    }};
`;

export default Button;
