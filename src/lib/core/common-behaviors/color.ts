
import { Constructor } from './constructor';
import { ElementRef } from '@angular/core';

/** @docs-private */
export interface CanColor {
    color: ThemePalette;
}

/** @docs-private */
export interface HasElementRef {
    _elementRef: ElementRef;
}

/** Possible color palette values. */
export enum ThemePalette {
    Primary = 'primary',
    Second = 'second',
    Warn = 'warn',
    Default = ''
}

/** Mixin to augment a directive with a `color` property. */
export function mixinColor<T extends Constructor<HasElementRef>>(base: T, defaultColor: ThemePalette = ThemePalette.Default): Constructor<CanColor> & T {
    return class extends base {
        private _color: ThemePalette;

        get color(): ThemePalette {
            return this._color;
        }

        set color(value: ThemePalette) {
            const colorPalette = value || defaultColor;

            if (colorPalette !== this._color) {
                if (this._color) {
                    this._elementRef.nativeElement.classList.remove(`mc-${this._color}`);
                }

                if (colorPalette) {
                    this._elementRef.nativeElement.classList.add(`mc-${colorPalette}`);
                }

                this._color = colorPalette;
            }
        }

        constructor(...args: any[]) {
            super(...args);

            // Set the default color that can be specified from the mixin.
            this.color = defaultColor;
        }
    };
}
