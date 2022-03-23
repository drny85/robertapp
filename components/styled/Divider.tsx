import { ViewStyle } from 'react-native';

import styled from 'styled-components/native';

interface DividerProps {
    small?: boolean;
    large?: boolean;
    block?: boolean;
}
const Divider = styled.View<DividerProps>`
    margin: 10px;
    background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
    height: 2px;
    align-self: center;
    ${({ small, large, block }: any) => {
        switch (true) {
            case small:
                return `width: 70%`;
            case large:
                return `width: 90%`;
            case block:
                return `width: 100%`;
            default:
                return `width: 80%`;
        }
    }};
`;

export default Divider;
