import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                icon?: string;
                width?: string | number;
                height?: string | number;
                flip?: string;
                rotate?: string | number;
                mode?: string;
                inline?: boolean;
                'stroke-width'?: string | number;
            }, HTMLElement>;
        }
    }
}
