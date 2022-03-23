import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
    mode: 'light',
    BACKGROUND_COLOR: '#ffffff',
    TEXT_COLOR: '#212121',
    BUTTON_TEXT_COLOR: '#ffffff',
    PRIMARY_BUTTON_COLOR: '#2d6a4f',
    SHADOW_COLOR: '#646262a6',
    ASCENT: '#3a0ca3',
    CARD_BACKGROUND: '#f8f9fa',
    SECONDARY_BUTTON_COLOR: '#3d405b',
    STATUS_BAR: 'dark',
    WHITE_COLOR: '#ffffff'
};

export const darkTheme: DefaultTheme = {
    mode: 'dark',
    BACKGROUND_COLOR: '#212121',
    TEXT_COLOR: '#fff',
    BUTTON_TEXT_COLOR: '#ffffff',
    CARD_BACKGROUND: '#14213d',
    ASCENT: '#3a0ca3',
    PRIMARY_BUTTON_COLOR: '#8f5757',
    SHADOW_COLOR: '#646262a6',
    SECONDARY_BUTTON_COLOR: '#3d405b',
    STATUS_BAR: 'light',
    WHITE_COLOR: '#ffffff'
};
